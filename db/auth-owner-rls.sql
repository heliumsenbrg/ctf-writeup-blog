-- =============================================================================
-- 登录用户才能写留言 / 评论 / 通关榜（RLS 所有者策略）
-- 2026-11-08 · 与 relay 的 LoginGate 配套
--
-- 背景：原来三张表是 `INSERT ... WITH CHECK (true)`。relay 层的登录门可以被
--       直连云后端绕过；这里把最终边界落到数据库。
--
-- 关键点：匿名态 auth.uid() 返回的是字符串 `"anon"`，不是 NULL。
--         所以必须用 auth.role() = 'authenticated' 判定，不能只写 IS NOT NULL。
--
-- 幂等：可反复执行。已有旧行的 user_id 为 null，不影响公开读取。
-- =============================================================================

ALTER TABLE public.guestbook ADD COLUMN IF NOT EXISTS user_id text DEFAULT auth.uid();
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS user_id text DEFAULT auth.uid();
ALTER TABLE public.quest_board ADD COLUMN IF NOT EXISTS user_id text DEFAULT auth.uid();

DROP POLICY IF EXISTS guestbook_insert_any ON public.guestbook;
DROP POLICY IF EXISTS comments_insert_any ON public.comments;
DROP POLICY IF EXISTS quest_board_insert_any ON public.quest_board;

DROP POLICY IF EXISTS guestbook_insert_own ON public.guestbook;
DROP POLICY IF EXISTS comments_insert_own ON public.comments;
DROP POLICY IF EXISTS quest_board_insert_own ON public.quest_board;

CREATE POLICY guestbook_insert_own ON public.guestbook
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY comments_insert_own ON public.comments
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY quest_board_insert_own ON public.quest_board
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND user_id = auth.uid());
