#!/usr/bin/env bash
# Evens out mains-light flicker in an already converted clip: each frame's brightness is
# matched to the average of its 7 neighbours (ffmpeg deflicker), so colours and exposure
# stay as filmed and only the frame-to-frame pumping goes. Silent clips only (-an).
#
#   scripts/deflicker.sh public/brunch/b_pan.mp4
set -euo pipefail
f="$1"
tmp="$(mktemp --suffix=.mp4)"
ffmpeg -v error -y -i "$f" -vf "deflicker=size=7:mode=am" -c:v libx264 -preset medium -crf 18 -g 30 \
	-color_primaries bt709 -color_trc bt709 -colorspace bt709 -an "$tmp"
mv "$tmp" "$f"
echo "deflickered: $f"
