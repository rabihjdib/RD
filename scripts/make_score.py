"""Synthesize the 10s pulse score for the laser tag spot (120 BPM, beat = 15 frames @ 30fps)."""
import wave
import numpy as np

SR = 48000
DUR = 10.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)
out = np.zeros((N, 2))


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    out[i : i + len(sig), 0] += sig * (1 - max(pan, 0))
    out[i : i + len(sig), 1] += sig * (1 + min(pan, 0))


def env(n, decay):
    return np.exp(-np.arange(n) / (decay * SR))


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def kick(length=0.45, punch=1.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    freq = 45 + 110 * np.exp(-t * 28)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(phase) * env(n, 0.16)
    click = rng.standard_normal(n) * env(n, 0.004) * 0.3
    return np.tanh((body + click) * 1.6 * punch)


def hat(length=0.06):
    n = int(length * SR)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 6000)
    return x * env(n, 0.012)


def bass_note(freq, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    saw = 2 * ((t * freq) % 1) - 1
    saw2 = 2 * ((t * freq * 1.006) % 1) - 1
    x = lowpass((saw + saw2) * 0.5, 420)
    a = np.minimum(1, t / 0.01) * env(n, 0.12)
    return x * a


def zap(length=0.35, f0=2600, f1=180):
    n = int(length * SR)
    t = np.arange(n) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 14)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    mod = np.sin(2 * np.pi * 55 * t) * 2.5
    return np.sin(phase + mod) * env(n, 0.09)


def whoosh(length=0.35):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = lowpass(x, 2500) - lowpass(x, 300)
    shape = np.sin(np.pi * t / length) ** 2
    return x * shape


beats = int(DUR / BEAT)
# Kicks on every beat up to the tag hit, then the final impact.
for b in range(beats):
    t = b * BEAT
    if t >= 6.5:
        break
    place(kick(), t, 0.9 if b % 2 == 0 else 0.75)

# Offbeat hats, 16th ghost hats after the first bar.
for s in range(int(DUR / (BEAT / 4))):
    t = s * BEAT / 4
    if t >= 6.5:
        break
    if s % 2 == 1:
        place(hat(), t, 0.22 if s % 4 == 2 else 0.12, pan=0.3 if s % 4 == 1 else -0.3)

# Driving 8th-note bass in A minor.
roots = [55.0, 55.0, 65.41, 49.0]
for e in range(int(6.5 / (BEAT / 2))):
    t = e * BEAT / 2
    bar = int(t / (BEAT * 4)) % len(roots)
    f = roots[bar] * (2 if e % 4 == 3 else 1)
    place(bass_note(f, BEAT / 2), t, 0.55)

# Cut whooshes.
for t in [0.95, 1.95, 2.95, 4.45]:
    place(whoosh(), t - 0.2, 0.25)

# Riser from 5.5s into the tag at 6.5s.
rl = 1.0
n = int(rl * SR)
tt = np.arange(n) / SR
noise = rng.standard_normal(n)
noise = noise - lowpass(noise, 800)
tone = np.sin(2 * np.pi * np.cumsum(220 + 880 * (tt / rl) ** 2) / SR)
place((noise * 0.35 + tone * 0.25) * (tt / rl) ** 2, 5.5, 0.6)

# Tag impact.
place(kick(0.9, 1.4), 6.5, 1.0)
place(zap(), 6.53, 0.45, pan=-0.2)
place(zap(0.3, 3200, 300), 6.6, 0.3, pan=0.25)
boom = rng.standard_normal(int(1.2 * SR))
boom = lowpass(boom, 900) * env(len(boom), 0.35)
place(boom, 6.5, 0.6)

# End card: wide pad chord (A minor add9) held under the logo and booking details.
pl = 3.4
n = int(pl * SR)
tt = np.arange(n) / SR
pad = np.zeros(n)
for f in [110, 164.81, 220, 246.94, 329.63]:
    for d in (0.997, 1.003):
        pad += 2 * ((tt * f * d) % 1) - 1
pad = lowpass(pad / 10, 1400) * np.minimum(1, tt / 0.08) * env(n, 1.6)
place(pad, 6.6, 0.5)
place(kick(0.7, 1.1), 7.0, 0.7)
place(zap(0.5, 1800, 120), 7.0, 0.2)

# Soft heartbeat pulse under the end card, and a bright ping as the booking line lands.
for t in np.arange(7.5, 9.4, BEAT):
    place(kick(0.4, 0.6), t, 0.35)
ping_n = int(1.2 * SR)
pt = np.arange(ping_n) / SR
ping = (np.sin(2 * np.pi * 1760 * pt) + 0.5 * np.sin(2 * np.pi * 2637 * pt)) * env(ping_n, 0.25)
place(ping, 7.6, 0.12, pan=0.2)

# Short fade at the very end, then master.
fade = int(0.6 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = np.tanh(out * 1.2)
out /= np.max(np.abs(out)) / 0.89

with wave.open("public/audio/score.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
print("wrote public/audio/score.wav")
