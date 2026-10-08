"""Synthesize the short UI sound effects used by the Luciole reel (pop, whoosh, sparkle).

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


write('pop.wav', pop())
write('whoosh.wav', whoosh(), peak=0.6)
write('sparkle.wav', sparkle(), peak=0.55)
print('wrote', sorted(os.listdir(OUT)))
