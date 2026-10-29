# The lips of the owner's reference (royalthaiart.com, Thai Lanna dancing woman, 524; 1080 px), measured in the
# browser column by column: the upper lip's top edge (where the skin turns pink), the seam (where the upper lip's red
# ends), the lower lip's bottom edge, and the darker rim inside it. Mapped onto the mural head as the nose is (mirrored,
# set by the irises) and written as JS: LIPS_LANNA in units, where the painting has the mouth (B); muLips moves it.
COLS = """538 309.2 - 318.9 -,539 309.1 - 320.4 -,540 308.7 316.0 321.8 319.0,541 308.3 316.6 322.5 321.0,542 307.9 316.5 323.2 321.0,543 307.7 316.3 324.7 322.0,544 307.7 316.6 325.4 323.0,545 307.8 316.8 325.8 323.0,546 308.2 317.0 326.6 324.0,547 309.1 317.4 327.5 324.0,548 309.8 317.8 327.9 324.0,549 310.1 317.5 328.7 325.0,550 310.3 317.8 329.3 325.0,551 310.2 318.0 329.3 326.0,552 310.1 318.2 329.8 326.0,553 310.0 318.3 329.6 326.0,554 309.9 318.4 329.3 326.0,555 309.8 318.4 328.5 326.0,556 309.7 318.4 327.9 326.0,557 309.7 318.3 327.7 326.0,558 309.8 318.3 327.5 325.0,559 310.0 318.3 327.3 325.0,560 310.2 318.1 326.9 325.0,561 310.5 317.6 326.1 324.0,562 311.3 317.3 325.6 324.0,563 312.3 317.1 325.4 323.0,564 312.7 316.9 325.1 323.0,565 313.2 - 323.7 -"""
cols = []
for c in COLS.split(","):
    f = c.split()
    cols.append([float(f[0])] + [None if v == "-" else float(v) for v in f[1:]])
LEFT = (535.5, 309.8)          # the far corner (her left in the painting), where the dark tick ends
RIGHT = (573.5, 316.4)         # the near corner, the end of its dark tail
# the seam where the red has not reached its full strength (the corners), carried on to the corners
seam = [(LEFT[0], LEFT[1]), (538, 312.6), (539, 314.5)] + [(c[0], c[2]) for c in cols if c[2] is not None] + [(566, 316.8), (569, 316.6), RIGHT]
top = [LEFT] + [(c[0], c[1]) for c in cols] + [(566, 314.1), (568, 315.4), (570, 315.9), RIGHT]
bottom = [LEFT, (536, 309.3 + 1.0), (537, 312.4)] + [(c[0], c[3]) for c in cols] + [(566, 319.5), (568, 319.1), (570, 318.4), RIGHT]
rim = [(c[0], c[4] + 0.5) for c in cols if c[4] is not None]
rim = [(x, sum(q[1] for q in rim[max(0, i - 2):i + 3]) / len(rim[max(0, i - 2):i + 3])) for i, (x, y) in enumerate(rim)]   # its whole-pixel steps smoothed
tickL = [(533.5, 309.4), (535.5, 309.8), (537.5, 310.6)]
tickR = [(564.5, 317.0), (567, 317.0), (570, 316.9), (573.5, 316.3)]

src = [complex(-609, 261), complex(-543.5, 251)]
dst = [complex(-0.5, -51.2), complex(27.3, -52.2)]
a = (dst[1] - dst[0]) / (src[1] - src[0]); b = dst[0] - a * src[0]; k = abs(a)
def m(pts): return "[" + ",".join("[%.2f,%.2f]" % ((a * complex(-x, y) + b).real, (a * complex(-x, y) + b).imag) for x, y in pts) + "]"
print("var LIPS_LANNA = {")
print("  upper: " + m(top + seam[::-1]) + ",")
print("  lower: " + m(seam + bottom[::-1]) + ",")
print("  seam: " + m(seam) + ",")
print("  rim: " + m(rim) + ",")
print("  tickL: " + m(tickL) + ",")
print("  tickR: " + m(tickR) + ",")
print("  px: %.3f" % k)
print("};")
