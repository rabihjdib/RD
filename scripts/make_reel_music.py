"""Compose the playful kids-style music bed for the Luciole reel (original, license-free).

Ukulele strums (C G Am F), glockenspiel twinkles (the firefly motif), soft bass, kick,
claps and shaker. The tempo is fitted so a bar line lands exactly where the logo outro
starts; the outro bar carries the melody and resolves to a ringing C chord.

    python3 scripts/make_reel_music.py --duration 32.37 --outro 28.87

Both times are in seconds: --duration is the reel length (REEL_DURATION / 30) and
--outro is when the logo outro starts (END_CARD_AT / 30). Writes
public/reel/music/luciole-kids-bed.mp3 at -14 LUFS; Main.tsx ducks it under the voices.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(3)

ap = argparse.ArgumentParser()
ap.add_argument('--duration', type=float, default=32.37)
ap.add_argument('--outro', type=float, default=28.87)
args = ap.parse_args()

# Fit the tempo (around 108 BPM) so whole bars fill the time before the outro.
bars_before = max(1, round(args.outro / (4 * 60 / 108)))
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


def lowpass(x, cutoff):
    # One-pole low-pass, vectorised via lfilter-style cumulative trick is overkill here;
    # a short moving average is enough to soften noise bursts.
    k = max(1, int(SR / cutoff / 2))
    return np.convolve(x, np.ones(k) / k, mode='same')


def pluck(note, dur=1.6, bright=1.0):
    """Ukulele-ish pluck: decaying harmonics, upper partials die faster, plus a pick tick."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.zeros(n)
    for h in range(1, 9):
        if f * h > SR / 2.2:
            break
        amp = (1 / h**1.25) * (bright if h > 2 else 1)
        sig += amp * np.sin(2 * np.pi * f * h * t * (1 + 0.0004 * h)) * np.exp(-t * (2.2 + 1.6 * h**0.9))
    tick = rng.standard_normal(n) * np.exp(-t / 0.0025) * 0.15
    att = np.clip(t / 0.003, 0, 1)
    return (sig + tick) * att * 0.5


def glock(note, dur=1.4):
    """Glockenspiel bar: inharmonic partials, bright fast decay."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.6)
    sig += 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 7)
    sig += 0.18 * np.sin(2 * np.pi * f * 5.40 * t) * np.exp(-t * 14)
    return sig * np.clip(t / 0.001, 0, 1) * 0.45


def bass(note, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return sig * np.clip(t / 0.01, 0, 1) * np.exp(-t * 2.5) * 0.55


def kick():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    freq = 50 + 90 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 14) * 0.9


def clap():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    env = np.zeros(n)
    for off in (0.0, 0.011, 0.022):  # three hands, slightly apart
        env += np.exp(-np.clip(t - off, 0, None) / 0.012) * (t >= off)
    env += 0.4 * np.exp(-t / 0.06)
    noise = rng.standard_normal(n)
    band = noise - lowpass(noise, 900)
    return lowpass(band, 6000) * env * 0.35


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    hi = noise - lowpass(noise, 5000)
    return hi * np.sin(np.pi * np.clip(t / 0.09, 0, 1)) ** 2 * 0.18


# Reentrant ukulele voicings (strings G4 C4 E4 A4) and bass roots.
CHORDS = {
    'C': ([67, 60, 64, 72], 48),
    'G': ([67, 62, 67, 71], 43),
    'Am': ([69, 60, 64, 69], 45),
    'F': ([69, 60, 65, 69], 41),
}
# Arpeggio tones for the glockenspiel twinkles, two octaves up.
TWINKLE = {'C': [84, 88, 91, 96], 'G': [83, 86, 91, 95], 'Am': [84, 88, 93, 96], 'F': [84, 89, 93, 96]}

prog = ['C', 'G', 'Am', 'F']
# "Island strum" in eighths: D . D U . U D U
STRUM = [(0, 'D', 1.0), (1, 'D', 0.8), (1.5, 'U', 0.55), (2.5, 'U', 0.55), (3, 'D', 0.75), (3.5, 'U', 0.5)]


def strum(name, t, gain, direction):
    notes, _ = CHORDS[name]
    order = notes if direction == 'D' else notes[::-1]
    for i, n in enumerate(order):
        place(pluck(n, bright=1.0 if direction == 'D' else 0.7), t + i * 0.011, gain * 0.5, pan=-0.25 + 0.15 * i)


def bar_section(b, name, full):
    t0 = b * BAR
    _, root = CHORDS[name]
    for beat, d, g in STRUM:
        strum(name, t0 + beat * BEAT, g, d)
    place(bass(root, BEAT * 1.8), t0, 0.55)
    place(bass(root + 7, BEAT * 1.8), t0 + 2 * BEAT, 0.45)
    if full:
        place(kick(), t0, 0.55)
        place(kick(), t0 + 2 * BEAT, 0.45)
        place(clap(), t0 + BEAT, 0.8, pan=0.1)
        place(clap(), t0 + 3 * BEAT, 0.8, pan=0.1)
        for e in range(8):
            place(shaker(), t0 + e * BEAT / 2 + (0.012 if e % 2 else 0), 1.0 if e % 2 else 0.6, pan=0.35)
    # Firefly twinkle: a quick rising arpeggio every other bar, on the off-beats.
    if b % 2 == 1:
        for i, n in enumerate(TWINKLE[name]):
            place(glock(n), t0 + 2.5 * BEAT + i * BEAT / 4, 0.32, pan=0.3 - 0.2 * i)


# Verse: everything before the outro.
for b in range(bars_before):
    bar_section(b, prog[b % 4], full=b > 0)

# Outro: one bar of F then G under the melody, resolving to a ringing C chord.
t0 = args.outro
for beat, d, g in STRUM:
    strum('F' if beat < 2 else 'G', t0 + beat * BEAT, g, d)
place(bass(41, BEAT * 1.8), t0, 0.6)
place(bass(43, BEAT * 1.8), t0 + 2 * BEAT, 0.6)
for k in range(4):
    place(kick() if k % 2 == 0 else clap(), t0 + k * BEAT, 0.7)
MELODY = [(0, 81), (0.5, 84), (1, 89), (1.5, 88), (2, 86), (2.5, 83), (3, 79), (3.5, 86)]  # (beat, midi note)
for beat, n in MELODY:
    place(glock(n, 1.4), t0 + beat * BEAT, 0.55, pan=0.15)

end_t = t0 + BAR
strum('C', end_t, 1.1, 'D')
place(bass(48, 2.0), end_t, 0.65)
place(kick(), end_t, 0.6)
for i, n in enumerate([84, 88, 91, 96, 100]):
    place(glock(n, 2.0), end_t + i * 0.07, 0.4, pan=-0.3 + 0.15 * i)

# Fade the very end so the last frame is silent.
fade = int(0.35 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = out[: int(SR * args.duration)]
out /= np.max(np.abs(out)) + 1e-9
out *= 0.9

dest = os.path.join(os.path.dirname(__file__), '..', 'public', 'reel', 'music', 'luciole-kids-bed.mp3')
os.makedirs(os.path.dirname(dest), exist_ok=True)
with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
    with wave.open(tmp.name, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
subprocess.run(
    ['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-af', 'highpass=f=45,loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), '-b:a', '192k', dest],
    check=True,
)
os.unlink(tmp.name)
print(f'{bars_before} bars at {60 / BEAT:.1f} BPM before the outro; wrote {os.path.relpath(dest)}')
