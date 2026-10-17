"""Compose the Halloween music bed for the Luciole Halloween reel (original, license-free).

Spooky-fun rather than scary, for a kids' event: D minor, a swung pizzicato walking
bass, finger snaps on 2 and 4, a music-box melody, a soft organ pad and a theremin-ish
"ooo" swoop at the top. The tempo is fitted so a bar line lands exactly where the logo
outro starts; the outro resolves to a ringing D minor chord with a little chime.

    python3 scripts/make_halloween_music.py --duration 40.0 --outro 35.0

--duration is the reel length in seconds, --outro is when the logo outro starts.
Writes public/halloween/music/halloween-bed.mp3 at -14 LUFS; the reel ducks it under
the voices.
"""
import argparse
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(31)

ap = argparse.ArgumentParser()
ap.add_argument('--duration', type=float, default=40.0)
ap.add_argument('--outro', type=float, default=35.0)
args = ap.parse_args()

bars_before = max(1, round(args.outro / (4 * 60 / 112)))
BAR = args.outro / bars_before
BEAT = BAR / 4
SWING = BEAT * 0.16  # late off-beats for the swung feel
N = int(SR * (args.duration + 0.05))
out = np.zeros((N, 2))


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0 or gain == 0:
        return
    sig = sig[: N - i] * gain
    out[i : i + len(sig), 0] += sig * (1 - max(pan, 0))
    out[i : i + len(sig), 1] += sig * (1 + min(pan, 0))


def smooth(x, cutoff):
    k = max(1, int(SR / cutoff / 2))
    return np.convolve(x, np.ones(k) / k, mode='same')


def pizz(note, dur=0.5):
    """Plucked double-bass: warm fundamental, quick decay, soft thump."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 9) + 0.2 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 14)
    return sig * np.clip(t / 0.004, 0, 1) * np.exp(-t * 6.5) * 0.6


def musicbox(note, dur=1.2):
    """Music-box tine: bright, slightly inharmonic, long gentle decay."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.2)
    sig += 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 9)
    sig += 0.12 * np.sin(2 * np.pi * f * 5.98 * t) * np.exp(-t * 16)
    return sig * np.clip(t / 0.0015, 0, 1) * 0.42


def organ(notes, dur):
    """Soft drawbar organ pad with slow tremolo."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for note in notes:
        f = midi(note)
        sig += np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) + 0.25 * np.sin(2 * np.pi * 4 * f * t)
    trem = 1 + 0.18 * np.sin(2 * np.pi * 5.2 * t)
    env = np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.3, 0, 1)
    return sig * trem * env * 0.06


def snap():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    band = smooth(noise, 7000) - smooth(noise, 1800)
    return band * np.exp(-t / 0.018) * 0.9


def tom(note=45):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = midi(note) * (1 + 0.5 * np.exp(-t * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.5


def theremin(start_note, end_note, dur):
    """Wobbly sine glide, the classic 'ooo-ooo' ghost voice, kept soft."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    glide = np.linspace(midi(start_note), midi(end_note), n)
    vib = 1 + 0.012 * np.sin(2 * np.pi * 6 * t)
    phase = 2 * np.pi * np.cumsum(glide * vib) / SR
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return (np.sin(phase) + 0.15 * np.sin(2 * phase)) * env * 0.22


# D minor progression: Dm Bb Gm A7, with a walking bass for each bar.
PROG = [
    ('Dm', [62, 65, 69], [38, 41, 45, 44]),
    ('Bb', [58, 62, 65], [34, 38, 41, 40]),
    ('Gm', [55, 58, 62], [43, 46, 50, 49]),
    ('A7', [57, 61, 64, 67], [45, 49, 52, 44]),
]
# Music-box motif per chord (beat, midi), sparse so it sits under speech.
MOTIF = {
    'Dm': [(0, 74), (1.5, 77), (2, 76), (3, 74)],
    'Bb': [(0, 74), (1.5, 72), (2, 70), (3, 69)],
    'Gm': [(0, 70), (1.5, 74), (2, 79), (3, 77)],
    'A7': [(0, 76), (1, 73), (2, 76), (3, 79)],
}


def swung(beat):
    return beat * BEAT + (SWING if beat % 1 else 0)


for b in range(bars_before):
    name, chord, walk = PROG[b % 4]
    t0 = b * BAR
    for i, n in enumerate(walk):
        place(pizz(n), t0 + i * BEAT, 0.9, pan=-0.1)
    place(organ(chord, BAR), t0, 1.0)
    if b > 0:
        place(snap(), t0 + BEAT, 0.55, pan=0.25)
        place(snap(), t0 + 3 * BEAT, 0.55, pan=0.25)
    if b % 2 == 1:
        for beat, n in MOTIF[name]:
            place(musicbox(n), t0 + swung(beat), 0.5, pan=0.2)
    if b % 4 == 3:
        place(tom(45), t0 + 3.5 * BEAT, 0.6)
        place(tom(41), t0 + 3.75 * BEAT, 0.6)

# Ghostly swoops at the top and halfway.
place(theremin(74, 81, 1.6), 0.15, 0.9, pan=-0.2)
place(theremin(81, 74, 1.8), (bars_before // 2) * BAR + 0.2, 0.7, pan=0.2)

# Outro bar: Gm then A7 with the full motif, then a ringing D minor and chime.
t0 = args.outro
for i, n in enumerate([43, 46, 45, 49]):
    place(pizz(n), t0 + i * BEAT, 0.9)
place(organ([55, 58, 62], 2 * BEAT), t0, 1.0)
place(organ([57, 61, 64, 67], 2 * BEAT), t0 + 2 * BEAT, 1.0)
for k, (beat, n) in enumerate([(0, 70), (0.5, 74), (1, 79), (1.5, 77), (2, 76), (2.5, 73), (3, 76), (3.5, 81)]):
    place(musicbox(n, 1.2), t0 + swung(beat), 0.65, pan=0.15)
place(snap(), t0 + BEAT, 0.6, pan=0.25)
place(snap(), t0 + 3 * BEAT, 0.6, pan=0.25)

end_t = t0 + BAR
if end_t < args.duration:
    place(pizz(38, 1.5), end_t, 1.0)
    place(organ([62, 65, 69, 74], max(0.5, args.duration - end_t)), end_t, 1.2)
    for i, n in enumerate([74, 77, 81, 86]):
        place(musicbox(n, 2.0), end_t + i * 0.08, 0.5, pan=-0.2 + 0.13 * i)

fade = int(0.4 * SR)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out = out[: int(SR * args.duration)]
out /= np.max(np.abs(out)) + 1e-9
out *= 0.9

dest = os.path.join(os.path.dirname(__file__), '..', 'public', 'halloween', 'music', 'halloween-bed.mp3')
os.makedirs(os.path.dirname(dest), exist_ok=True)
with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
    with wave.open(tmp.name, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
subprocess.run(
    ['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-af', 'highpass=f=40,loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), '-b:a', '192k', dest],
    check=True,
)
os.unlink(tmp.name)
print(f'{bars_before} bars at {60 / BEAT:.1f} BPM before the outro; wrote {os.path.relpath(dest)}')
