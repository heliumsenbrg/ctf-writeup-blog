-- =============================================================================
-- 留言板 / 评论 / 通关榜 —— 服务端反垃圾加固
-- 首次应用：2026-10-10（通过 WorkBuddy 云数据库 migrate 模式执行）
-- 目标库：wbapp_amJCk3tyxjtHbVB4JE3NNS
--
-- 背景：这三张表的 RLS 读策略是 `hidden = false`（也就是**审核机制的地基本来就有**），
--       但插入策略是 `WITH CHECK (true)` —— 任何人可以写任何内容。
--       所以真正的防线不在前端（前端过滤随手就能绕过），而在下面两处：
--         ① 屏蔽词表 + 触发器：可疑内容自动置 hidden=true → 访客永远看不到
--         ② 硬约束：控制字符这类纯垃圾直接拒绝（客户端收到 23514）
--
-- 设计取舍：
--   · 可疑内容**隐藏**而不是**拒绝** —— 让机器人以为发成功了，减少被针对；
--     真人被误判时前端会提示「已提交，待审核后显示」，不会一头雾水。
--   · 词表放数据库里而不是写死在触发器里 —— 想加词直接 INSERT，不用改代码。
--
-- 本文件是**幂等**的：可以反复执行。
--
-- ── 站长自助操作（都用云数据库 SQL 工具跑） ──────────────────────────────
--   看被拦下的内容：  SELECT id, nickname, content, created_at FROM guestbook
--                     WHERE hidden = true ORDER BY created_at DESC LIMIT 50;
--   放行一条：        UPDATE guestbook SET hidden = false WHERE id = <id>;
--   手动隐藏一条：    UPDATE guestbook SET hidden = true  WHERE id = <id>;
--   加屏蔽词：        INSERT INTO spam_blocklist(word, note) VALUES ('新词', '为什么加')
--                     ON CONFLICT DO NOTHING;
--   看词表：          SELECT word, note FROM spam_blocklist ORDER BY word;
--   删屏蔽词：        DELETE FROM spam_blocklist WHERE word = '误伤的词';
--   （comments / quest_board 同理，把表名换掉即可）
-- =============================================================================

DO $mod$
DECLARE
  n int;
BEGIN
  ---------------------------------------------------------------------------
  -- ① 屏蔽词表
  --    RLS 开启但**不给任何策略** → 前端/匿名用户读不到（不泄漏词表），
  --    只有下面的 SECURITY DEFINER 触发器以属主身份能读。
  ---------------------------------------------------------------------------
  CREATE TABLE IF NOT EXISTS public.spam_blocklist (
    word     text PRIMARY KEY,
    note     text,
    added_at timestamptz NOT NULL DEFAULT now()
  );
  ALTER TABLE public.spam_blocklist ENABLE ROW LEVEL SECURITY;

  -- 种子词：偏"高精度"选择，宁可漏也别误伤正常讨论。
  -- 已刻意排除容易误伤的通用词（如「刺激」「成人」「同城」）。
  INSERT INTO public.spam_blocklist (word, note) VALUES
    ('色情',   '招嫖类'),
    ('约炮',   '招嫖类'),
    ('裸聊',   '招嫖类'),
    ('一夜情', '招嫖类'),
    ('上门服务', '招嫖类'),
    ('看片',   '招嫖类'),
    ('少妇',   '招嫖类'),
    ('嫩模',   '招嫖类'),
    ('加微信', '引流'),
    ('加vx',   '引流'),
    ('微信号', '引流'),
    ('加qq',   '引流'),
    ('电报群', '引流'),
    ('telegram', '引流（若正常讨论需要，可 DELETE 掉这行）'),
    ('t.me',   '引流'),
    ('代开发票', '广告'),
    ('办证',   '广告'),
    ('贷款',   '广告'),
    ('博彩',   '广告'),
    ('赌场',   '广告'),
    ('娱乐城', '广告'),
    ('菠菜',   '广告'),
    ('刷单',   '广告'),
    ('兼职日结', '广告'),
    ('高薪兼职', '广告'),
    ('壮阳',   '广告'),
    ('伟哥',   '广告'),
    ('催情',   '广告'),
    ('春药',   '广告'),
    ('迷药',   '广告'),
    ('seo优化', '推广'),
    ('快排',   '推广'),
    ('代发外链', '推广'),
    ('porn',   'en'),
    ('viagra', 'en'),
    ('casino', 'en'),
    ('escort', 'en'),
    ('sexcam', 'en')
  ON CONFLICT (word) DO NOTHING;

  ---------------------------------------------------------------------------
  -- ② 通用审核函数
  --    命中任一规则 → hidden := true（插入照常成功，但访客看不到）
  ---------------------------------------------------------------------------
  CREATE OR REPLACE FUNCTION public.moderate_content() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
  DECLARE
    body  text;
    nick  text;
    links int;
    n     int;
  BEGIN
    nick := coalesce(NEW.nickname, '');

    -- quest_board 的正文列叫 quest，不是 content；
    -- plpgsql 的字段访问是运行时解析的，所以这里必须用分支，不能直接写 NEW.content
    IF TG_TABLE_NAME = 'quest_board' THEN
      body := coalesce(NEW.quest, '');
    ELSE
      body := coalesce(NEW.content, '');
    END IF;

    -- 规则 1：屏蔽词（正文或昵称命中任意一条）
    IF EXISTS (
      SELECT 1 FROM public.spam_blocklist b
      WHERE char_length(b.word) >= 2
        AND (position(b.word in lower(body)) > 0 OR position(b.word in lower(nick)) > 0)
    ) THEN
      NEW.hidden := true; RETURN NEW;
    END IF;

    -- 规则 2：昵称里塞链接 / 邮箱（正常昵称不会长这样）
    IF nick ~* '(https?://|www\.|\.(com|cn|net|org|top|xyz)([/?#]|[[:space:]]|$)|t\.me|@[a-z0-9_.-]{4,})' THEN
      NEW.hidden := true; RETURN NEW;
    END IF;

    -- 规则 3：链接数量。≥3 条基本是引流；短文本里带 1 条也多半是
    --         （纯发一条链接的垃圾也由这条兜住）
    links := (char_length(body) - char_length(replace(lower(body), 'http', ''))) / 4;
    IF links >= 3 OR (links >= 1 AND char_length(body) < 40) THEN
      NEW.hidden := true; RETURN NEW;
    END IF;

    -- 规则 4：复读刷屏（同一字符连续 ≥8 次）
    IF body ~ '(.)\1{7,}' THEN
      NEW.hidden := true; RETURN NEW;
    END IF;

    -- 规则 5：同一昵称 5 分钟内已发 ≥3 条 → 之后先隐藏（防单账号刷屏）
    EXECUTE format(
      'SELECT count(*) FROM public.%I WHERE nickname = $1 AND created_at > now() - interval ''5 minutes''',
      TG_TABLE_NAME) INTO n USING nick;
    IF n >= 3 THEN NEW.hidden := true; RETURN NEW; END IF;

    -- 规则 6：全局急刹车 —— 该表 1 分钟内新增 ≥12 条，说明正在被刷，
    --         这一批先全隐藏，宁可误伤也不让广告露出来
    EXECUTE format(
      'SELECT count(*) FROM public.%I WHERE created_at > now() - interval ''1 minute''',
      TG_TABLE_NAME) INTO n;
    IF n >= 12 THEN NEW.hidden := true; RETURN NEW; END IF;

    RETURN NEW;
  END $fn$;

  ---------------------------------------------------------------------------
  -- ③ quest_board 补 hidden 列（另两张表本来就有），并让读策略过滤隐藏项
  ---------------------------------------------------------------------------
  ALTER TABLE public.quest_board ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
  EXECUTE 'DROP POLICY IF EXISTS quest_board_read_all ON public.quest_board';
  EXECUTE 'DROP POLICY IF EXISTS quest_board_read_visible ON public.quest_board';
  EXECUTE 'CREATE POLICY quest_board_read_visible ON public.quest_board FOR SELECT USING (hidden = false)';

  ---------------------------------------------------------------------------
  -- ④ 挂触发器（三张表共用同一个函数）
  ---------------------------------------------------------------------------
  EXECUTE 'DROP TRIGGER IF EXISTS trg_moderate ON public.guestbook';
  EXECUTE 'CREATE TRIGGER trg_moderate BEFORE INSERT ON public.guestbook FOR EACH ROW EXECUTE FUNCTION public.moderate_content()';

  EXECUTE 'DROP TRIGGER IF EXISTS trg_moderate ON public.comments';
  EXECUTE 'CREATE TRIGGER trg_moderate BEFORE INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.moderate_content()';

  EXECUTE 'DROP TRIGGER IF EXISTS trg_moderate ON public.quest_board';
  EXECUTE 'CREATE TRIGGER trg_moderate BEFORE INSERT ON public.quest_board FOR EACH ROW EXECUTE FUNCTION public.moderate_content()';

  ---------------------------------------------------------------------------
  -- ⑤ 硬约束：控制字符（含换行/制表符之外的不可见字符）直接拒绝
  --    这类字符没有任何正常用途，只会用来撑版面或伪造昵称
  --    注：允许 \n 与 \t（留言本来就可以多行）
  ---------------------------------------------------------------------------
  ALTER TABLE public.guestbook DROP CONSTRAINT IF EXISTS guestbook_text_sane;
  ALTER TABLE public.guestbook ADD CONSTRAINT guestbook_text_sane
    CHECK (translate(nickname, E'\n\t', '') !~ '[[:cntrl:]]'
       AND translate(content,  E'\n\t', '') !~ '[[:cntrl:]]');

  ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_text_sane;
  ALTER TABLE public.comments ADD CONSTRAINT comments_text_sane
    CHECK (translate(nickname, E'\n\t', '') !~ '[[:cntrl:]]'
       AND translate(content,  E'\n\t', '') !~ '[[:cntrl:]]');

  ALTER TABLE public.quest_board DROP CONSTRAINT IF EXISTS quest_board_text_sane;
  ALTER TABLE public.quest_board ADD CONSTRAINT quest_board_text_sane
    CHECK (translate(nickname, E'\n\t', '') !~ '[[:cntrl:]]'
       AND translate(quest,     E'\n\t', '') !~ '[[:cntrl:]]');

  RAISE NOTICE '反垃圾加固已应用';
END $mod$;
