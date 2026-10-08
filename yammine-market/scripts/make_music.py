"""Synthesises the original music beds and SFX used by the Yammine weekly deals videos.

Everything is generated from scratch (no samples, no licensing questions):
  public/audio/upbeat.wav  15 s, 120 BPM, F major pop groove (General / Beverages / Fresh)
  public/audio/flash.wav   15 s, 120 BPM, harder minor groove with risers (Flash Sale)
  public/audio/whoosh.wav  transition swoosh
  public/audio/pop.wav     badge pop

120 BPM means one beat every 15 frames at 30 fps, so the scene cuts at
3 s, 8 s and 12 s all land on a downbeat.

Usage: python3 scripts/make_music.py
"""
import os
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 15.0
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(7)


def lowpass(x, cutoff):
	"""One-pole low-pass; cutoff may be a scalar or a per-sample array."""
	cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
	a = 1 - np.exp(-2 * np.pi * cutoff / SR)
	y = np.empty_like(x)
	acc = 0.0
	for i in range(len(x)):
		acc += a[i] * (x[i] - acc)
		y[i] = acc
	return y


def highpass(x, cutoff):
	return x - lowpass(x, cutoff)


def env(n, attack=0.005, decay=0.2):
	t = np.arange(n) / SR
	e = np.exp(-t / decay)
	a = int(attack * SR)
	if a:
		e[:a] *= np.linspace(0, 1, a)
	return e


def saw(freq, n, detune=0.0):
	t = np.arange(n) / SR
	ph = (t * freq * (1 + detune)) % 1.0
	return 2 * ph - 1


def note(name):
	names = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
	pitch, octave = name[:-1], int(name[-1])
	return 440 * 2 ** ((names[pitch] + 12 * (octave + 1) - 69) / 12)


def place(buf, sound, t, gain=1.0):
	i = int(t * SR)
	if i >= len(buf):
		return
	j = min(len(buf), i + len(sound))
	buf[i:j] += sound[: j - i] * gain


def kick(hard=False):
	n = int(0.45 * SR)
	t = np.arange(n) / SR
	f = 48 + (150 if hard else 120) * np.exp(-t / 0.035)
	body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.16 if hard else 0.13)
	click = rng.standard_normal(n) * env(n, 0, 0.004) * 0.3
	return np.tanh((body + click) * (2.2 if hard else 1.6))


def clap():
	n = int(0.3 * SR)
	noise = highpass(rng.standard_normal(n), 900)
	e = np.zeros(n)
	for k, off in enumerate((0, 0.011, 0.022)):
		i = int(off * SR)
		e[i:] += env(n - i, 0, 0.012 if k < 2 else 0.11)
	return noise * e * 0.6


def hat(open_=False):
	n = int((0.25 if open_ else 0.06) * SR)
	return highpass(rng.standard_normal(n), 7000) * env(n, 0, 0.09 if open_ else 0.018) * 0.35


def pluck_chord(freqs, length, bright=4000):
	n = int(length * SR)
	x = sum(saw(f, n, d) for f in freqs for d in (-0.004, 0.004)) / (2 * len(freqs))
	cut = 600 + bright * env(n, 0, 0.09)
	return lowpass(x, cut) * env(n, 0.003, 0.22)


def bass_note(f, length, drive=1.5):
	n = int(length * SR)
	x = saw(f, n) * 0.6 + np.sin(2 * np.pi * f * np.arange(n) / SR) * 0.6
	x = lowpass(x, 380 + 900 * env(n, 0, 0.06))
	e = env(n, 0.004, length * 0.9)
	e[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
	return np.tanh(x * drive) * e


def riser(length):
	n = int(length * SR)
	t = np.linspace(0, 1, n)
	noise = rng.standard_normal(n)
	return lowpass(noise, 300 + 9000 * t ** 2) * t ** 2 * 0.5


def build(progression, bass_oct, hard):
	n = int(DUR * SR)
	drums = np.zeros(n)
	music = np.zeros(n)
	beats = int(DUR / BEAT)
	k, c, h, ho = kick(hard), clap(), hat(), hat(True)
	for b in range(beats):
		t = b * BEAT
		bar, pos = divmod(b, 4)
		intro = b < 2  # first second: hats + stabs only, the kick drops with the brush banner
		if not intro:
			place(drums, k, t, 0.9)
			if pos in (1, 3):
				place(drums, c, t, 0.55)
		place(drums, h, t + BEAT / 2, 0.5)
		if hard:
			place(drums, h, t + BEAT / 4, 0.25)
			place(drums, h, t + 3 * BEAT / 4, 0.25)
		elif pos == 3:
			place(drums, ho, t + BEAT / 2, 0.35)
		chord = progression[bar % len(progression)]
		freqs = [note(x) for x in chord]
		# offbeat chord stabs, plus a syncopated push before each bar
		place(music, pluck_chord(freqs, BEAT * 0.45), t + BEAT / 2, 0.45)
		if pos == 3:
			place(music, pluck_chord(freqs, BEAT * 0.3, 6000), t + 3 * BEAT / 4, 0.3)
		if not intro:
			root = note(chord[0][:-1] + str(bass_oct))
			place(music, bass_note(root, BEAT * 0.48, 2.2 if hard else 1.5), t, 0.5)
			place(music, bass_note(root * (2 if pos % 2 else 1), BEAT * 0.4), t + BEAT / 2, 0.35)
	# sidechain-style pump keyed to the kick
	pump = np.ones(n)
	for b in range(2, beats):
		i = int(b * BEAT * SR)
		m = min(n - i, int(0.25 * SR))
		pump[i:i + m] = 0.45 + 0.55 * (np.arange(m) / m) ** 0.7
	mix = drums + music * pump
	# lift into each scene cut (3 s, 8 s, 12 s)
	for cut, length in ((3.0, 1.0), (8.0, 1.0), (12.0, 1.5)):
		place(mix, riser(length), cut - length, 0.6 if hard else 0.35)
	if hard:
		# siren-like lead on the second half for urgency
		t0, t1 = 8.0, 12.0
		i0, i1 = int(t0 * SR), int(t1 * SR)
		t = np.arange(i1 - i0) / SR
		f = note('A5') + 220 * (0.5 + 0.5 * np.sin(2 * np.pi * 2 * t))
		lead = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.08
		mix[i0:i1] += lead
	# 1 s fade at the very end so the CTA lands cleanly
	f = int(1.0 * SR)
	mix[-f:] *= np.linspace(1, 0, f) ** 1.5
	mix = np.tanh(mix * 1.1)
	return mix / np.max(np.abs(mix)) * 0.89


def whoosh():
	n = int(0.6 * SR)
	t = np.linspace(0, 1, n)
	shape = np.sin(np.pi * t) ** 2
	x = lowpass(rng.standard_normal(n), 400 + 6000 * np.sin(np.pi * t))
	return x * shape / np.max(np.abs(x * shape)) * 0.7


def pop():
	n = int(0.18 * SR)
	t = np.arange(n) / SR
	f = 300 + 900 * np.exp(-t / 0.02)
	x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.05)
	return x * 0.8


def write(name, x):
	data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
	stereo = np.repeat(data[:, None], 2, axis=1)
	with wave.open(os.path.join(OUT, name), 'wb') as w:
		w.setnchannels(2)
		w.setsampwidth(2)
		w.setframerate(SR)
		w.writeframes(stereo.tobytes())
	print('wrote', name, f'{len(x) / SR:.2f}s')


if __name__ == '__main__':
	os.makedirs(OUT, exist_ok=True)
	major = [['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['D4', 'F4', 'A4'], ['Bb3', 'D4', 'F4']]
	minor = [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4']]
	write('upbeat.wav', build(major, 2, hard=False))
	write('flash.wav', build(minor, 1, hard=True))
	write('whoosh.wav', whoosh())
	write('pop.wav', pop())
