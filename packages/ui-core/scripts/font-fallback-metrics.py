"""
Fallback metrics for `src/styles/fonts.scss`: how much a local font must be resized (`size-adjust`)
and how its vertical metrics must be overridden to take the same room as the web font, so text
doesn't shift when the web font swaps in. Same method as capsize / next/font: the average width of
English text (letters weighted by frequency, space included), at the font's default instance.

Usage (needs `pip install fonttools brotli`):
  python3 scripts/font-fallback-metrics.py <web font .woff2/.ttf> <local fallback .ttf>
  e.g. src/styles/fonts/onest-latin.woff2 /System/Library/Fonts/Supplemental/Arial.ttf
"""
import sys

from fontTools.ttLib import TTFont

LETTER_FREQUENCY = {
    ' ': 0.1818, 'e': 0.1036, 't': 0.0748, 'a': 0.0661, 'o': 0.0613, 'i': 0.0571, 'n': 0.0571,
    's': 0.0533, 'r': 0.0498, 'h': 0.0476, 'l': 0.0332, 'd': 0.0303, 'u': 0.0225, 'c': 0.0221,
    'm': 0.0201, 'f': 0.0181, 'w': 0.0167, 'g': 0.0164, 'y': 0.0151, 'p': 0.0144, 'b': 0.0119,
    'v': 0.0083, 'k': 0.0060, 'x': 0.0015, 'j': 0.0012, 'q': 0.0009, 'z': 0.0006,
}


def metrics(path):
    font = TTFont(path)
    units = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    widths = font['hmtx']
    total = sum(LETTER_FREQUENCY.values())
    average = sum(widths[cmap[ord(char)]][0] * weight for char, weight in LETTER_FREQUENCY.items())
    hhea = font['hhea']
    return {
        'width': average / total / units,
        'ascent': hhea.ascent / units,
        'descent': abs(hhea.descent) / units,
        'line_gap': hhea.lineGap / units,
    }


web, fallback = (metrics(path) for path in sys.argv[1:3])
size_adjust = web['width'] / fallback['width']
print(f"size-adjust: {size_adjust * 100:.2f}%,")
print(f"ascent-override: {web['ascent'] / size_adjust * 100:.2f}%,")
print(f"descent-override: {web['descent'] / size_adjust * 100:.2f}%,")
print(f"line-gap-override: {web['line_gap'] / size_adjust * 100:.2f}%,")
