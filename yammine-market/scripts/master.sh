#!/usr/bin/env bash
# Brings a rendered video to Instagram/TikTok loudness (-14 LUFS, -1 dBTP) without
# re-encoding the picture, and moves the index to the front for fast playback.
# Usage: scripts/master.sh out/yammine-general-raw.mp4 out/yammine-general.mp4
set -euo pipefail
ffmpeg -v error -y -i "$1" -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$2"
