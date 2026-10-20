"""Compose the celebration track for the soft opening "It's today" Reel (original, license-free).

12 seconds at 120 BPM (one bar = 2 s) so the drop lands on the confetti burst at 4 s
(frame 120 at 30 fps):
  bar 1  glockenspiel twinkles over a soft bass pulse
  bar 2  claps, a snare roll and a noise riser build up
  bar 3+ the drop: four-on-the-floor kick, claps, hats, bright brass-like stabs on
         C - F - G and a glockenspiel melody
  10 s   a final C chord with a cymbal swell rings out and fades

    python3 scripts/make_celebration_music.py

Writes public/reel/music/luciole-celebration.mp3, peak-normalised (no loudness
compression, so the build stays quieter than the drop).
"""
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
DUR = 12.0
BEAT = 0.5
BAR = 4 * BEAT
DROP = 2 * BAR
N = int(SR * DUR)
out = np.zeros((N, 2))
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or gain == 0:
        return
    sig = sig[: N - i] * gain
    out[i : i + len(sig), 0] += sig * (1 - max(pan, 0))
    out[i : i + len(sig), 1] += sig * (1 + min(pan, 0))


def smooth(x, cutoff):
    k = max(1, int(SR / cutoff / 2))
    return np.convolve(x, np.ones(k) / k, mode='same')


def glock(note, dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.6)
    sig += 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 7)
    sig += 0.18 * np.sin(2 * np.pi * f * 5.40 * t) * np.exp(-t * 14)
    return sig * np.clip(t / 0.001, 0, 1) * 0.45


def brass(notes, dur=0.42):
    """A bright, slightly detuned saw-like stab (additive), the party 'horn hit'."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for note in notes:
        for det in (-0.004, 0.004):
            f = midi(note) * (1 + det)
            for h in range(1, 12):
                if f * h > SR / 2.4:
                    break
                sig += (1 / h) * np.sin(2 * np.pi * f * h * t + h)
    env = np.clip(t / 0.012, 0, 1) * np.exp(-t * 5.5)
    return sig * env * 0.07


def bass(note, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return sig * np.clip(t / 0.008, 0, 1) * np.exp(-t * 4) * 0.5


def kick():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    freq = 48 + 110 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 11) * 0.95


def clap():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    env = np.zeros(n)
    for off in (0.0, 0.010, 0.021):
        env += np.exp(-np.clip(t - off, 0, None) / 0.011) * (t >= off)
    env += 0.45 * np.exp(-t / 0.07)
    noise = rng.standard_normal(n)
    band = noise - smooth(noise, 900)
    return smooth(band, 7000) * env * 0.38


def hat(open_=False):
    d = 0.22 if open_ else 0.05
    n = int(d * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    hi = noise - smooth(noise, 7000)
    return hi * np.exp(-t / (0.07 if open_ else 0.012)) * (0.16 if open_ else 0.12)


def snare():
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.4
    return (smooth(noise - smooth(noise, 1500), 8000) * np.exp(-t / 0.05) * 0.5 + body) * 0.5


def riser(dur):
    """White noise swelling up and opening into the drop."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out_ = np.zeros(n)
    seg = n // 16
    for k in range(16):  # step the brightness up as it rises
        a, b = k * seg, (k + 1) * seg if k < 15 else n
        cut = 600 + 9000 * (k / 15) ** 2
        out_[a:b] = smooth(noise[a:b], cut)
    return out_ * (t / dur) ** 2.2 * 0.35


def crash(dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    hi = noise - smooth(noise, 4000)
    return hi * np.exp(-t / 0.9) * 0.22


# Chords for the stabs and bass roots.
CH = {'C': ([60, 64, 67, 72], 36), 'F': ([60, 65, 69, 72], 41), 'G': ([59, 62, 67, 71], 43)}
ARP = {'C': [72, 76, 79, 84], 'F': [72, 77, 81, 84], 'G': [71, 74, 79, 83]}

# Bar 1: twinkles and a soft bass pulse.
for i in range(8):
    place(glock(ARP['C'][i % 4] + (12 if i >= 4 else 0)), i * BEAT / 2, 0.30, pan=-0.3 + 0.08 * i)
for b in range(4):
    place(bass(36, BEAT * 0.9), b * BEAT, 0.35)

# Bar 2: build. Claps on 2 and 4, a snare roll that speeds up, the riser.
t0 = BAR
for i in range(8):
    place(glock(ARP['F' if i < 4 else 'G'][i % 4] + 12, 1.0), t0 + i * BEAT / 2, 0.26, pan=0.3 - 0.08 * i)
for b in range(4):
    place(bass(41 if b < 2 else 43, BEAT * 0.9), t0 + b * BEAT, 0.42)
place(clap(), t0 + BEAT, 0.6)
place(clap(), t0 + 3 * BEAT, 0.6)
roll_t = t0 + 2 * BEAT
for k in range(16):  # eighths, then sixteenths, getting louder
    step = BEAT / 2 if k < 4 else BEAT / 4 if k < 12 else BEAT / 8
    place(snare(), roll_t, 0.25 + 0.04 * k)
    roll_t += step
    if roll_t >= DROP - 0.01:
        break
place(riser(BAR), t0, 1.0)

# Drop: bars 3 to 5 (4 s to 10 s), the party groove.
PROG = ['C', 'F', 'G']
MELODY = [  # (bar offset in beats, midi) per bar
    [(0, 79), (0.5, 84), (1, 88), (1.5, 91), (2.5, 88), (3, 91), (3.5, 96)],
    [(0, 93), (0.5, 91), (1, 89), (1.5, 88), (2.5, 89), (3, 93), (3.5, 96)],
    [(0, 95), (0.5, 93), (1, 91), (1.5, 89), (2, 88), (2.5, 86), (3, 83), (3.5, 86)],
]
for k, name in enumerate(PROG):
    t0 = DROP + k * BAR
    notes, root = CH[name]
    for b in range(4):
        place(kick(), t0 + b * BEAT, 0.8)
        place(hat(open_=True), t0 + b * BEAT + BEAT / 2, 1.0, pan=0.3)
        place(hat(), t0 + b * BEAT + BEAT / 4, 0.8, pan=-0.3)
        place(hat(), t0 + b * BEAT + 3 * BEAT / 4, 0.8, pan=-0.3)
        # Octave-jumping bass on the eighths.
        place(bass(root, BEAT * 0.45), t0 + b * BEAT, 0.5)
        place(bass(root + 12, BEAT * 0.45), t0 + b * BEAT + BEAT / 2, 0.4)
    place(clap(), t0 + BEAT, 0.8)
    place(clap(), t0 + 3 * BEAT, 0.8)
    for beat in (0, 1.5, 3):  # syncopated horn hits
        place(brass(notes), t0 + beat * BEAT, 1.0 if beat == 0 else 0.75)
    for beat, n in MELODY[k]:
        place(glock(n, 1.2), t0 + beat * BEAT, 0.42, pan=0.15)
place(crash(), DROP, 1.0)

# 10 s: the final chord, a cymbal and a glockenspiel cascade, ringing out.
END = DROP + 3 * BAR
place(kick(), END, 0.9)
place(brass(CH['C'][0] + [76], dur=2.0), END, 1.3)
place(bass(36, 2.0), END, 0.6)
place(crash(2.0), END, 1.0)
for i, n in enumerate([84, 88, 91, 96, 100]):
    place(glock(n, 2.0), END + i * 0.07, 0.4, pan=-0.3 + 0.15 * i)

fade = int(0.8 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
out /= np.max(np.abs(out)) + 1e-9
out *= 0.9

dest = os.path.join(os.path.dirname(__file__), '..', 'public', 'reel', 'music', 'luciole-celebration.mp3')
with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
    with wave.open(tmp.name, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
subprocess.run(
    ['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-af', 'highpass=f=40,alimiter=limit=0.89:level=false', '-ar', str(SR), '-b:a', '192k', dest],
    check=True,
)
os.unlink(tmp.name)
print('wrote', os.path.relpath(dest))
