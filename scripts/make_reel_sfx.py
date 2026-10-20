"""Synthesize the short sound effects used by the Luciole reels (pop, whoosh, sparkle, and the
party popper and confetti rustle of the soft opening Reel).

Writes 48kHz mono WAVs to public/reel/sfx. Swap any of them for your own library
sounds by dropping a file with the same name in that folder.
"""
import os
import wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'reel', 'sfx')
rng = np.random.default_rng(11)


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1) if attack > 0 else 1.0
    return a * np.exp(-t / decay)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def write(name, sig, peak=0.8):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((sig * 32767).astype(np.int16).tobytes())


def pop():
    # Bubbly pop: a fast downward pitch sweep with a click on top.
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    freq = 900 * np.exp(-t * 28) + 240
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * env(n, 0.002, 0.045)
    click = rng.standard_normal(n) * env(n, 0, 0.003) * 0.4
    return body + click


def whoosh():
    # Filtered noise swell for cuts between rushes.
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    shape = np.sin(np.pi * np.clip(t / 0.42, 0, 1)) ** 2.2
    bright = lowpass(noise, 2400) - lowpass(noise, 300)
    return bright * shape


def sparkle():
    # Little glockenspiel shimmer for the firefly / spark moments.
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for i, f in enumerate([1568, 2093, 2637, 3136]):
        start = int(i * 0.05 * SR)
        m = n - start
        tone = np.sin(2 * np.pi * f * t[:m]) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t[:m])
        out[start:] += tone * env(m, 0.002, 0.18) * (0.9 - i * 0.12)
    return out


def popper():
    # Party popper: a sharp crack, a low thump, then paper streamers fluttering down.
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    crack = (noise - lowpass(noise, 1800)) * env(n, 0, 0.006) * 1.4
    thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 40)) * t) * env(n, 0.001, 0.05) * 0.8
    flutter_am = 0.6 + 0.4 * np.sin(2 * np.pi * 23 * t + 3 * np.sin(2 * np.pi * 3 * t))
    flutter = (lowpass(noise, 5000) - lowpass(noise, 900)) * flutter_am * env(n, 0.02, 0.25) * 0.35
    return crack + thump + flutter


def confetti():
    # Soft rustle of confetti landing: a scatter of tiny paper ticks that thins out.
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    tick_n = int(0.012 * SR)
    for _ in range(140):
        at = int(min(rng.exponential(0.45), 1.5) * SR)
        if at + tick_n >= n:
            continue
        tick = rng.standard_normal(tick_n) * env(tick_n, 0.0005, 0.003)
        out[at : at + tick_n] += tick * rng.uniform(0.2, 1.0)
    return (out - lowpass(out, 1500)) * env(n, 0.05, 0.7)


write('pop.wav', pop())
write('whoosh.wav', whoosh(), peak=0.6)
write('sparkle.wav', sparkle(), peak=0.55)
write('popper.wav', popper(), peak=0.8)
write('confetti.wav', confetti(), peak=0.5)
print('wrote', sorted(os.listdir(OUT)))
