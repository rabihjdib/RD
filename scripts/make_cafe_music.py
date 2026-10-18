"""Compose the warm café music bed for the Luciole café reel (original, license-free).

A lo-fi bossa: electric-piano comping over Fmaj9 Em9 Dm9 G13, upright-style bass on roots
and fifths, brushes, rim clicks on the clave and a soft kick, with a vibraphone line from
the fifth bar. The tempo is fitted (around 109 BPM) so a bar line lands exactly where the
logo outro starts; the outro rings out on Cmaj9.

    python3 scripts/make_cafe_music.py --duration 29.4 --outro 26.4 --out public/cafe/music/cafe-bed.mp3

--duration is the reel length in seconds, --outro is when the logo outro starts.
Writes the bed at -14 LUFS.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(11)

ap = argparse.ArgumentParser()
ap.add_argument('--duration', type=float, required=True)
ap.add_argument('--outro', type=float, required=True)
ap.add_argument('--out', required=True)
args = ap.parse_args()

bars_before = max(1, round(args.outro / (4 * 60 / 109)))
BAR = args.outro / bars_before
BEAT = BAR / 4
N = int(SR * (args.duration + 0.05))
out = np.zeros((N, 2))


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or gain == 0:
        return
    sig = sig[: N - i] * gain
    out[i : i + len(sig), 0] += sig * (1 - max(pan, 0))
    out[i : i + len(sig), 1] += sig * (1 + min(pan, 0))


def band_noise(n, lo, hi):
    """White noise shaped to a soft band in the frequency domain."""
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    shape = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    x = np.fft.irfft(spec * shape, n)
    return x / (np.max(np.abs(x)) + 1e-9)


def ep(note, dur):
    """Electric piano tine: warm fundamental, short bell attack, gentle tremolo."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 1.3)
    sig += 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3.5)
    sig += 0.08 * np.sin(2 * np.pi * 7.1 * f * t) * np.exp(-t * 28)
    sig *= 1 + 0.07 * np.sin(2 * np.pi * 4.8 * t)
    rel = np.clip((dur - t) / 0.08, 0, 1)
    return sig * np.clip(t / 0.004, 0, 1) * rel * 0.16


def vibe(note, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.12 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 6)
    sig *= np.exp(-t * 1.5) * (1 + 0.25 * np.sin(2 * np.pi * 5.5 * t))
    return sig * np.clip(t / 0.003, 0, 1) * 0.12


def bass(note, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
    sig *= np.exp(-t * 2.2) * np.clip(t / 0.006, 0, 1) * np.clip((dur - t) / 0.05, 0, 1)
    return sig * 0.42


def brush(dur=0.32):
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.clip(t / 0.03, 0, 1) * np.exp(-t * 9)
    return band_noise(n, 1800, 7000) * env * 0.09


def shaker():
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    return band_noise(n, 4000, 11000) * np.exp(-t * 60) * 0.035


def rim():
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 1650 * t) * np.exp(-t * 90)
    return (tone + band_noise(n, 1500, 6000) * np.exp(-t * 120) * 0.6) * 0.09


def kick():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f = 52 + 50 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * 0.28


# name: (bass root, voicing)
CHORDS = {
    'Fmaj9': (41, [53, 57, 60, 64, 67]),
    'Em9': (40, [52, 55, 59, 62, 66]),
    'Dm9': (38, [50, 53, 57, 60, 64]),
    'G13': (43, [53, 59, 64, 69]),
    'Cmaj9': (36, [52, 55, 59, 62]),
}
PROG = ['Fmaj9', 'Em9', 'Dm9', 'G13']
# Vibraphone line from bar 5: (bar offset in beats, note)
MELODY = {
    'Fmaj9': [(0.5, 76), (2.0, 72), (3.0, 74)],
    'Em9': [(0.5, 74), (2.5, 71)],
    'Dm9': [(0.5, 72), (2.0, 69), (3.0, 72)],
    'G13': [(0.5, 71), (1.5, 74), (3.0, 76)],
}
COMP = [[0, 1.5, 3.0], [1.0, 2.5]]  # bossa comping, in beats, alternating bars
CLAVE = [[0, 1.5, 3.0], [1.0, 2.0]]  # rim clicks, 3-2

for b in range(bars_before):
    t0 = b * BAR
    name = PROG[b % 4]
    root, voicing = CHORDS[name]
    for hit in COMP[b % 2]:
        for i, note in enumerate(voicing):
            place(ep(note, BEAT * 1.4), t0 + hit * BEAT + i * 0.006, 1.0, pan=-0.25 + 0.12 * i)
    # bass: root, fifth, root, fifth
    for off, interval, d in [(0, 0, 1.4), (1.5, 7, 0.45), (2.0, 0, 1.4), (3.5, 7, 0.45)]:
        place(bass(root + interval, BEAT * d), t0 + off * BEAT, 1.0)
    if b >= 1:
        for beat in (1, 3):
            place(brush(), t0 + beat * BEAT, 1.0, pan=0.15)
        for e in range(8):
            place(shaker(), t0 + e * BEAT / 2, 0.8 if e % 2 else 1.0, pan=0.35)
        for c in CLAVE[b % 2]:
            place(rim(), t0 + c * BEAT, 1.0, pan=-0.2)
        place(kick(), t0, 1.0)
        place(kick(), t0 + 2 * BEAT, 0.8)
    if b >= 4:
        for off, note in MELODY[name]:
            place(vibe(note), t0 + off * BEAT, 1.0, pan=0.2)

# Outro: ring out on Cmaj9 with a slow vibraphone arpeggio.
t0 = bars_before * BAR
root, voicing = CHORDS['Cmaj9']
ring = args.duration - t0
for i, note in enumerate(voicing):
    place(ep(note, ring), t0 + i * 0.012, 1.1, pan=-0.25 + 0.12 * i)
place(bass(root, ring), t0, 1.0)
for i, note in enumerate([72, 76, 79, 83, 86]):
    place(vibe(note, 2.2), t0 + 0.25 + i * BEAT / 2, 0.9, pan=0.2)
place(brush(0.6), t0, 1.0, pan=0.15)

# Soft room hum under everything, for warmth.
out += band_noise(N, 150, 3000)[:, None] * 0.004

fade = int(0.4 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = out[: int(SR * args.duration)]
out /= np.max(np.abs(out)) + 1e-9
out *= 0.9

os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
    with wave.open(tmp.name, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
subprocess.run(
    ['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-af', 'highpass=f=40,loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), '-b:a', '192k', args.out],
    check=True,
)
os.unlink(tmp.name)
print(f'{bars_before} bars at {60 / BEAT:.1f} BPM before the outro; wrote {os.path.relpath(args.out)}')
