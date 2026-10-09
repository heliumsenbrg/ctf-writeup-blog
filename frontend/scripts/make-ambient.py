#!/usr/bin/env python3
"""
生成站点背景音乐（环境氛围 / ambient），输出 MP3 到 frontend/public/music/。

为什么自己合成而不是找现成曲子：授权干净（完全自产，无版权问题）、体积可控、
风格能对上站点的赛博暗色调。要换风格改下面的和弦/音色参数重跑即可。

用法：
    python frontend/scripts/make-ambient.py

依赖：numpy + ffmpeg（都在 PATH 里）。生成结果约 500 KB / 32 秒，可无缝循环。
"""
import math
import os
import subprocess
import sys
import wave

import numpy as np

SR = 44100            # 采样率
CHORD_SEC = 8.0       # 每个和弦 8 秒
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'music')
OUT_WAV = os.path.join(OUT_DIR, '_ambient_raw.wav')
OUT_MP3 = os.path.join(OUT_DIR, 'ambient-1.mp3')

# A 小调：Am - F - C - G，四个和弦共 32 秒，循环
# (根音 Hz, [和弦音 Hz...])
PROGRESSION = [
    (110.00, [220.00, 261.63, 329.63]),   # Am
    (87.31,  [220.00, 261.63, 349.23]),   # F
    (130.81, [261.63, 329.63, 392.00]),   # C
    (98.00,  [246.94, 293.66, 392.00]),   # G
]


def adsr(n, attack, release, sr=SR):
    """启动/收尾包络，中间保持 1.0。用来让和弦之间自然交接。"""
    env = np.ones(n)
    a = min(int(attack * sr), n // 2)
    r = min(int(release * sr), n // 2)
    if a > 0:
        env[:a] = np.linspace(0, 1, a) ** 1.6
    if r > 0:
        env[-r:] = np.linspace(1, 0, r) ** 1.6
    return env


def pad_tone(freq, n, detune=0.0035):
    """柔和合成器铺底：几次谐波 + 轻微失谐做合唱感。"""
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, amp in ((1, 1.0), (2, 0.32), (3, 0.13), (4, 0.05)):
        out += amp * np.sin(2 * math.pi * freq * k * t)
        # 失谐副本（制造缓慢的拍频，听感更"厚"）
        out += amp * 0.55 * np.sin(2 * math.pi * freq * k * (1 + detune) * t)
    return out


def main():
    seg = int(SR * CHORD_SEC)
    total = seg * len(PROGRESSION)
    mix = np.zeros(total)

    # ---- 铺底 + 低音 ----
    for i, (root, chord) in enumerate(PROGRESSION):
        off = i * seg
        env = adsr(seg, attack=2.2, release=2.2)
        layer = np.zeros(seg)
        for f in chord:
            layer += pad_tone(f, seg)
        layer /= len(chord)
        # 低音：根音降八度，正弦，量给足但别轰头
        t = np.arange(seg) / SR
        layer += 0.75 * np.sin(2 * math.pi * (root / 2) * t)
        mix[off:off + seg] += layer * env * 0.30

    # ---- 琶音：每个和弦内 8 分音符循环和弦音，指数衰减 ----
    step = int(SR * 0.5)                      # 0.5 秒一个音
    for i, (root, chord) in enumerate(PROGRESSION):
        off = i * seg
        pat = [chord[0], chord[1], chord[2], chord[1] * 2]   # 上行后翻高八度
        k = 0
        p = 0
        while p < seg:
            f = pat[k % len(pat)]
            n = min(step * 2, seg - p)
            if n <= 0:
                break
            t = np.arange(n) / SR
            tone = (np.sin(2 * math.pi * f * t) + 0.30 * np.sin(4 * math.pi * f * t))
            dec = np.exp(-t * 4.2)
            mix[off + p:off + p + n] += tone * dec * 0.085
            k += 1
            p += step
        _ = root

    # ---- 空气感：慢速起伏的带限噪声 ----
    rng = np.random.default_rng(20261010)     # 固定种子 → 可复现
    noise = rng.normal(0, 1, total)
    # 粗暴但有效的低通：滑动平均
    kernel = np.ones(90) / 90
    noise = np.convolve(noise, kernel, mode='same')
    lfo = 0.5 + 0.5 * np.sin(2 * math.pi * np.arange(total) / SR / 17.0)
    mix += noise * lfo * 0.055

    # ---- 无缝循环：把结尾 0.6 秒与开头 0.6 秒交叉淡化 ----
    xf = int(SR * 0.6)
    ramp = np.linspace(0, 1, xf)
    head = mix[:xf].copy()
    mix[:xf] = head * ramp + mix[-xf:] * (1 - ramp)
    mix = mix[:-xf]

    # ---- 归一化 + 软限幅 ----
    peak = np.max(np.abs(mix))
    if peak > 0:
        mix = mix / peak * 0.89
    mix = np.tanh(mix * 1.15) / math.tanh(1.15)   # 轻微饱和，避免破音

    pcm = (mix * 32767).astype(np.int16)

    os.makedirs(OUT_DIR, exist_ok=True)
    with wave.open(OUT_WAV, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())

    # ffmpeg 编码成 MP3（体积小、浏览器全支持）
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', OUT_WAV,
           '-codec:a', 'libmp3lame', '-b:a', '112k', '-ac', '1', OUT_MP3]
    try:
        subprocess.run(cmd, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f'ffmpeg 编码失败：{e}', file=sys.stderr)
        sys.exit(1)
    finally:
        if os.path.exists(OUT_WAV):
            os.remove(OUT_WAV)

    size = os.path.getsize(OUT_MP3)
    print(f'✓ 生成 {OUT_MP3}')
    print(f'  时长 {len(pcm) / SR:.1f}s（无缝循环）· 单声道 112kbps · {size / 1024:.0f} KB')


if __name__ == '__main__':
    main()
