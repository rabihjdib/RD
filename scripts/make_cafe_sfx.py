"""Synthesise the café sound effects (original, license-free) into public/cafe/sfx/.

    steam.wav  espresso steam wand: airy hiss with a milk gurgle underneath
    grind.wav  coffee grinder: motor spin-up and the crunch of beans
    clink.wav  a cup set down on its saucer
    chime.wav  soft two-note chime for titles appearing

    python3 scripts/make_cafe_sfx.py
"""
import os
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(5)
DEST = os.path.join(os.path.dirname(__file__), '..', 'public', 'cafe', 'sfx')


def band_noise(n, lo, hi):
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    shape = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    x = np.fft.irfft(spec * shape, n)
    return x / (np.max(np.abs(x)) + 1e-9)


def wobble(n, rate, depth):
    """Slow random amplitude movement (low-passed noise), around 1."""
    k = max(1, int(SR / rate))
    w = np.convolve(rng.standard_normal(n + k), np.ones(k) / k, mode='valid')[:n]
    return 1 + depth * w / (np.max(np.abs(w)) + 1e-9)


def write(name, x, peak=0.89):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    os.makedirs(DEST, exist_ok=True)
    with wave.open(os.path.join(DEST, name), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def steam(dur=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.clip(t / 0.18, 0, 1) * np.clip((dur - t) / 0.45, 0, 1)
    hiss = band_noise(n, 2500, 9000) * wobble(n, 12, 0.25)
    gurgle = band_noise(n, 250, 800) * np.clip(wobble(n, 20, 0.9), 0, None) * np.sin(np.pi * t / dur) ** 2
    return (hiss + 0.45 * gurgle) * env


def grind(dur=1.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 150 - 70 * np.exp(-t * 18)  # motor spin-up
    phase = 2 * np.pi * np.cumsum(f) / SR
    motor = sum(np.sin(h * phase) / h for h in range(1, 12)) * 0.35
    crunch = band_noise(n, 900, 5500)
    grains = np.zeros(n)
    i = 0
    while i < n:  # beans cracking: short random bursts
        L = int(rng.uniform(0.004, 0.012) * SR)
        grains[i : i + L] += rng.uniform(0.4, 1.0) * np.exp(-np.arange(min(L, n - i)) / (0.003 * SR))
        i += int(rng.uniform(0.006, 0.02) * SR)
    env = np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.18, 0, 1)
    return (motor + crunch * grains * 0.9) * env


def clink():
    n = int(0.8 * SR)
    t = np.arange(n) / SR

    def hit(gain):
        return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a for f, d, a in [(2350, 7, 1), (3780, 10, 0.6), (5560, 14, 0.4), (7400, 18, 0.25)]) * gain

    x = hit(1.0)
    lag = int(0.055 * SR)
    x[lag:] += hit(0.45)[: n - lag]
    return x * np.clip(t / 0.001, 0, 1)


def chime():
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for start, f in [(0.0, 1318.5), (0.07, 1975.5)]:
        i = int(start * SR)
        tt = t[: n - i]
        x[i:] += (np.sin(2 * np.pi * f * tt) + 0.2 * np.sin(2 * np.pi * 2.76 * f * tt) * np.exp(-tt * 12)) * np.exp(-tt * 4.5)
    return x * np.clip(t / 0.002, 0, 1)


write('steam.wav', steam())
write('grind.wav', grind())
write('clink.wav', clink())
write('chime.wav', chime(), peak=0.6)
print('wrote', ', '.join(sorted(os.listdir(DEST))))
