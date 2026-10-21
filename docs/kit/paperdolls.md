# Paperdolls: one character each, on top of the kit

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## Paperdolls: one character each, on top of the kit

(This section is by the session that builds the paperdolls; its files are `paperdoll.js`,
`fonlep.js`, `apsara.js`, `puman.js` and their sheets.)

A paperdoll is a character made for the kit without changing the kit: a cast member, the clothes the kit does not draw, and cloth that moves on its own, in a file of its own on top of `paperdoll.js`. `fonlep.js` (the fingernail dancer, in profile, with a red scarf that hangs from her raised forearm: since 2026-10-13 her stage dress, `stage: true`, over a dancer dressed as the sources say) and `apsara.js` (the celestial dancer of the Siamese stage, three-quarter, with a patterned sabai hanging from both forearms and a crown) were read from two paintings the owner gave on 2026-10-12; nothing of either painting is copied, and each file opens with what it shows, as numbered rules with the measured numbers. `puman.js` (the whispering man of the Wat Phumin mural, read from the owner's reference photograph: a bare chest, a knot on the crown, a dotted shoulder cloth, a short indigo loincloth and the tattooed thighs, drawn on the sheet over the kit's bare legs) followed on the owner's choice of "a man from the Lanna murals". The owner judged the first two "nice" the same day.

| Rule | Where | The math |
|---|---|---|
| **A doll draws between the kit's layers** | `paperdoll.js`: `paperdoll(style, x, y, more)`, the wrappers round `arm`, `follow`, `ladyFace` | `person()` is not edited; it calls those three at known moments, so a doll's style draws its costume in the waist's frame before either arm (at the far arm's call), a cuff or a wrap after each arm (before its hand), an ornament in the head's frame before the head and hair (at the `/pins` follow, so the look needs `pins: true`), a crown after the face. What hangs behind her is drawn before `person()` from the last frame's joints, which `person()` gives back. Every doll has an id (the n-th drawn in a frame, as the kit numbers its people); a shared id drew one body's scarf over another's face |
| **Cloth is a chain** | `chainStep`, `walk`, `limit` | the snake of procedural_animation.html: each point one gap behind the point before (`walk`), bent no more than `bend` from that one's direction (`limit`), keeping `keep` of its speed from the frame before and sinking `sink` px/s: a scarf is 16-17 points, gap 14, bend π/7, sink 220, keep 0.9, led from 30 units up the forearm; bead strands 11-13 points, gap 10, bend π/16, sink 700, keep 0.55. A cut, or the clock gone back, hangs it again at rest |
| **Cloth is painted in the thangka's order** | `ribbon`, `scarfEnd`, `drape` | the flat colour; a flat darker band on the inside of each bend with a crease line where the bend passes 0.25 rad; pleats down the length from the gather; the gold work; the dark line last (`inkFor`, `heavy`). An end is a flame point that curls outward (`tip: "flame"`) or a straight cut with threads (`"fringe"`); a panel of another cloth may cover the last six points |
| **Bands lie on the skirt's wave** | `band`, `bandCorners`, `hipsOf` | a belt or hip band's corners take `tier()`'s drift, `-36 · u^1.3 · sin(phase - 1.6u)`, and its swell, `0.16 · u · cos`, with the hips' tip from `person()`'s own sums, so the band stays on the cloth |
| **A still shows the cloth in motion** | the sheets' `draw(t)` | a jump in the clock first runs the frames before it (see "The kit's own checks"); `peek.py` cuts one figure at full size beside the reference at the same height (the side-by-side of the matching method, as a tool) |

### What real Lanna dress was, and the characters still to build (2026-10-13)

The owner asked for the dolls to be judged against what Lanna people wore. The sources: Manop
Manasaem, *พัฒนาการเครื่องแต่งกายชาวล้านนา (ไทยวน)*, Fine Arts Journal, Chiang Mai University
(garments, hair, ear ornaments and tattoos, era by era); Linda McIntosh, *Tai Yuan Textiles of
Thailand*, Textiles Asia 4.1 (2012) (the sin's three parts, the breast cloth); Thai Wikipedia
*ฟ้อนเล็บ* and Indiana University's fingernail-extension notes (the dance's dress and its eight
nails); descriptions of the Wat Phra Singh (Lai Kham) and Wat Phumin murals. Two eras matter.
**Before Rama V** (the murals, to about 1890): both sexes bare-chested; a woman in a sin with a
breast band or a sabai thrown over one shoulder, the hair in a bun at the nape with a wire pin,
a rolled palm-leaf or gold ear plug (*lan hu*) in a stretched lobe; a man in a black-and-white
checked cloth (*pha ta kong*) hitched between the legs (*pha toi*), tattooed from the waist to
the knee (*sak kha lai*). **Rama V onward** (1890s to 1930s): round-necked front-opening shirts
for everyone, the mo hom and Chinese-silk trousers for men, the high padded "Japanese" bun that
Chao Dara Rasami brought north, blouses with leg-of-mutton sleeves at court. The kit's village
cast is the second era; the murals are the first; both are real Lanna. A sin's head (*hua sin*)
was white or pale cotton, a hand's span, sometimes with a red or rust band under it; its foot
(*tin sin*) plain black or red, or a *tin jok* for a festival. Lanna monks' robes were dyed with
jackfruit heartwood, an ochre-brown, not Bangkok's orange.

**Not yet built, in the order they are worth building.** Each is documented in those sources, and
none is the painting's or the stage's invention:

| Character | What the sources give | On the kit |
|---|---|---|
| **The whisperer's partner** (Ya Man, the mural woman of the 1870s) | a sabai over one shoulder with the end thrown behind, a striped sin with the pale head showing above the hip, a nape bun with a pin, *lan hu* ear plugs, spiral bangles on the arms; bare shoulders | a paperdoll beside `puman.js`: the kit's `sabai` over a bare torso (`shirt` as skin), `sin` with the pale head, `earplug`, `bangles`. The kit's first woman of the mural era |
| **A court lady of the Dara Rasami era** (1900s to 1920s) | a blouse with leg-of-mutton sleeves and lace, a silk sabai, a *sin tin jok* with gold thread, a silver plate belt (*tai aeo*), the high padded bun with a buffalo-horn comb and a spray of flowers | the real fon lep look; needs puffed sleeves (`onArm`), a plate belt (`band`) and a comb at the bun (`ornament`) |
| **A Tai Lue woman of Nan** | an indigo wrap blouse tied at the side (*seua pat*) with a row of silver buttons, a sin with the water-flow zigzag bands (*lai nam lai*), a head cloth | the kit's `zigzag` band already exists; the wrap blouse and the head cloth are new |
| **A Tai Yuan farmer of the murals** | cropped hair, bare chest, the checked cloth as *pha toi*, tattoos to the knee, a small patterned shoulder cloth (*pha chet*), buffalo-hide sandals (*kwan*) | `puman.js` with the Burmese knot gone, the cloth as `checks` and the hair cropped |
| **A Lanna celestial** of the Lai Kham murals | a tall pointed crown with ear flanges, a fitted long-sleeved jacket, a collar piece, a pha nung with a tail, a halo (my reading of the murals: no source describes them garment by garment) | the kit's `celestial` has the halo and the lotus; the crown and the jacket are new. The true Lanna shape for `apsara.js`, which is the Siamese stage |

Two things were not verified: the whisperer's head is read from the owner's photograph alone, and
the Tai Lue head cloth is attested for later periods than the mural's decade.

**Changed the same day, against those sources** (the owner: "Start the changes to existing
characters"):

| What | Where | Now |
|---|---|---|
| The sin's head was dark | `SINS`, `SIN_HEAD`, `SIN_HEAD_BAND` | a pale cotton band 20 wide at 0.05 of the tube, a rust line 2.5 at 0.11, on all three designs; it shows between the blouse's hem and the hip |
| Nobody wore a *lan hu* | `earplug: colour`, `earplug()` in `person()`, a row in `looks.html` | a disc 5.5 × 6 on the lobe at (earX, −272), smaller in profile, with a curl inside; it replaces the earring on both ears when set |
| The monk was Bangkok orange | `CAST.monk` | `#b8732a` robe, `#9a5e20` under it |
| A man's cloth had no check | `stripe()` kinds `"checks"` and `"checks-odd"` | squares of the band's width, every other one, as many as fit at two widths apart; two bands with the other phase, stacked, make the check |
| `fonlep` wore the painting | `CAST.fonlep`, `FONLEP_STAGE`, `fonlep(x, y, {stage: true})` | by default the dancer of the sources: `sin: 2`, `plain` (a round neck), the sabai across the chest, an orchid, the jasmine garland and the gold strands at the bun, `earplug`, a silver plate belt (`fonlepSilverBelt`: links every 9), no tail, no fan, nothing on the arm. `stage: true` lays the painting's dress over her: the tiered black skirt, the V-neck trim, the green cuffs, the gold-leaf fan, the bead strands, the hair tail, the belt and hip band, the scarf from the forearm. The sheet shows both |
| A doll's own key reached the kit | `paperdoll.js`: `style.keys`, `doll.own` | the keys a style names are kept out of the look (the kit warns about a name it does not know) and handed to the style as `doll.own` |
| `puman`'s cloth was the painter's | `PUMAN.cotton`, the loincloth's `tier` | a *pha ta kong*: pale cotton with six rows of ink checks 6.5 wide, the red hem band kept; the tattoo's ink at 0.78 with the scrolls in his skin colour, so the thigh reads dark and the skin shows between |
| `apsara` was called Lanna | `apsara.js`, `apsara.html` | named the celestial dancer of the Siamese stage; nothing drawn was changed |
| `fonlep`'s sleeves tapered | `fonlepTube` | a tube sleeve (แขนกระบอก): over the kit's forearm a straight tube of the blouse's colour, 10 wide, from 4 above the wrist (the bangles show) to 2 past the elbow, lined along its edges and its hem only, so no seam crosses the elbow; the stage dress keeps its cuffs |
| `puman`'s tattoo had one length | `tattoo(..., reach)`, `tattoo: "long"` | the short form (sak kha kom) stops 10 short of the knee as before; `tattoo: "long"` (the sak kha yao) runs to 4 past it, the band over the knee. The sheet's walker wears the long form |
| The cast's women had no ear plug | `CAST.maiden`, `CAST.weaver`, `CAST.devotee` | gold on the maiden and the devotee; a rolled palm leaf (`#b8a060`) on the weaver, as a village woman wore (Manop Manasaem) |
| The villager's head-cloth | `CAST.villager` | unchanged, with a comment: the head-cloth is Tai Yai, Tai Lue or Burmese wear, not Tai Yuan, so he is a man of those peoples |

The thumbs: the report said the dancer's nails were on all ten fingers. They were not: `glove()`
draws a nail on each of the four fingers and never on the thumb, as fon lep has it. Nothing to
change there.
