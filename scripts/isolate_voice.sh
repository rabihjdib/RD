#!/usr/bin/env bash
# Voice isolation for a rush: replaces the audio track of an already-transcoded rush
# (public/reel/rushN.mp4) with a cleaned version taken from the original camera file.
#
#   scripts/isolate_voice.sh IMG_3784.mov public/reel/rush1.mp4
#
# Chain: high-pass (rumble, handling noise) -> RNNoise speech model (room tone, AC hum,
# street noise) -> light FFT denoise for leftover hiss -> gentle compression -> de-ess
# -> loudness to -16 LUFS (the music bed and SFX bring the final mix to about -14).
# The video stream is copied untouched. arnndn (10ms) and afftdn (25ms) delay the audio,
# so the chain trims that latency back off to keep lip sync exact.
set -euo pipefail

src="$1"
rush="$2"
here="$(cd "$(dirname "$0")" && pwd)"
model="$here/.cache/sh.rnnn"

# RNNoise "somnolent-hogwash" speech model from github.com/GregorR/rnnoise-models.
if [ ! -f "$model" ]; then
	mkdir -p "$here/.cache"
	curl -sSfL -o "$model" https://raw.githubusercontent.com/GregorR/rnnoise-models/master/somnolent-hogwash-2018-09-01/sh.rnnn
fi

latency=0.035
tmp="$(mktemp --suffix=.mp4)"
ffmpeg -v error -y -i "$rush" -i "$src" -map 0:v:0 -map 1:a:0 -c:v copy \
	-af "highpass=f=90,arnndn=m=${model}:mix=0.9,afftdn=nr=8:nf=-50,atrim=start=${latency},asetpts=PTS-STARTPTS,apad=pad_dur=${latency},acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2,deesser=i=0.35,loudnorm=I=-16:TP=-1.5:LRA=9" \
	-c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$tmp"
mv "$tmp" "$rush"
echo "isolated voice: $rush <- $src"
