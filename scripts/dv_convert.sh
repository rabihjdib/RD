#!/usr/bin/env bash
# Convert an iPhone Dolby Vision / HLG clip to SDR the way Apple devices display it:
# libplacebo applies the clip's own Dolby Vision metadata (no grading, no LUTs), then the
# frame is scaled to 1080x1920 at 30fps. If the target already exists, its audio track
# (the cleaned voice) is kept.
#
#   scripts/dv_convert.sh IMG_4771.mov public/halloween/h3.mp4
#
# Needs a Vulkan device. On machines without a GPU, point VK_ICD_FILENAMES at a software
# driver (e.g. SwiftShader's vk_swiftshader_icd.json). The bilinear scalers, no peak
# detection and no dithering keep software drivers free of rendering artifacts.
set -euo pipefail
src="$1"
dst="$2"
pl="apply_dolbyvision=1:w=1080:h=1920:upscaler=bilinear:downscaler=bilinear:peak_detect=0:dithering=-1:skip_aa=1"
pl="$pl:colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv:format=yuv420p"
tmp="$(mktemp --suffix=.mp4)"
ffmpeg -v error -y -init_hw_device vulkan -i "$src" -vf "libplacebo=${pl},fps=30" \
	-c:v libx264 -preset medium -crf 20 -g 30 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an "$tmp"
if [ -f "$dst" ] && ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$dst" | grep -q .; then
	out="$(mktemp --suffix=.mp4)"
	ffmpeg -v error -y -i "$tmp" -i "$dst" -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart "$out"
	mv "$out" "$dst"
	rm -f "$tmp"
else
	ffmpeg -v error -y -i "$tmp" -c copy -movflags +faststart "$dst"
	rm -f "$tmp"
fi
echo "dolby vision -> sdr: $dst <- $src"
