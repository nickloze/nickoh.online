#!/usr/bin/env bash
# Encode one project video for the web, plus its poster.
#
#   scripts/encode-video.sh <input> <out-base> [max-width] [max-fps]
#
#   scripts/encode-video.sh ~/Downloads/new-cover.mov public/work/refine/cover
#     → public/work/refine/cover.mp4   H.264, muted, faststart, ≤1990 wide
#     → public/work/refine/cover.jpg   frame 0, so the still never jumps when
#                                      playback starts
#
#   CRF=26 …            higher = smaller file (default 23)
#   VF="crop=1920:1062:0:9" …
#                       filters to run first — e.g. trim a 16:9 master to a
#                       slot's 995:550 shape (1920 × 1062, centred)
#
# The media slots are 995 wide, so 1990 is 2× — sharp on retina, no bigger
# (and nothing is ever upscaled).
#
# Colour: exports from screen recorders and editors are usually BT.709 but
# often untagged, and ffmpeg reads an untagged file as BT.601 — which darkens
# reds and oranges by ~10 levels on the way through. Untagged input is
# therefore declared BT.709 up front; the output is limited range, tagged
# BT.709, so a dark frame matches the page's #0e0e0e in every browser. The
# poster is converted properly to full-range JPEG so it matches frame 0.
set -euo pipefail

in="${1:?input file}"
out="${2:?output base, e.g. public/work/refine/cover}"
width="${3:-1990}"
fps="${4:-60}"
crf="${CRF:-23}"
pre="${VF:+${VF},}"

tag="$(ffprobe -v error -select_streams v:0 -show_entries stream=color_space -of csv=p=0 "$in" || true)"
declare_709=""
if [ -z "$tag" ] || [ "$tag" = "unknown" ]; then
  declare_709="setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv,"
fi

mkdir -p "$(dirname "$out")"

ffmpeg -hide_banner -loglevel error -y -i "$in" \
  -vf "${declare_709}${pre}scale='min(${width},iw)':-2:flags=lanczos:out_range=tv,fps='min(${fps},source_fps)',format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf "$crf" -tune film -x264-params aq-mode=3 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -an -movflags +faststart \
  "${out}.mp4"

ffmpeg -hide_banner -loglevel error -y -i "${out}.mp4" -frames:v 1 \
  -vf "scale=in_color_matrix=bt709:in_range=tv:out_color_matrix=bt601:out_range=pc,format=yuvj444p" \
  -q:v 3 "${out}.jpg"

printf '%s.mp4  %s\n' "$out" "$(du -h "${out}.mp4" | cut -f1)"
