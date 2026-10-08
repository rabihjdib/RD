#!/usr/bin/env bash
# Converts the iPhone HLG/BT.2020 HDR rushes into 1080x1920 SDR H.264 that Remotion
# can decode quickly. Mobius tone mapping keeps the store colours from going flat.
# Usage: scripts/transcode.sh <input.mov> <output.mp4>
set -euo pipefail
ffmpeg -v error -y -i "$1" -an \
  -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:param=0.5:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,eq=contrast=1.06:saturation=1.15,format=yuv420p" \
  -c:v libx264 -preset slow -crf 20 -g 15 -movflags +faststart "$2"
