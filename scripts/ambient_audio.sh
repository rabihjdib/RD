#!/usr/bin/env bash
# Natural sound for party / B-roll clips: adds the camera's own audio to an already
# converted clip with light treatment only (rumble high-pass and loudness), because the
# voice denoiser would treat singing and crowd noise as noise. No latency is added, so
# sync is untouched; the video stream is copied.
#
#   scripts/ambient_audio.sh IMG_5019.mov public/birthday/p_sing.mp4
set -euo pipefail
src="$1"
dst="$2"
tmp="$(mktemp --suffix=.mp4)"
ffmpeg -v error -y -i "$dst" -i "$src" -map 0:v:0 -map 1:a:0 -c:v copy \
	-af "highpass=f=80,loudnorm=I=-18:TP=-2:LRA=11" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$tmp"
mv "$tmp" "$dst"
echo "natural sound: $dst <- $src"
