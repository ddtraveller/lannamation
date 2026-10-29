# The ear of the owner's reference (royalthaiart.com, Thai Lanna dancing woman, 524; 1080 px), measured in the
# browser: its edge against the hair and the ground by rays from its middle (660, 290); its two fold lines traced
# along their middles with their darkness. Its front, where it runs into the skin of her face unlined, set by eye.
# Mapped onto the mural head as the nose is (mirrored, set by the irises) and written as JS: EAR_LANNA.
EDGE = [(649.8, 272.2), (652.1, 270.8), (654.7, 270.2), (657.2, 268.7), (660.0, 267.8), (662.9, 267.9), (665.9, 268.0),
        (668.7, 269.0), (670.6, 271.6), (672.6, 273.5), (674.1, 275.9), (675.3, 278.3), (676.0, 280.8), (676.4, 283.2),
        (676.4, 285.6), (676.4, 287.8), (676.0, 290.0), (675.6, 292.1), (674.7, 293.9), (674.3, 295.9), (673.4, 297.8),
        (672.5, 299.6), (671.5, 301.5), (670.8, 304.1), (669.0, 305.6), (667.5, 308.0), (665.4, 310.3), (662.8, 311.1),
        (660.0, 314.8), (656.5, 316.8), (652.4, 318.3), (648.0, 318.6)]
FRONT = [(646.5, 314.0), (647.5, 305.0), (648.5, 292.0), (649.0, 280.0)]      # by eye: no line there in the painting
LOBE = (645.0, 316.0)                                                         # where the earring hangs
LOOP = [(663.1, 290.1, 17), (663.5, 288.8, 22), (663.8, 287.4, 27), (664.0, 286.0, 30), (664.1, 284.6, 30), (663.8, 283.2, 42),
        (663.5, 281.8, 30), (662.4, 280.7, 37), (661.4, 279.7, 60), (659.3, 280.0, 50), (657.9, 282.3, 56), (657.0, 283.4, 54),
        (656.2, 284.6, 46), (655.5, 285.7, 47), (654.8, 287.0, 65), (654.3, 288.3, 79), (654.2, 289.7, 61), (653.9, 291.1, 44),
        (654.0, 292.6, 39), (654.5, 293.9, 40), (654.5, 295.4, 35), (654.3, 296.8, 30), (654.0, 298.1, 29), (652.4, 299.1, 14),
        (650.1, 298.6, 28), (648.9, 296.6, 13), (650.6, 293.1, 29), (652.5, 292.0, 21)]
FOLD = [(657.1, 305.0, 25), (658.3, 304.3, 26), (659.4, 303.4, 29), (660.5, 302.5, 29), (661.6, 301.7, 33), (662.7, 300.7, 33),
        (663.8, 299.8, 38), (664.8, 298.8, 37), (665.6, 297.7, 36), (666.2, 296.4, 40), (666.8, 295.1, 43), (667.4, 293.9, 55),
        (667.9, 292.6, 73), (668.4, 291.2, 56), (668.6, 289.8, 55), (668.8, 288.4, 62), (668.8, 287.0, 74), (668.9, 285.6, 77),
        (668.7, 284.1, 75), (668.2, 282.8, 71), (667.4, 281.0, 37), (666.6, 280.0, 17)]
FULL = 75.0      # the fold lines' paint (178, 142, 170) at full strength: its darkness below the ear's skin, less 8
WIDTH = 1.9      # their measured width, px

src = [complex(-609, 261), complex(-543.5, 251)]
dst = [complex(-0.5, -51.2), complex(27.3, -52.2)]
a = (dst[1] - dst[0]) / (src[1] - src[0]); b = dst[0] - a * src[0]; k = abs(a)
def z(x, y): w = a * complex(-x, y) + b; return w.real, w.imag
def pts(P): return "[" + ",".join("[%.2f,%.2f]" % z(x, y) for x, y in P) + "]"
def ink(P):
    out = []
    for i in range(len(P)):                                                  # a running mean over three, as the nose
        win = P[max(0, i - 1):i + 2]
        x, y, pk = (sum(q[j] for q in win) / len(win) for j in range(3))
        out.append("[%.2f,%.2f,%.3f]" % (z(x, y) + (WIDTH * pk / FULL * k,)))
    return "[" + ",".join(out) + "]"
print("var EAR_LANNA = {")
EDGE = [EDGE[0]] + [tuple(sum(q[j] for q in EDGE[i - 1:i + 2]) / 3 for j in range(2)) for i in range(1, len(EDGE) - 1)] + [EDGE[-1]]   # the rays' pixel steps smoothed
print("  edge: " + pts(EDGE) + ",")
print("  front: " + pts(FRONT) + ",")
print("  lobe: [%.2f,%.2f]," % z(*LOBE))
print("  loop: " + ink(LOOP) + ",")
print("  fold: " + ink(FOLD))
print("};")
