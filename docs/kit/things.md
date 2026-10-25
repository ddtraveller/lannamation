# Things: food, the woven sabai, flowers and fruits, pieces of the north, lanterns and the band

Part of the Lanna cartoon kit's style guide, [`docs/STYLE.md`](../STYLE.md), which holds the rules, the
framework, `person()` and the checks. Each section below was written there first and is here word for word
(moved 2026-10-21); a new note on these parts of the kit goes here.

## A dozen Thai dishes

From the same request. `food.js` is a file of its own on top of the kit, loaded after it, and gives
`food(name, x, y, look)`: `(x, y)` is the middle of what the dish stands on. No picture was given:
each is drawn from what the dish is, seen from the side and a little from above, as the paintings
show a tray, in flat colour inside a fine dark line.

| `name` | Thai, and how it is said | What is drawn | Size at 1 |
|---|---|---|---|
| `stickyrice` | ข้าวเหนียว, khao niao | a basket of woven bamboo (a kratip) on a small foot, its lid lifted on one side so that the rice shows, a cord to carry it by | 76 by 92 |
| `khaosoi` | ข้าวซอย, khao soi | a bowl of curry broth with red oil on it, a nest of crisp noodles, a leg of chicken, rings of shallot, a wedge of lime, chopsticks across the rim | 101 by 53 |
| `somtam` | ส้มตำ, som tam | a tall mortar of dark clay heaped with shreds of green papaya, tomato, long beans, a chilli and peanuts, and the wooden pestle standing in it | 77 by 108 |
| `mangorice` | ข้าวเหนียวมะม่วง, khao niao mamuang | slices of ripe mango laid in a fan, a mound of rice with coconut cream running down it and yellow beans on the cream | 82 by 33 |
| `saiua` | ไส้อั่ว, sai ua | the sausage of the north in a coil on a banana leaf, flecked with herbs and chilli, and two slices cut from its end | 93 by 36 |
| `namphrik` | น้ำพริกหนุ่ม, nam phrik num | a small bowl of green chilli dip on a plate with what is eaten with it: cucumber, a wedge of cabbage, long beans, pork crackling | 77 by 27 |
| `curry` | แกงเขียวหวาน, kaeng khiao wan | a bowl of curry with coconut cream turned through it, round eggplants, red chilli and basil. `colour` is the curry's colour: green unless told | 68 by 42 |
| `tomyum` | ต้มยำกุ้ง, tom yam kung | a bowl of red broth with beads of chilli oil, two prawns, straw mushrooms cut in half, a stalk of lemongrass, lime leaves | 72 by 48 |
| `padthai` | ผัดไทย, phat thai | a plate of fried noodles with a prawn on them, egg, bean sprouts and chives beside, a heap of crushed peanuts, a wedge of lime | 78 by 33 |
| `muping` | หมูปิ้ง, mu ping | three skewers of bamboo on a banana leaf, four pieces of pork on each, glazed and marked by the fire | 95 by 35 |
| `khanomkrok` | ขนมครก, khanom khrok | the round iron pan with seven hollows and two ears, a small white cake of coconut cream in each, browned at its edge, with green onion | 114 by 31 |
| `khantoke` | ขันโตก, khantok | the low round table of the north: red lacquer with gold on its edge, on a ring of turned legs, set with four small bowls and a basket of rice | 176 by 109 |

`FOODS` is the table: each name with its painter, its Thai name (`thai`) and how that is said
(`say`), so a page can write the name under the dish, as `food.html` does. A look has three names
(`FOOD_KEYS`): `size`, `colour` (the curry's) and `steam`. The hot dishes (khao soi, curry, tom yam,
khanom khrok) have three wisps of steam that rise, fade and begin again; `steam: false` leaves it
off, and steam has a faint brown edge so that it shows on pale paper. `size: 1` is as large as the
dish is beside the cast at their own sizes: a bowl is about 64 across, and a khantok more than
twice that. A name `food()` does not know draws nothing and the kit warns, with the nearest name.
The shared pieces are `foodBowl` (what is in a bowl is painted by a function, with the pen kept to
the rim), `foodPlate`, `foodLeaf`, `foodSteam`, `foodLime` and `foodPrawn`.

`food.html` is the sheet: the twelve, large, each with its three names; and below, at their own
sizes, a grandmother and the little girl on the floor at a khantok, with a basket of rice, a
mortar of som tam and skewers on the mat, and a pig. Measured (2026-10-13): all twelve take 7.2 ms
to draw, the khantok the most; `kit_check.py`: `food.html` draws, same 2 / 0, 24.8 ms a frame;
the five pages that load `beasts.js` or `food.js`: 5 pages, 0 failures.

**Not done:** nobody holds a dish, eats, or lifts a spoon: a dish stands where it is put. Each is
seen from one side only and has one arrangement. There are no drinks, no fruit on its own, no
market stall, no fire under the pan and no smoke from the skewers. The sizes above are of the ink,
so a pale plate's own edge is what was measured. The dishes are not in the cartoon maker's palette.
Judged from stills only.

## A sabai woven with figures that walk

The owner (2026-10-13): "Add the sash to the framework." The shoulder cloth of the sash film
(`sash.html`, the film at the top of `lanna_cartoon.html`) is `sabai.js`, a file of its own on top
of the kit, loaded after it and after the modules its rows use (`naga.js` and those named below). A scene draws
the back of the cloth, then the person wearing it (since 2026-10-15; before that the front was a third
call, drawn over the person, arms and all):

```
var where = sabaiOf(t, 720, 1010, look);     // where the cloth lies on this person, this frame
sabai(t, where, {from: 3}, "back");          // the end that hangs behind the shoulder, down her back
person(720, 1010, sabaiWorn(look, t, where, {from: 3}));   // the woven band across the chest, under the arm; its rows flow from second 3
```

| What the cloth is | In the code | Numbers |
|---|---|---|
| Rows of woven tiles, each tile one picture of the kit at the size of a woven figure | `sabaiTile(painter)`: the kit's own painter is drawn once on a scratch sheet, measured, and drawn again to fit the tile; `paintWith(brush, action, at)` runs a painter that draws with the kit's pen on another sheet | a tile is 384 square, the picture 0.86 of it |
| In every row the people and the animals walk | a painter that takes `u` (where in its walk, 0 to 1) is drawn at six moments and the tile is that cycle; one that takes no `u` stands | six frames in 0.8 s, a walking pace |
| Twelve rows, top to bottom, of what Lanna life is made of | `SABAI_ROWS` (2026-10-15, owner: "remove some of the repeating sprites like the monk and add the temple guardian, the oxen, a baby pig, and a few of the hanging lanterns"; 2026-10-17, owner: "Replace the fish on the sash with the humingbird type bird and review the items on the sash and replace generic items with special Lanna specific items"): a house, a villager, the long khao (the rice granary), a sow with her piglet behind her (a tile is fitted to its picture, so a piglet alone would be drawn as large as a sow); a kwian, the wooden ox cart (its wheels turn), a child, a bunch of longan with one peeled, a rooster, the nam ton (the water jar at the gate); lotus, a maiden, a green-tailed sunbird hovering to sip at a thong kwao flower; the sunbird hovering, a fellow, the water buffalo, a lotus leaf; a rooster, a weaver, an elephant, a lady; a red khom, a celestial, a blue khom, a khom dao (the star lantern of Yi Peng); a tung, a child, the dok ueang orchid, a dancer; the temple, the temple guardian (`yak`), a green khom, a drummer; two naga with the guardian between them, a maiden; the luang, a player of the sueng (`musician()`), the mom, a lady sitting; the hong (the golden swan), a chedi sai with its flags, a dancer; a thong kwao flower, a child sitting, a krathong, a green peafowl in display. What any land might weave was taken out: two fish, a plain tree, a coconut palm, a banana, a second house, two dogs, three plain blossoms, a paper lantern, the sun and the thangka's cloud, the two dragons of the Himalayan paintings, and a scientist in his white coat (a thong kwao tree and a longan tree in fruit were tried in row 1: at a tile's size both read as the same green tree). No monk; a khom is tied 400 above the tile's middle so it hangs inside it. The cloth needs `beasts.js`, `khom.js`, `myth.js`, `flora.js`, `pieces.js`, `band.js` and `northbirds.js` loaded; a film made before 2026-10-17 that loads no `northbirds.js` (the cartoon maker's exports load the kit from the site with a fixed list) weaves the fish and the dog in the birds' tiles (`sabaiBird()`) | |
| The rows flow along the cloth, each the other way from its neighbour, and the figures face the way their row flows; the cloth is still until a second it is told | `flow` units a second from second `from`; each figure bobs on the beat and rocks a little | 2.5 a second |
| The cloth lies from her left shoulder down to her right hip (owner), and its top "starts from the left side of the woman's neck then follows the shoulder and past that curving gently down": in the kit's three-quarter view, from beside the far hip, bowed by the chest, up to the base of the neck on the near side, where it folds and runs along the top of the shoulder on the shoulder's own outline, past the shoulder, and from there curves gently down behind the arm, mostly hidden, a strip of it trailing down past the arm; it gathers narrower at the fold, and follows a figure who breathes, bends or walks. Owner, 2026-10-15, with three photographs of women in sabai: "so it looks more like it's going over the woman's shoulder", "Look at those models for how the sash shape should be", "The part that goes back behind her should mostly be obscured but have a part tailing down like this", "Follow the curve of the shoulder". The wearer has `sabai: false`, so the kit draws no band of its own on the other diagonal (a kit change the same day: `look.sabai !== false`). Cuts that were wrong on the way: the end curled up at the shoulder's top; the end looped out round the arm like a hoop, with the figures on it walking every way ("a bunch of extra sprites"); the cloth on the far shoulder, which is her right; one band bent round the corner at the neck, whose inner edge crossed itself | `sabaiOf(t, x, y, look)` draws the person once on a scratch sheet to ask for their joints, and reads the shoulder's outline off that drawing, column by column from the neck outward (the first pixel of the person under whatever is opaque at the top and the gap below it; a column with none is inside the neck or past the arm; a drop of 26 is the arm's outer edge; it starts at the outline's highest point and is smoothed over five columns). The line is a list of points: a cubic from the hip to the neck, the outline (6 under it, along its normal), and a cubic tail; `at(u)`, `angle(u)` (of the segment, not blended), `uAt(along)`, `length`, `fold` (the neck), `top` (where the shoulder ends), `squeeze(along)` (0.72 from the fold on, narrowing over the last fifth of the way to it; the tiles shrink with it), `middle` and `tilt` (0.4 of the way to the fold). `sabai()` draws three bands, chest / shoulder / tail, and the chest and shoulder bands are cut to one crease at the fold (a fold reflects the heading across the crease, so the crease's normal is the difference of the headings in and out, taken over 24 each side), as a folded ribbon meets itself; the gold edges run to the crease with bevelled joins | 62 beside the far hip; the strip read is 72 wide from 24 inside the shoulder, 120 tall from 72 above it; the tail to 14 across and 150 below the shoulder; width 72 across the chest, 52 from the fold on |
| A point of the cloth, an edge, a band | `sabaiAt(where, along, across)`, `sabaiEdge`, `sabaiBand`: `along` from the hip end, `across` from the middle line | 24 steps along a curve |
| The cloth, drawn, in two parts so it goes behind the arm | `sabai(t, where, cloth, part)`: the cloth's colour under the weave, the weave's alternate light and dark bands, the rows, and two gold edges. `part` "back" is the whole cloth, drawn before the person; "front" is the hip to the top of the shoulder, drawn over them, and it lies on the back's own pixels, so the two meet at the shoulder with no seam; no part is the whole cloth over the person | 72 wide, as wide as the sabai the kit draws; 3 of edge and 3 of border |
| A camera that opens on one row close up and pulls back | `sabaiCamera(t, where, cloth, start, end)`: one steady logarithmic pull-back from the row (`cloth.row`) to the whole cloth to the person to the whole stage, turning upright, the cloth kept in the middle until the view is wide; call it inside `pen.save()` ... `pen.restore()` before the scene. It holds the cloth at 0.4 of the way to the fold, where `tilt` is read: held at 0.4 of the whole length it sat near the fold once the tail was added, and the rows there lean and flip | a row fills 0.46 of the height at the start |

A cloth is an object with the names `SABAI_KEYS` lists, and `sabai()` warns about any other: `wide`,
`rows` (a list of lists of painters, `SABAI_ROWS` unless given), `tiles` (made once from the rows
and kept on the object), `cloth` (the colour), `flow`, `from`, `row`. `sash.html` keeps its woman
and puts her into row 4 of a copy of `SABAI_ROWS`, in the same look, so the film opens on her own row;
everything else of its cloth is the kit's, and its opening is pixel for pixel what it was.

`sabai.html` is the sheet: ten seconds as the film opens, one row close up, the rows flowing from the
second second and the camera pulling back from 2 to 9; then six seconds of three people, each with
a cloth of her own, six rows on indigo flowing faster, the twelve rows, and six rows still. Measured
(2026-10-13): `kit_check.py --quick`: `sabai.html` draws, same 12 / 0, 18.8 ms a frame; `sash.html`
draws, same 1 / 0, 21.4 ms, its four sung lines each inside one scene.

**Not done:** the cloth is drawn over the person, not as part of the kit's own sabai (the kit's
`sabai` look key still colours the plain one under it); the curve is read from one shoulder, so it
lies over the near shoulder only; a cloth cannot be given to the maker's JSON. Judged from stills only.

### One band, worn under the arm (2026-10-15)

The owner remade the cloth's shape a step at a time from stills of the film's woman at 19.95 s
(`Videos/lanna_sash/sash_shape*.jpg`): "a rectangle from the neck off the shoulder down to the
waist on the opposite side"; its upper corner "where the neck meets the shirt", then "down and to
the side" so it starts beside the neck; "round the top end" curving down over the shoulder; "bend
the two long sides" so it wraps her; "cut it off just past the vertical line of her shirt";
"move it up and to the right just a bit and bend the long sides to the right"; "it shouldn't go
past a few pixels past the vertical line of her body" (the chest-height scan had found the hanging
arm, 18 wider than the torso); "cut it off closer to the body and put it behind the right arm";
"cut the sash off along the line of the woman's shirt on the left side. Just 4 pixels past the
shirt"; "cut it off near where the shirt tucks into the skirt"; "the long left and right side both need
to be shorter", "cut off the yellow lines that run past the long sides", "make sure the top two corners
stay pinned where they are", "the bottom two corners need to move to the right towards the body of the
woman", "the bottom most corner should move to the left until it is just beyond the waist of the woman.
It should not cross into the arm" (a cut on the arm's inner edge down to the waist, which the owner
turned down: "7 was better"), "just move the bottom most corner from image try 7 over to the left about
10 px." Then the back of the cloth, with a photograph of a woman in a red sabai whose end hangs in folds
behind her arm to the ground, fringed: "add a line from the right most corner down to just past the hand
that gently undulates down past the waist and hand and a curved line to the left and fill with the red
sash color and shade it but leave it unmarked. Add tassels to the end of the sash." The fold at the neck, the shoulder band and the tail of the earlier shape are gone from the
film's cloth; `sabai()` keeps them for a `where` that has a fold.

| What it is now | In the code | Numbers |
|---|---|---|
| One band at 45 degrees from beside the base of the neck on the side she faces down across the chest, its middle line bowed the way she faces, the top end rounded, the lower end a slant under the arm: its upper corner 12 inside the sleeve's line, its lower corner 10 further along the lower edge | `sabaiOf()`: `neck` 22 beside and 38 above the near shoulder joint; `top` half a width down the band's normal from it, so the band's upper corner is beside the neck; a quadratic from `end` to `top` whose control is 2 × `bow` to the right of the chord's middle; the band begins `start` along from `end`; `startCap`, the line through the end's two corners (`N` their midpoint, the heading read halfway, the normal square to the corners' line), which `sabai()`'s `corner()` cuts each edge and hem to, so the hems begin at the corners; `endCap {bulge: 26}` (the rounded top); `squeeze` 1, `fold` = `top` = the length. Whatever the cut, the curve is the same, which keeps the top corners pinned | 72 wide, bow 20, bulge 26, start (16 + 36 / √2) · √2 = 59, slant 10 · √2 |
| The curve's far end is read from the drawing: the shirt's line on the far side at the far elbow's height, the sleeve hanging beside the body, 4 outside it | `edgeAt(row)` scans 150 pixels inward from outside the hip toward the body for the first opaque pixel of the person on the scratch sheet; the row is `elbowB`'s. Wrong on the way: a scan at chest height found the arm's outer edge (637 against the shoulder's 656 on the film's woman); a cut on a vertical line 4 outside the sleeve left a sliver past the arm, and its cap line left the hems running past the band's end (they start at the middle line's end, not the cap's corner: a cap must sit at the band's `start`); a clip on the arm's inner edge (the outer edge mirrored about the elbow joint: 669 against the drawn 666-668) down to the waist, which the owner turned down | a guess of 50 inside the hip when no pixel is found |
| The near arm hangs over the cloth's lower end | the kit's `worn` look key: a painter `person()` calls after the body and the head and before the arms, inside `pen.save()`/`restore()`, where the kit draws its own sabai. `sabaiWorn(look, t, where, cloth)` gives back the look with `worn` set to draw the front of the cloth in the frame the pen had when it was called (the scene's, inside the camera), so the film draws `person(x, y, sabaiWorn(look, t, where, CLOTH))` and no longer calls `sabai()` itself. Her right arm is B, the near one in the kit's three-quarter view, drawn last | |
| In a wai the upper arm on the cloth's shoulder is under the cloth, and its forearm over it (owner, 2026-10-16: "redo the sash video so the left arm of the woman in the initial scene stays under the sash when she wais", then "when women wai their biceps are under the sabai and forearms show over it") | `person()`, for a look with `wai` and a cloth (`worn`, or the kit's own `sabai`, kept as `sabaiFront()` with the frame it was drawn in): after both arms, on `WAI_LAYER` (a canvas the size of the sheet, made once), the cloth is drawn again inside arm A's upper arm (`bone()` from the shoulder to the elbow, as `arm()` gives it to `limb()`: half-widths 12 and 10 plus the ink line, swell 3, times `arms`), then the forearm, its ink and its colour as `limb()` draws them, with `source-atop`, so only over that cloth; then the layer onto the sheet, before the hands. Where no cloth lies over the upper arm, the arm stays as `arm()` drew it, with no line across the elbow. Tried first: arm A drawn whole before the cloth (the whole arm under it, only the hand over); then the cloth drawn again inside the upper arm on the sheet itself, which also covered the start of the folded-back forearm and left the band cut off along the arm with no line. The layer is made with `willReadFrequently`, so it is on the CPU: on the GPU, drawn onto a sheet that a check or a still reads back, it changed how that sheet drew every frame after it, and `looks.html` failed `same` (6931 / 496 against 22 / 0) | a wai frame 6 to 7 ms slower (`sash.html` at 20.5 s 27 to 33 ms, at 40 s 93 to 100 ms) |
| Tucked into the skirt at the waist: nothing of the cloth below the waist's line, so its lower corner does not hang over the skirt | `where.tuck`, the waist joint's height + 8; `sabai()` clips the one band to above it | 8 below the waist joint |
| The back of the cloth: the end that hangs behind the shoulder and down the far side of the body, seen past the body's and the arm's edge, plain, in shadow, fringed | `where.tail` {outer, hem, inner} from `sabaiOf()`: the outer edge is 17 points from the top end's corner at the shoulder (the band's lower edge at its top) down to a foot 54 below the hip joint, leaning out 32 by the foot and waving 5 either way (2.5 waves, drifting with `t`); the hem is 9 points curving from the outer edge's foot to an inner edge 24 past the hip, bowing down 10 and rising 8; the inner edge's top is 16 below the corner, behind the body. `sabai()`'s `back()` fills it with the cloth colour, lays a gradient over it, darker toward the body (0.38 to 0.08), strokes three soft folds down it (7 wide, 0.16), a gold hem down the outer edge and along the foot, and nine tassels from the hem's points, 16 long less 1.2 for each point from the middle, fanning 0.7 a point. `sabai(t, where, cloth, "back")` draws it before the person; the hook draws the band; no part draws both. The foot is read from the hip, not the hand, so a hand raised to wave does not lift it | corner to hip + 54; 72 wide at the foot |
| Each end of a band cut one of three ways | `sabai()`'s `shape()`: square, on a line (`corner()`, the mitre at a crease or a cut), or rounded (`bow()`, seven points of a quadratic bulging along the heading); the gold hem follows a rounded end | |

**The kit's own sabai, the same shape (2026-10-15, owner: "make sure all the sashes in the framework
sprites look like what you just made"):** `person()`'s `sabai` look key no longer draws five strokes of
one curve from the far shoulder to the near hip with two ribbon ends behind the hip. `sabaiLine()` lays
the film's band in the chest's space, in the kit's units (the film's woman is 1.19 tall, so the film's
numbers over 1.19): 60 wide, the neck point 18 beside and 32 above the shoulder's root on the side the
figure faces (`blend3(chestTurn, 4, 40, 46)`, the root's own formula, since `rootHalf` is worked out
later), the middle line laid to 33 outside the far root, the band from 50 along it, its lower corner 12
further (the slant), bowed 34, the top's bulge 22, tucked at the waist (y below 7 clipped); every point
goes through `chest()`, so it bends with the spine, and the near arm B, drawn last, hangs over its lower
end. It is filled with the cloth colour, a 6-wide stripe of the border colour inside each long edge, a
gold thread at each edge; `"check"` bars it along the middle line with two threads 14 in from the edges.
`sabaiBack(cloth, border)` draws the back where the two ribbon ends were, before a lady's skirt and
before a man's sarong, under the hips' tilt skew (which it undoes with `pen.transform(1, -hipTip, 0, 1,
0, 0)`, since `chest()` has the tilt already): the outer edge from the top end's corner down to a foot
59 below the waist (8 above the ground for one who sits), leaning out 27, waving 4 with the clock; the
hem to 20 past the middle; the cloth shaded darker toward the body, three folds, the border down the
outer edge and the foot, nine tassels of the border colour. A figure with `sabai: false` now gets
neither (the two cream ends had been drawn behind the hip regardless), so the film's woman loses the
cream ends at her hip. Both helpers sit at function level before the skirt chain: declared inside it,
they were not yet defined when the chain ran ("sabaiBack is not a function"). The maker's generated film
draws the woven cloth the new way too (`sabaiWorn`). `fonlep.html` passes again: the ribbon calls that
hit `paperdoll.js`'s shadowing `ribbon()` are gone.

**A smooth opening, figures that wrap, and a wai (2026-10-15).** The owner, of the film rendered with
the new cloth: "Why is it so choppy to start? It should be smooth. The sprites should walk to the end of
the row and wrap to the other side. Have the woman wai instead of raise her arm and wave."

| What was wrong | Measured | What it is now |
|---|---|---|
| The cut was read off the drawing in whole pixels every frame, so the cloth's lower end jumped a pixel at a time; the figures are laid out from that end, and the opening's camera holds one row about 90 times as large (`rowZoom` = 0.46 · 1080 / 5.5), so a jump threw them about 50 px on screen in one frame | over seconds 0 to 22 at 30 a second: 78 of 660 frames with the lower end jumping more than 0.5 px, the largest 14.5 px at second 20 when the arm went up | the sleeve's line is read once for each build of figure, as a distance from the far elbow joint, from the look itself with the arms hanging and what changes from frame to frame left out (`SABAI_FLEETING`), standing at (400, 1000) at second 0, and kept under that look (`SABAI_SLEEVE`, emptied past 200); every frame the cut is the elbow joint plus that distance. The per-frame drawing on the scratch sheet is also made with the arms hanging (`sabaiHanging`), under an id of its own, so a wai or a wave does not move the cloth. The same 660 frames: none over 0.5 px, the largest 0.19 px, the tilt's largest step 0.0007 degrees (it was 1.46) |
| The figures walked the whole middle line, of which the first 59 is cut away, so each was gone a while before it came back | | they walk from `where.start` to the rounded top, a round of `length − start + step`; one that walks off the cut end comes on at the top with no gap |
| She raised her arm and waved from second 20 | | `wai: true` from second 20, with the beat kept (`late: 0, spring: 0.5`) |

**The wrap without a seam (2026-10-15).** A row's loop placed one or two figures past a whole round of
the row, which landed on the first ones: at one place in every row two figures lay on top of each other
(two temples, two fish, two lanterns), in the live film as well. A row now holds a whole number of its
patterns, `cycles.length · max(1, round(round / (step · cycles.length)))` figures spaced `round / count`
apart (within about 2 per cent of `step`), so at the wrap the pattern goes on unbroken.

**The rows run to both ends (2026-10-16).** The owner, of the hero film: "the sash has rows of
sprites but they don't go all the way to the end of the sash ... go all the way to the end of the sash
on either side." Seen full size at 15 s: at the waist the slanted cut reaches 14 (`slant`) further back
on the lower rows than the round begins (`where.start`), and at the shoulder the rounded end bows 26
(`endCap.bulge`) past the middle line's end, where `sabaiAt()` stops; so the lower rows ended short of
the cut, and every row short of the rounded hem. Each row's pattern is now drawn once more a round
before and a round after itself (`copy` −1 to 1), within `half + step` of the band's ends, at the points
`sabaiOn()` gives (the middle line run on straight along the end's heading), and the cut and the
rounded end clip it. A figure inside the ends is where it was, so the opening's close-up is unchanged.
The tail behind the arm stays plain, as the owner asked on 2026-10-15.

`looks.html` shows the `worn` key as a plain band drawn under the arms. Measured (`kit_check.py
sabai.html sash.html --quick`, 2026-10-15): `sabai.html` draws, same 12 / 0, 17.5 ms a frame;
`sash.html` draws, same 0 / 0, 30.7 ms, its four sung lines each inside one scene. The whole kit's
quick check the same day: 38 pages, the one failure not of this work `fonlep.html`, where
`paperdoll.js`'s own `ribbon(P, wide, ...)` shadows the kit's `ribbon(x1, y1, ...)` that `person()`
now calls for a man's sabai ends (it fails the same at HEAD).
Not done: the tail behind the arm is not in this shape; the old reading of the shoulder's outline is
gone with it (in git before this day's commits).

## The flowers and fruits of Thailand

The owner (2026-10-13): "Add flowers and fruits local to Thailand to the framework." `flora.js` is a
file of its own on top of the kit, loaded after it, and gives `flora(name, x, y, look)`: `(x, y)` is
the foot of a flower's stem, or the ground a fruit lies on. No picture was given: each is drawn
from what the plant is, in flat colour inside a fine dark line. The flowers are the ones of a
northern garden and a temple's offering tray; the fruits the ones of the market and the orchard.

| `name` | Thai, and how it is said | What is drawn | Ink at size 1 |
|---|---|---|---|
| `ratchaphruek` | ราชพฤกษ์ (ดอกคูน), ratchaphruek | the golden shower, the national flower: a twig with its leaves in a fan and two racemes of small yellow five-petal flowers hanging, the buds at their tips | 112 by 178 |
| `thongkwao` | ทองกวาว, thong kwao | the flame of the forest, Chiang Mai's own flower: clusters of orange-red flowers on a bare twig (the tree flowers before it has leaves); one flower is a curved keel like a parrot's beak in a dark velvet calyx. `colour` | 120 by 161 |
| `frangipani` | ลีลาวดี, lilawadi | a thick grey-green twig, long leaves, three blooms of five petals that overlap like a pinwheel, white going to yellow at the heart, and a bud. `colour` | 141 by 167 |
| `orchid` | กล้วยไม้, kluai mai | strap leaves and an arching spray of six blooms: five petals pale at their rims, a darker lip with a yellow throat. `colour` | 121 by 156 |
| `hibiscus` | ชบา, chaba | one big flower of five broad red petals with the long column from its heart, pollen along it and five red tips; leaves and a bud in its calyx. `colour` | 84 by 160 |
| `bougainvillea` | เฟื่องฟ้า, fueang fa | a woody twig crowded with clusters of three papery magenta bracts round tiny white flowers. `colour` | 102 by 142 |
| `jasmine` | มะลิ, mali | thin stems with small dark leaves in pairs, small white flowers of rounded petals, and buds like white grains in a green cup | 87 by 111 |
| `marigold` | ดาวเรือง, dao rueang | two pompoms of many short ruffled petals, orange outside and lighter at the heart, over ferny leaves, and a bud. `colour` | 96 by 152 |
| `mango` | มะม่วง, mamuang | a kidney shape with a beak, green at the stem going to yellow and a blush of orange, lying, with a leaf | 110 by 41 |
| `durian` | ทุเรียน, thurian | a big oval in a coat of spikes, green going to brown, its face marked with small tents, a thick stem | 145 by 111 |
| `mangosteen` | มังคุด, mangkhut | a round fruit of deep purple with a cap of four green lobes round its stem and a rosette under it; beside it the lower half of one opened, white segments in the pink of the rind | 91 by 64 |
| `rambutan` | เงาะ, ngo | three red balls in soft hairs that turn green at the tips, on a twig with a leaf | 125 by 94 |
| `longan` | ลำไย, lamyai | the orchard crop of Lamphun and Chiang Mai: a bunch of small round fruits in thin brown skins hanging from a twig with two leaves, and one peeled, white, its black seed showing | 149 by 127 |
| `lychee` | ลิ้นจี่, linchi | a bunch of red fruits with bumpy skins on a twig with leaves, and one peeled | 149 by 122 |
| `papaya` | มะละกอ, malako | long, narrow at the stem, green going to orange with faint ridges; and one cut lengthwise, its orange flesh round a boat of black seeds | 166 by 60 |
| `coconut` | มะพร้าว, maphrao | a young coconut as the street sells it, the green husk trimmed to a peak of flat cuts with a pale cut on top | 85 by 101 |
| `pineapple` | สับปะรด, sapparot | a crown of stiff leaves on a body netted in diamonds, each with a dark eye, orange going to brown at its foot | 70 by 142 |
| `jackfruit` | ขนุน, khanun | a great oblong, green-yellow, all over small bumps, with a short thick stem | 159 by 112 |
| `dragonfruit` | แก้วมังกร, kaeo mangkon | an oval of magenta in a coat of scales, each a flap that turns green at its tip | 77 by 91 |
| `pomelo` | ส้มโอ, som o | a big round fruit of pale green-yellow with a nub at the top and the pores of its rind; beside it a segment peeled to its pink pulp | 132 by 100 |

`FLORA` is the table: each name with its painter, its `kind` (flower or fruit), its Thai name
(`thai`) and how that is said (`say`), so a page can write the name under the thing, as
`flora.html` does. A look has three names (`FLORA_KEYS`): `size`, `colour` (the flower's, for
the six marked above; the others have one colour) and `ground` (`false`: no shadow under it, for
one that does not stand on the ground, such as the hero film's wild orchids on the trunks of its
pond's trees, 2026-10-17; as `person()` reads the same name). `size: 1` is as large as the thing is beside
the cast at their own sizes. A name `flora()` does not know draws nothing and the kit warns, with
the nearest name. The shared pieces are `floraPaint` (the kit's `shape()` with a gradient as the
paint), `floraLeaf`, `floraBall`, `floraPetals` (petals round a heart, pale at the rim if told)
and `floraBunch` (stalks from one point to round fruits below, the lowest drawn last).

**A tree in flower or in fruit.** `floraTree(brush, x, base, size, name, seed, colour)` paints the
kit's `tree()` on a set's sheet, as `tree()` is painted, and hangs the named flower or fruit in its
boughs: eight at points spread over the canopy (the canopy of `tree()` is an ellipse 160 to each
side and 90 up and down, centred 300 above its foot), each by the thing's own hanging painter
(`hang` in `FLORA`), fruit at 0.55 of the tree's size and blossom at 0.75 so that it reads as
colour from across a set. A jackfruit grows on the trunk, so its three hang there. A papaya has a
tree of its own, `floraPapayaTree`: a slim straight trunk, grey-green and marked where leaves have
fallen, the fruit crowded under a crown of lobed leaves on long stalks. A coconut is on the kit's
`palm()` already and a pineapple grows on the ground, so neither has a tree, nor do the orchid,
hibiscus, jasmine and marigold: `FLORA_TREES` is the list, and a name not in it warns. The pen is
pointed at the sheet for the painting and put back after.

`flora.html` is the sheet, in two parts of six seconds: the twenty, large, each with its three
names; and at their own sizes an orchard, a mango tree in fruit, a papaya, a jackfruit on its trunk
and a ratchaphruek in flower, with a lady on the floor and the little girl at a mat of the market's
fruit. Measured (2026-10-13): all twenty take 10.4 ms to draw at size 1; `kit_check.py`:
`flora.html` draws, same 0 / 0, 18.3 ms a frame, arms 0, 0, 0.

**Not done:** nobody holds a flower or a fruit, picks one or eats one: a thing stands where it is
put. Each is seen from one side and has one arrangement. A tree in flower is the kit's one tree
with blossom hung in it, not the shape of that tree: a ratchaphruek's racemes hang below the
leaves of a tree that is not drawn weeping, and a thong kwao in flower should be bare. There is no
garland (the kit's `garland` is a dress piece), no offering tray, no lotus here (the kit has
`lotus` and `lotusClump`), no basket or stall, and no fruit cut open but the mangosteen, the
papaya and the pomelo. The flowers and fruits are not in the cartoon maker's palette. Judged from
stills only.

## The flowers and plants of Lanna (2026-10-25)

The owner (2026-10-25): "See if you can add some more plants, herbs and flowers unique to Northern
Thailand to the kit. Especially if they have significance in Lanna culture", and then "Spend a few
iterations making them as beautiful as possible." The kit's NotebookLM notebooks on Lanna women's hair,
material culture, household things, village farming, myths and history were asked what plants they
name and what each is for; the owner picked these sixteen from that list. They are in `flora.js`
with the rest, called the same way (`flora(name, x, y, look)`), and have a third kind beside flower
and fruit: `plant`, for the herbs and the useful plants (the cartoon maker marks them 🌿).

| `name` | Thai, and how it is said | What it is in Lanna, and what is drawn | Ink at size 1 |
|---|---|---|---|
| `ueang` | เอื้องผึ้ง, ueang phueng | the golden orchid (Dendrobium lindleyi) of the forests, which a woman tucks into her hair knot and a spirit medium into her headdress: four ribbed pseudobulbs with silver roots, a stiff leaf on each, and an arching spray of nine gold flowers (three narrow sepals, two broad petals, a round downy lip with an orange heart). It grows on trees: `ground: false` on a trunk | 165 by 139 |
| `sarapee` | สารภี, sarapee | (Mammea siamensis) worn in coiled hair as a scented devotional flower: a twig with long thick leaves crowded at its tips, and clusters of four-petalled white flowers with a ball of gold stamens on the bare wood below them | 162 by 189 |
| `sabannga` | สะบันงา, saban nga | ylang-ylang (Cananga odorata), offered at the temple and worn in the hair; the material-culture notebook says the hanging khom copies its shape: a branch arching over, its leaves hanging, three flowers of six long waving petals, yellow-green to gold with a maroon spot at the foot, from a green cup. `colour` (the gold) | 182 by 201 |
| `tahern` | ต๋าเหิน, ta hern | the white ginger lily (Hedychium coronarium, maha hong), a scented hair flower: a reed of a stem with long leaves to each side in turn, a cone of green bracts, and three flowers like white moths (two wings, a cleft lip, thin petals behind, a long stamen) | 136 by 267 |
| `kettawa` | เก็ดถะหวา, ket tha wa | the double gardenia (phut son), a white hair flower: a woody stem, glossy leaves in threes, two flowers of three rings of round cream petals, and a bud twisted shut | 115 by 163 |
| `dokkaew` | ดอกแก้ว, dok kaew | orange jessamine (Murraya paniculata): its leaves go under the posts of a new house, and its flower is a motif of the kong khao basket. Leaves of small glossy leaflets, two heads of five-petalled white stars, two red berries | 136 by 152 |
| `phayasuea` | นางพญาเสือโคร่ง, nang phaya suea khrong | the wild Himalayan cherry (Prunus cerasoides), pink on bare branches on Doi Ang Khang and Doi Inthanon in the cold month: a dark red-brown twig with pale marks across its bark, five-petalled pink flowers with a crimson eye, open, nodding and in bud. `colour` | 121 by 174 |
| `buatong` | บัวตอง, bua tong | the wild sunflower (Tithonia diversifolia) that covers the hills of Mae Hong Son from November to January (it came from Mexico): three stems, a head of notched gold rays round a domed orange heart, one turned aside, a bud in green bracts, lobed leaves | 119 by 196 |
| `teak` | สัก, sak | teak (Tectona grandis), the timber of the Lanna house and the sueng, the forests of Lampang and Phrae: a young stem, two pairs of huge leaves, and the spray of tiny cream flowers it holds above them in the rains | 182 by 253 |
| `sompoi` | ส้มป่อย, som poi | (Acacia concinna) the plant that drives ill luck away: its water, nam som poi, is sprinkled at blessings and rites of passage, and washes the hair. A thorny zigzag stem, feathery leaves, three dry brown pods, wrinkled and pinched between their seeds, and two pale balls of flower | 152 by 230 |
| `sugarcane` | อ้อย, oi | tied up beside banana trunks for the forest gate (sum pratu pa) of Yi Peng and the great sermon, and lashed round a ceremony's ground: three stalks, joint above joint with the waxy ring under each node, buds, a fountain of leaves at the top and dry leaves hanging low. `colour` for the stalks (`"#7a3048"` is red cane); it is as tall as it is, about 500, so draw it at 0.6 to stand among the others | 367 by 498 |
| `pho` | โพธิ์, pho | the bodhi (Ficus religiosa): a twig of heart-shaped leaves with long drip tips on long stalks, one young leaf bronze-pink. `colour` for the leaves: gold (`"#e3b341"`) is the golden bodhi of the tale of Tao Noi Ong Kham, which grew from the buried bones of the mother turtle at the city's gate | 206 by 203 |
| `miang` | เมี่ยง, miang | the tea of the hills (Camellia sinensis var. assamica), whose leaves the north steams, ferments and chews, and offers a guest: big glossy leaves with sawn edges, two pale young leaves and a silver bud at the tip, two white flowers with a boss of gold stamens | 123 by 176 |
| `makhwaen` | มะแขว่น, makhwaen | the pepper of the north (Zanthoxylum), whose seeds go into larb and nam phrik: a prickly grey twig, leaves of narrow leaflets on red stalks, and two clusters of small red fruits, some split to show the black seed | 168 by 148 |
| `hom` | ห้อม, hom | the indigo (Strobilanthes cusia) that dyes the mo hom shirts of Phrae: a jointed stem, dark blue-green leaves with sawn edges in pairs, a spike of curved lilac flowers | 119 by 206 |
| `phlu` | พลู หมาก, phlu, mak | the betel vine on a bamboo stake, its glossy heart-shaped leaves veined from the foot, and the areca nut beside it, two whole and one cut: chewed together, offered to a guest and put in the cones of flowers given at the temple | 149 by 188 |

**How they are drawn.** In the kit's manner, flat colour and gradients inside a line, with shared
pieces of their own: `floraBlade` (a leaf on a shaped outline: where it is widest, how sharp its tip,
sawn teeth, a bow, side veins and a gloss), `floraHeart` (a heart-shaped leaf with a drip tip, veins from
the rib or from the foot), `floraRoundPetalPath` and `floraPetalRing` (round petals, notched if told),
`floraCurve`, `floraPinnate` (a leaf of leaflets), `floraRibbon` (a long blade that droops) and
`floraSoft`. **`floraSoft` is the one rule that differs:** a small pale petal is inked with a lighter,
thinner line (the colour's ink taken part of the way back to the colour, at 0.6 of LINE, no heavy side),
because with the kit's full line a jasmine-sized white flower is more line than petal, and on a tree, at
0.75, it turned brown. Leaves, twigs and fruit keep the kit's line. They were drawn in scratch over the
unchanged kit and looked at large, four rounds, before they came into `flora.js`.

**Trees.** `floraTree()` hangs `ueang`, `sarapee`, `sabannga`, `dokkaew`, `teak` and `makhwaen` in the
kit's tree as it does the others. Two have trees of their own, as the papaya has: `pho` is
`floraPhoTree` (a fluted grey trunk on spreading roots, boughs reaching out wide, and a dome of 720
heart-shaped leaves lit from the upper left, the edge ones hanging; with `"#e3b341"` it is the golden
bodhi, trunk and all, and it glitters), about 470 tall and 520 across at size 1; `phayasuea` is
`floraSueaTree` (no leaves: a dark trunk that forks five times into fine twigs, a haze of pink and on
every twig a cloud of blossom, open, nodding and in bud), about 450 tall.

`flora.html` has two parts more, so four of six seconds: the sixteen large with their names, and a
northern garden at their own sizes (the golden bodhi with the orchid on its trunk, a forest gate of
banana trunks with green and red sugarcane, a sarapee and the wild cherry in flower, a lady on a mat
with betel and areca and som poi, the girl among bua tong, ta hern and hom). `living_scenes.html` has
the nine flowers' real sizes in `FLOWER_SIZES`. Measured (2026-10-25): all sixteen take 4.6 ms to draw
at size 1.

**Not done:** the five flowers worn in the hair are not on the kit's hair (`headKnotFlowers` has the
ueang spray of its own; sarapee, saban nga, ta hern and ket tha wa are not there). The healing herbs the
farming notebook names (ya nuat maeo, khilek, phaya rai bai, sap suea, makrut) are not drawn; nor is
the bodhi's props (mai kham), which a Lanna temple's bodhi stands on at Songkran. A thong kwao tree is
still the kit's green tree, not bare like the wild cherry's. Judged from stills only.

## Pieces of the north (2026-10-15)

The owner asked for research on "new items specific to Lanna Thai to add to the kit as sprites",
then: "Start with the inanimate objects on the list." The list, ranked, is in the owner's
`Videos/lanna_sash/lanna_sprite_candidates.html` (ox cart, string band, hong, kalae, water jar,
sand pagodas, lamps and fireflies, samlor and red truck, the great drum, small creatures, the
harvest, krathong; Poy Sang Long and spirit things kept out). The inanimate ones are **`pieces.js`**,
loaded after the kit, with its sheet **`pieces.html`**; each drawn from Wikimedia Commons
photographs under free licences (kept in scratch with their credits; nothing copied, only what they
show):

- **`hong(brush, x, y, size, colour)`**: the hamsa that crowns the tall tung poles: a swan's body,
  the neck curved up and back, a crest and a pointed beak, one wing swept up behind in four rounded
  feathers, a tail curling up in a flame scroll; gold. **`tung(brush, x, base, t, true)`** sets one
  on the pole (a fifth argument; every old call draws as before). Reference: the gilded hang hong of
  Wat Chet Yot (CC BY-SA 3.0).
- **`namton(brush, x, base, size)`**: the water jar at the gate: a round brown clay pot with a lid
  on a stand of four posts under a little roof, a coconut dipper on a hook. No Commons photograph
  was found under the Thai names (น้ำต้น, ฮ้านน้ำ); drawn from knowledge of the custom, to be checked
  against a photograph when one turns up.
- **`chediSai(brush, x, base, size, t, seed)`**: a Songkran sand pagoda, a smoothed cone of pale
  sand with five paper flags on sticks pushed in, each a bright triangle that flutters. Reference:
  sand stupas at Wat Pho (CC BY 4.0): the same object, the flags the same.
- **`pratheep(brush, x, y, size, t, seed)`** and **`pratheepRow(brush, x, y, count, gap, size, t)`**:
  the clay lamp of Yi Peng, a shallow terracotta dish, a flame that leans and flickers, a warm glow
  on the ground. Reference: Wat Phan Tao at Yi Peng (CC BY-SA 4.0), rows of them on the ground and
  on the water's edge.
- **`krathong(brush, x, y, size, t, afloat)`**: a slice of banana trunk, a ring of twelve folded
  leaf points, three marigolds and an orchid, a candle with a flickering flame, three incense
  sticks; afloat it bobs and tilts. Reference: a krathong on white (CC0).
- The kalae on the kit's house was already there (two crossed boards): each board now ends in a
  carved tip that curls outward, as a kalae's does (`house()`, every house draws the tips).
- **`oxcart(brush, x, base, size, turn, facing, yoke)`**: the kwian, the wooden cart of the north:
  two tall twelve-spoked wheels with an iron tyre and a dark hub (the far one a little behind the
  near one), the bed on its axle beam, a slatted rail each side that ends in a horn curving up and
  out at the back and the front, and a shaft forward to `yoke`, a point [x, y] on the page (the
  withers of the beast); without a yoke the shaft goes forward on its own. `turn` is how far the
  wheels have rolled, in radians: the ground covered divided by the wheel's radius, 62 x size. The
  axle is over (x, base) and the wheels' feet on base. Draw it before the beast so the beast stands
  over the shaft. Proportions from a weathered teak kwian (CC BY-SA 2.0, Dennis G. Jarvis) and a
  kwian at Wat Phra Sing, Chiang Rai (CC BY-SA 4.0, Jakub Hałun): the wheel's top is about the ox's
  belly, the rails' horns stand above its back. On `pieces.html` the kit's buffalo pulls it:
  `amble("buffalo", ...)` gives the place and the step, the yoke is the withers at (150, -310) in
  the buffalo's own scale (1.25 x its size), the axle 460 behind, the turn is the x covered / 81.
- **`drumCart(brush, x, base, size, facing)`**: the great drum of a temple on its cart, as the
  drum carts of Chiang Rai are: a long barrel drum laced with cord, its head a skin in a ring of
  pegs toward the way it faces, three small drums stacked at the head, two tall wheels with
  gold-painted spokes, the axle beam under the drum with a gold finial ahead of the head, and from
  the tail a long pole back to a small wheel, a handle bar above it. Reference: the drum cart of
  Wat Hiranyawat, Chiang Rai (CC0, Iudexvivorum).

In the maker: `namton` (🏺 น้ำต้น), `tung` (🎏 ตุง, crowned) and `drumcart` (🥁 กลองหลวง) are set
pieces (painted once a scene); `chedisai` (🏖️ เจดีย์ทราย), `pratheep` (🕯️ ผางประทีป, a row of five
about its point), `krathong` (🪷 กระทง, afloat, on a course) and `oxcart` (🐃 เกวียน) are things,
drawn each frame so their flags and flames move; the rules prompt names them. The maker's `oxcart`
is the kit's buffalo (beasts.js) pulling the cart: its point is under the buffalo, the cart's axle
is 288 x scale behind it and the yoke on the withers, the buffalo's step and the wheels' turn are
both read from the ground covered (P[6]) as the mom's step is, and the cart is drawn first.

In the hero film `sash.html` (owner, 2026-10-15: "Add some of the new object types to the sash for
the hero video"): the village set gains the water jar beside the house's ladder and a crowned tung
beyond it (painted once, in `paintSet`); in the rice fields a buffalo (size 0.55) pulls the ox cart
(size 1.3) from the right along the back of the wide bund at y 872, through the rain and on under
the clearing sky, `amble()` placing it and the yoke on its withers, drawn before the women so they
pass in front; at the night of dancing the great drum on its cart stands at the left beside the
drummer, its head toward him. (A row of thirteen Yi Peng lamps along the front edge went in and came
out the same day: the owner, "a bunch of extra sprites at the bottom".) Not
done: the Commons search for the kalae found nothing (the Thai name matches Calais); the band, the
vehicles, the creatures and the harvest tools remain on the list.

## Pieces for a tale: a cave's mouth, a poor family's hut

What the film of the creature with four ears and five eyes needed and the kit did not draw (2026-10-19).
Its sheet is `tale_pieces.html`.

| Piece | What it is | Rules |
|---|---|---|
| `caveMouth(brush, x, y, size, look)`, `highlands.js` | the cave of a tale in a mountain's side, (x, y) its foot's middle; 250 wide and 135 high at size 1 | a dark arched opening, darkest deep in; boulders round it lit from the upper left, the right jamb in its own shade; a low lintel of rock over it, a ledge of stone before it; moss on the stones; ferns hanging over the top that stir with `look.t`. `look.rock`, `look.dark`; `look.tint` [colour, amount] blends every colour of it toward one light, as a set painted by day and tinted is |
| `firewood(brush, x, y, size, look)`, `pieces.js` | a bundle of firewood (หลัว), as a child carries it home; (x, y) its middle, 120 long at size 1 | `look.count` sticks (7) of a length, one a little longer, their cut ends pale, bound round in two places with a vine; `look.turn` turns it; `look.loose` lays the sticks apart on the ground, gathered but not bound. Carried on the shoulder it is drawn before the person, behind the head, its ends out before and behind, the near hand closed on its front end (the film measures the shoulder first: `maengMeasure()` in `maeng/sets.js`) |
| `tub(brush, x, base, size, look)`, `pieces.js` | the tub (ตูบ), the small hut of a poor family of the north, as the tales have it; 250 wide and 225 high at size 1 | four short stilts and a floor beam; walls of woven bamboo (fa khat tae), a plain weave of strips across, one way and the other; a dark doorway at the right with a short bamboo ladder; a steep roof of grass thatch in rows of straw, ragged at the eaves. `look.glow` (0 to 1) lights the doorway and the ground before it, a lamp at night; `look.tint` as the cave's |
| `kok(brush, x, base, wide, size, look)`, `pieces.js` | a pen (คอก) of bamboo for an animal, its front's middle on (x, base), `wide` across, two-thirds as deep; 110 high at size 1 | posts at the corners and along the sides, two rails of split bamboo round it, bound at each post. In two parts so that what is kept in it stands inside: `look.part` "back" (before the animal) and "front" (after it); `look.tint` |
| `snare(brush, x, base, size, look)`, `pieces.js` | a snare: a noose of rope on a bent sapling | set (the sapling bent, the noose open on the ground) or `look.sprung` (the sapling up, the noose drawn tight); `look.caught`: a point of the scene the noose holds (a paw), the rope running to it; it shivers with `look.t` while something pulls |
| `campfire(brush, x, base, size, t, look)`, `ember(brush, x, y, size, t)`, `emberFlight(brush, from, to, u, size, high, t)`, `pieces.js` | a yard's fire, and its coals | a ring of stones, sticks crossed and charred at their ends, flames that leap and flicker with `t`, coals red under them, a warm light round it (`look.light`; `look.low` burns it down to coals); 150 wide, 170 high with its flames. An ember glows and sparks; `emberFlight` carries one from `from` to `to` on an arc `high` above them, `u` of the way (0 to 1) |
| `goldNugget(brush, x, y, size, t, look)`, `pieces.js` | a nugget of gold | lumpy, lit from above, a glint that comes and goes with `t` (`look.shine`, `look.seed` so that two do not glint as one) |
| `hoKham(brush, x, base, size, look)`, `hoKhamFloor()`, `hoKhamDais()`, `pieces.js` | a hall of a Lanna palace (หอคำ), open at the front; 800 wide, 700 high at size 1 | a white plinth with a stair up its middle; a floor of teak; posts of dark red teak banded with gold; behind, a red wall stencilled with gold (lai kham) and a gilded dais; a roof in two tiers of dark shingles, their eaves trimmed with gold flames, a golden gable with rays, and a golden finial (cho fa) curling up at each end of the ridge. In two parts, `look.part` "back" and "front", so that whoever sits on the dais is inside; `hoKhamFloor(base, size)` and `hoKhamDais(base, size)` give where the floor and the dais's top are |
| `gong(brush, x, base, size, look)`, `gongAt()`, `pieces.js` | a gong (ฆ้อง) on its stand; 110 wide, 170 high at size 1 | two posts and a beam of wood, the bronze gong hanging from it by a cord, a raised boss in its middle; `look.struck` (seconds since) swings it a little and sends out rings of sound for a second and a half; `gongAt()` is the boss, where a mallet strikes |
| `linKham(brush, ground, built, look)`, `pieces.js` | a trough of gold (ลินคำ) on forked posts, as a house's rainwater runs along one to a jar | a half-pipe of gold, lit along its upper lip, `look.high` (46) above the ground on forked posts, one every `look.gap` (80); it runs along `ground`, a row of points of the scene, and is drawn only `built` of the way along it (0 to 1), so a film grows it; `look.sag` [where, how far] bends it down in the middle (up, below 0); `look.size`, `look.tint` |
| `horse(x, y, look)`, `beasts.js` | the small pack horse of the Yunnan caravans (ม้าต่าง), as the Haw traders led them into the north; about 330 high at the withers at size 1 | short and sturdy, a deep chest, a thick neck, a big head carried low; a short dark mane that stands up in a ragged band, a long dark tail; slim legs darker below the knee, on single hooves. It walks as the other beasts do (`step`, `amble("horse", ...)`, `GAITS.horse`) and feels as they do (`feel`: its eye, its ears, the carriage of its head, its tail). `look.pack`: a pack saddle (two frames of crossed wood) with a load lashed on each side, true or the colour of the load's cloth; `look.mane`: its mane's colour. Gives back `{seat, head, nose, load}`: the nose is where a halter's rope ties (`maengLead(..., "horse")` in `maeng/sets.js` leads one) |

The kit's house (`house()`) is a fine teak house and its huts (`bdHut`, `fieldHut`) are open shelters of the
fields: neither is a poor family's home. A cave at a film's size sits on the forest like a hut until the
forest grows over it: the film draws a few of the forest's own crowns (`crown()`, the slope's sizes, its
haze and the light) behind the cave's top and before its foot (the sheet's second cave), and its lintel is
low, a face of rock, not a dome.

`kit_check.py tale_pieces.html maeng/s01.html`: 2 pages, 0 failures; the sheet draws, same 0 / 0, 9.5 ms a
frame.

## The things of a Lanna home, and the things pass (2026-10-19)

The owner: "Use notebooklm to make a notebook about Lanna house hold items. See what you should add to the kit from
there and then add to the decorate process for house hold items and location decoration like for the palace scene."
The notebook ("Lanna household items", 22 sources picked by hand from two deep sweeps, each loaded and of real
length) answered from its sources only, and said which of its sources were not Lanna: a thesis on the Phu Tai of the
north-east (their stove and wok are not the north's) and a page on the Bangkok court's regalia. What the kit did not
draw went into pieces.js, each from what the sources say of it:

| Piece | What it is |
|---|---|
| `huad(brush, x, base, size, t, look)` | the sticky-rice steamer: a cone of woven bamboo in the mouth of a round clay pot on three hearth stones, a cloth over it; `look.fire` lights a fire under it and its steam rises |
| `kongKhao(brush, x, base, size, look)` | the kong khao, the lidded basket that keeps steamed rice: a round body of fine weave on a squared foot, a domed lid, a cord |
| `krabung(brush, x, base, size, look)` | an open basket, round, wider at its mouth, its rim bound |
| `mortar(brush, x, base, size, look)` | the wooden mortar kept under the house and its long pestle, leaning, or pounding (`look.pound`, a second) |
| `taLaew(brush, x, base, size, look)` | the ta laew, a star of woven bamboo on a post that guards a yard: pointed petals of strip round a small open lattice (`look.points` 6 or 8). A star of two crossed triangles is a different sign, and was drawn first and taken out |
| `hoKham(..., {pediment: "peacock"})` | the palace hall's gable carved with a peacock among leaf scrolls, as the old Ho Kham's pediment at Wat Phan Tao has it (the dog under its peacock is one ruler's own, and is left out) |

**The things pass** comes before the life in decorating a scene: `dress(t, things, layer, tint)` in decorate.js
draws a place's things from a list, `[{name, kind, x, base, size, look, layer, from, to}, ...]`, the kinds being the
kit's painters (THING_KINDS). What a place has in every scene is listed once, with its set: the film of the creature
keeps the yard's (a mortar under the hut, a basket at the ladder, a ta laew beside the path), the hut's inside (the
hearth and its huad, one rice basket, one open basket) and the palace's (`maengPalace()`: the peacock gable, two
lanterns of gold-patterned paper hung from its eaves, as before a ruler's hall). A very poor family has few things:
what is not there tells the story too.

## The band, more lanterns, the farmstead and the red truck (2026-10-16)

The owner: "Do some research using notebooklm and add some items that are specific to Lanna culture to
the framework." A NotebookLM notebook, "Lanna material culture: new items for the Lanna cartoon kit"
(38 sources), was filled from eight Wikipedia pages and four fast web researches (everyday things and
the granary; the decorations of Yi Peng and the kinds of lantern; the instruments of the north; the
Tai Yai dances and the guardian lions), with the broken and the off-topic sources taken out. Its answer
listed what the north has and the kit did not; asked which to build, the owner chose all four groups
offered: the string band, lanterns that move, the farmstead, and the rot daeng. Each was then asked of
the notebook as a drawing needs it (how the instrument is held, which hand does what, what the parts
are), and its shape read from Wikimedia Commons photographs under free licences, kept in scratch with
their credits; nothing copied. Two of the notebook's answers were checked against the source's own
words: the tung sai mu as "multi-tiered clusters of small triangular flags attached to a single stick
... five or seven layers" is Chang Puak Magazine's wording, kept; the khom thue "hanging from a stick"
was not: the source says a handheld lantern has "a handle underneath, quite like a giant candle", and
it is drawn so.

| What | File and call | What it does, and what it was read from |
|---|---|---|
| The salo | `band.js`: `salo(x, y, size, angle)`, `saloBow()` | a coconut body with a wooden plate, a turned spike, a long dark neck, two great pegs, a cord binding the strings, a turned spire; 214 long at size 1. The bow is apart from the strings, its hair outside them. Jiranee119's photograph (CC BY-SA 4.0) and Purinee Donchai's drawing of its ten parts (CC0) |
| The sueng | `sueng()`, `suengPick()` | a round body with a carved point under it, a flower of red and gold round the hole, a bridge, nine bamboo frets closer as they climb, four strings in two pairs, a flat carved head with four pegs; 190 long. The Chiang Mai artisan's sueng (Leopoldoghost, CC BY-SA 4.0), a wall of them (CC BY 2.0) |
| The pi chum | `piChum()` | a straight pipe of bamboo, two nodes, the brass of the reed near the top, seven finger holes; 126 long, the middle of its five sizes. No photograph of one was found; the hold is the Laplae band's straight pipe (CC BY-SA 3.0): down and forward from the mouth, both hands on it |
| The phin phia | `phinPhia(x, y, size, angle, flip)` | a long stick, a half coconut on a short post a quarter of the way from its two pegs, the far end bent into a curl capped in metal. The Metropolitan Museum's of the 19th century (CC0). `flip` hangs the coconut on the other side of the stick |
| A player | `musician(x, y, kind, look, late)` | below |
| The khom phat | `khom.js`: `khomPhat(x, y, look)` | a cylinder of white paper, a red band with gold flowers above, a band and a fringe of cut paper below, the posts of its frame through the paper, a wheel of six vanes on top; inside, six figures cut from black paper (an elephant, a horse and rider, a deer, a carrier with two baskets on a pole, a buffalo, a dancer) go round with the vanes, `0.45 * spin` radians a second, and their shadows show on the front half of the paper, squeezed toward its edges and fading there, black when it is lit and faint by day. Village figures, not the Jataka of the temple's lanterns. `spin` is given, not taken from `lit`: a turn worked out from a light that comes on during a film would jump |
| The khom thue | `khomThue(x, y, look)` | a small lantern of six sides on a handle, standing in a gold cup with paper tassels round it; (x, y) is where a hand holds the handle, and it is drawn after the person so the handle goes up through the fist (`person()` gives back `joints.handA`). Carried along, `lean` lets its top trail the walk |
| The star and the lotus | `khomDao(x, y, look)`, `khomBua(x, y, look)` | a star of five points, each point two faces lit apart, a thickness behind, a tail from each lower point; a lotus of seven petals in three rows, open, on three strings, a tail under it. Both swing, and glow when `lit`. No photograph found; drawn from Polyglot Petra's list of shapes |
| The sawian | `pieces.js`: `sawian(brush, x, base, size)` | a tall round basket, its weave seen under a coat of dung and resin, a bound rim; the CMU Lanna Traditional House Museum's words |
| The granary | `longKhao(brush, x, base, size, walls)` | a small house of timber on six heavy posts (three seen, three set in behind), its floor 122 up, a boarded gable and a steep roof of shingles past the walls, a ladder of bamboo against it. Open, as the museum's is, with two sawian on its floor; with `walls`, boards that lean out a little toward the eaves (a granary photographed by มะเดื่อ แสลงหลวง, CC BY 3.0). The house is the scale: its floor is at 110 |
| The cluster tung | `tungSaiMu(brush, x, base, size, t, seed, tiers)` | a stick 170 tall, five or seven tiers of small flags of every colour, widest at the bottom, each flag fluttering on its own; planted in a `chediSai` on the sheet |
| The web tung | `tungYai(brush, x, base, size, t, colour)` | the kit's tung pole, and hanging from it five cells of thread woven as a web (spokes from the corners, three diamonds closing on the middle) between six strips of bamboo, a frill and a flower at each strip's ends, a tassel of thread at its foot; it sways, more toward the foot. Red thread unless given (white shows only at night) |
| The red truck | `rotDaeng(brush, x, base, size, turn, facing, inside)` | the Chiang Mai red cars photographed by Patiparn.Nice2002bkk (CC BY-SA 4.0): a pickup's cab, a roof over the bed that runs on over the cab and rises at the front in a peak with a grille, a rack on top, posts and windows over a red panel, a pale line along the side, a step and a rail at the back, a yellow plate. 650 long, 344 to the peak. The wheels turn with `turn` (the ground covered over 46 x size) and the body rides 2 to 3 on its springs as they turn |

**A player: the instrument is worn, the hands reach.** `musician()` seats a person cross-legged
(`floor: "cross"`) and plays on the beat: the salo's bow out on one beat and in on the next while the
fiddle tilts to bring one string or the other to it; the sueng plucked twice a beat; the pi chum
nodding as a finger lifts off a hole; the phin phia pressed to the chest and eased off. Three things
make the hands land on the instrument:

- The instrument is the look's `worn` painter, which the kit calls after the body and the head and
  before the arms, with the pen set back to the scene's own frame (as `sabaiWorn()` does). The arms and
  the hands are drawn over it.
- Each wrist goes to a point on the instrument by `reachA` and `reachB`. The kit works out the wrists
  after it calls `worn`, so the instrument cannot be placed where the hands came to; it is placed where
  they will come to, which works because a reach within the arm's length is touched exactly.
- Where they come to was measured, not guessed: `person()` with `floor: "cross"` at size 1 looking right
  gives its shoulders at (35, -131) near and (-31, -131) far, its chin at (2, -150), its crown at
  (3, -241), and an arm 98 from shoulder to wrist; the numbers scale with `size` and mirror with
  `face`. Every hold in `bandHold()` keeps each wrist within 97 of its shoulder and further than 30 from
  it (nearer than about 26 the forearm would fold past 150 degrees, which `arms_check.py` fails).

The musician also takes a stick and a parasol out of the hands (the `elder` of the cast carries a
stick, which first ran from the piper's hand to the floor), and the phin phia's player has no shirt and
no cloth over the shoulder, as it is played on the bare chest.

**The riders.** `pieces.js` draws on a brush and calls nothing of the people. `rotDaeng()` takes an
`inside` function instead: it paints the inside (the far wall and its bench), gives `inside` the four
seats of the far bench in the caller's own frame, then paints the near side, the posts, the roof and
the wheels over them. People seated there with `floor: "cross"`, `twist: 1` and size 0.66 x the truck's
show their heads and shoulders in the windows; the side hides their legs and the roof clears the
tallest bun. The near bench's people would show their backs, which the kit cannot draw: they are left
out.

**Traps met on the way.**

- A path is not part of what `save()` keeps. The sawian clipped its weave to its outline, restored,
  and stroked "the outline": the pen still held the weave's lines, which were drawn again unclipped,
  a hundred wide each side of every basket. The outline is a function now, made again for the line.
- `inside()` was first called with the truck's own scale and translation still on the pen: the riders
  were drawn far off the sheet. The truck's frame is taken off before it is called and put back after.
- The salo's bow was first laid pointing away from the strings, and its bowing hand's widest stroke
  went 105 from the shoulder, past the arm's reach. A bow held by the far hand points across the
  fiddle; the stroke is 24 wide.
- Riders at 0.72 of the truck first put a bun through the roof.

**The checks.** `kit_check.py band.html khom_kinds.html farmstead.html khom.html pieces.html sabai.html`:
6 pages, 0 failures (band 20.7 ms a frame, khom_kinds 31.7, farmstead 13.2; arms 0, 0, 0 on all six; same
1 / 0 at worst); no top-level name in two script files; no warning. `kit_check.py sash.html --quick`:
draws, same 0 / 0, the 17 lines each inside one scene. The cartoon maker, which loads `khom.js` and
`pieces.js`, loads with every function there and no warning.

**In the maker (owner, same day: "Add them to the palette").** Thirteen buttons: the things 🎻 สะล้อ,
🪕 ซึง, 🎵 ปี่จุม, 🥥 พิณเปี๊ยะ (each a player of the cast sitting cross-legged: the fellow, the farmer,
the elder, the fellow with no shirt; the colours are the player's), 🎠 โคมผัด, ⭐ โคมดาว, 🏵️ โคมบัว
(they hang as the khom does, with its candle switch; the khom phat turns only while lit), 🚶‍♀️ โคมถือ
(a girl who walks her course holding a khom thue up), 🎊 ตุงไส้หมู, 🕸️ ตุงใย (the thread's colour can
be picked) and 🛻 รถแดง (1.1 times the kit's truck, so it stands taller than the people who ride it,
with a girl, a fellow and a grandmother on its far bench); the set pieces 🛖 หลองข้าว and 🧺 เสวียน.
The candle switch belongs to a list now, `CANDLES`, not to the name `khom`. Two things in the page
were mended on the way: `thingCode()` made a thing's code by replacing every capital P with its
place (`p3`), which would have turned `khomPhat` into `khomp3hat`; it replaces only `P[` now, and the
code it writes for every thing that was there before is the same to the character (checked against
the page at HEAD). And the exported page did not load `pieces.js`, which the water jar, the ox cart
and the rest of the pieces of the north need: an exported film with one of them stopped with an
error. It loads `pieces.js` and `band.js` now. Checked in Chrome with the real mouse: each of the
thirteen buttons dragged onto the stage adds its item; the four lanterns show the candle switch; a
film of all thirteen at night taken as a model's JSON draws at three seconds with no error and no
warning; its exported page, put beside the kit, draws with neither: 26 checks, all held.

**Not done.** The pi chum, the khom phat, the star
and lotus lanterns and the two tung are drawn from words, with no photograph: each is to be checked
against one. The players only sit; the salo's tilt and the phin phia's press are small, and the
fingers lift on a beat, not on the notes of a tune; nobody plays the films' songs yet. The khom phat's
figures are seen only on the front half of the paper (the back half's shadows would show through
faintly); it cannot be raised and lowered on its pulley (khom lo). The truck has no curtains and no
one on its back step; its riders sit only on the far bench. The granary's walls are plain boards.

## The spinning lantern (2026-10-16)

The owner asked first for a scene of its own: "make a scene like the opening scene but with the
spinning lantern. Start out with a close up on a figure of light the same shape as one of the women
as if it were being cast by the lantern. Then it should start to move as if the lantern were starting
to spin and new shapes of light should appear. Then pull out to reveal it is a lantern and there are
children and people celebrating." It was made (14 s before the dance, the film 93 s), and on seeing
it the owner asked: "Take the spinning lantern and add it to the final scene and remove the scene
with the close up of the lantern. Just add one and a few children looking at it so they are on the
left side of the screen", and "Opposite the band". So `sash.html` is 79 s again, and the khom phat
hangs at the left of the night of dancing; what the scene made for it stays in the kit.

| What it is | In the code | Numbers |
|---|---|---|
| Figures of light | `khomPhat`'s `light: true` (`khom.js`): the frame inside is a dark drum with the figures cut out of it, so the paper is dim and each figure glows. Each figure is drawn whole on `KHOM_LAYER` (a canvas the size of the sheet, on the CPU, as `WAI_LAYER` is), coloured with `source-in` in the candle's colour, then drawn onto the paper, faded at the side of the drum, with a glow (`shadowBlur` in step with the figure's size on the sheet). Only the paper's box on the sheet is cleared, coloured and copied | paper `#4a3524` to `#8a5c34` with the flicker; light `#ffe6a8` to `#fff8e4`; glow 6 × the sheet's scale |
| The film's own figures | `khomPhat`'s `figures`: a list of functions, each drawing one figure standing on (0, 0) and facing right; the black-paper cut-outs of `KHOM_CUTOUTS` unless a film gives its own. The film's `PHAT_FIGURES`: the woman of the cloth (`WOMAN`), an elephant, a child and a dancer, a quarter turn apart, scaled by `PHAT_FIGURE`, walking as the frame turns (`phatWalk`, set before the lantern is drawn) | 0.22 of their size; the frame turns 0.45 a second, khomPhat's own spin |
| No shadow on the ground | the look key `ground: false`, read by `person()` (both its shadows on the ground) and by `elephant()` (`BEAST_KEYS`); `looks.html` has a figure for it. A cut-out is only its shape: the soft shadow, a fifth as dark as ink, came out as a faint oval of light under each figure | 85 look keys |
| A frame the film turns | `khomPhat`'s `turn`: the frame's angle, set by the film, for one that starts still and gathers speed. The scene that was removed used it; the dance does not | |
| At the night of dancing | `spinningLantern()`, called in `sceneDance` before the great drum: the khom phat lit, its figures of light, on an arm from the lantern string's left pole (x 60), opposite the band; three children behind the drum, a girl, a boy and a girl in yellow, their eyes on it in wonder (`at`, `wonder`), the girls reaching up to it (`reachA`), the boy pointing (`fingersA` [0, 1, 1, 1, 0.8]), drawn last so his hand shows | tied at (145, 360), size 1.1; the children at x 55, 140 and 235 |
| Their arms come down | (owner, 2026-10-17: "In the end scene have the kids put their arms down after a few seconds") `spinningLantern(t)` takes the scene's second: from 3 s to 4 s each arm comes down from the lantern to beside the hip, and the boy's pointing finger loosens to the kit's `REST`. Sent straight from up to down (`reachA` mixed), a hand passed over the boy's chin and the mouth of the girl in yellow, and came within a third of an arm of its own shoulder, where the elbow has no side to bend to: one flip at 73.63 s. A sideways bow on that path still flipped. So each girl's hand turns round her shoulder (`child()`: by her right, the girl at the left; by her left, the girl in yellow), the distance dipping to 60 on the sheet, and goes behind the boy, who is drawn last. Swung so, his hand went over the mouth of the girl in yellow, who stands within an arm of him; his wrist goes by a course instead (`BOY_DOWN`, through motion.js's `where()`): up through the gap beside his face, out under her chin at his shoulder's height, and down | no flips (arms_check, 72 to 76 s); in the film's pixels, a hand is never nearer its own face's middle than 90 (the boy's, at 3.1 s, where his pointing pose already held it), nor nearer than 111 to its shoulder; the boy's hand never nearer her face than 123 (74 when swung) |
| Their heads further back | (owner, 2026-10-17: "tilt the girls heads back just a bit so they are looking at the lantern above them more clearly") the girls take `girlGaze`, the children's `gaze` with `tilt: -0.24`; the boy keeps `-0.12`. `tilt` is a roll about the head's middle, so on their three-quarter faces it lifts each face toward the lantern, which hangs between them, more than it nods the head back | `tilt` −0.12 → −0.24 rad (about 7° → 14°) |
| Tried for the children | the kit's `child` (as tall as the drummer); the two girls turned to profile toward the lantern (`turn: -0.8`; their faces met over the boy's); a head tilted back (`tilt`: a roll about the head's middle, which a three-quarter face hardly shows). Eyes alone (`at`) move at most 4 pixels; raised arms are what reads at this size, and a child's arm reaches its forehead | |
| Tried for the scene that was removed | six figures, a sixth of a turn apart (three showed at once in the close-up); the figures faded with `globalAlpha` on one shared layer (a figure drawn at a part of its strength shows its own overlaps, and its insides showed through as a ghost); the layer on the GPU (it changed how the sheet drew every later frame, as `WAI_LAYER` had) | |
| Words | the scene's two lines in Kam Mueang went with it: "ฮ้อนเทียน ยะหื้อรูปภาพหมุนวนๆ เจ้า" (the candle's heat turns it, and the pictures go round and round) and "นี่คือโคมพัด โคมหมุนงานยี่เป็งเจ้า" (this is a khom phat, a spinning lantern for Yi Peng), from the notebooks "Lanna material culture" and the Kam Mueang one; their voice stays in `spoken_km/` for a film that wants them. The dance keeps its two lines | |

## Grass tufts (2026-10-21)

`grassTuft(brush, x, y, size, look)` (pieces.js): a tuft of blades from one root on the ground, leaning out from the
middle, swaying a little with `look.t`; `look.eaten` (0 to 1) crops it short, as a grazing buffalo leaves it;
`look.tint` as the set's pieces take it. About 50 tall at size 1 (owner, 2026-10-21: "Add some grass tufts"). Scene 3 of
the tale lays six on the meadow and one under the buffalo's muzzle that it crops through the scene.

## Chang Ngu's kangsadan, and the bael (2026-10-22)

Two things of the tale of Chang Ngu (its creatures are in creatures.md), each picked by the owner from three candidates.

| Piece | What it is | Rules |
|---|---|---|
| `kangsadan(brush, x, base, size, look)`, `kangsadanAt()`, `pieces.js` | the golden kangsadan (กังสดาล; the tale's ปาน) on its frame, the plain one of three; 180 wide, 214 high at size 1 | "รูปทรงกลมแบน ไม่มีปุ่ม ต่างจากฆ้องที่มีปุ่ม": a flat round plate of gold, no boss (the gong's has one), hung by a red cord through a hole at its top from the beam of a wooden frame, three rings engraved on its face and a gleam; `look.struck` (seconds since) swings it and sends out quick thin rings of light, higher than the gong's. Beaten from a hundred kahapana of gold, it rang "ting ting" on the Mekong's bank until the white elephant came up. The temple gongs of Chiang Mai looked at on Commons are all bossed: only their frames and cords were taken. `kangsadanAt()` is the middle of the plate, where a beater strikes. On `pieces.html` |
| `flora("bael", x, y, look)`, `floraBael()`, `floraBaelLeaves()`, `flora.js` | the bael (มะตูม, matum), on its twig, as the owner picked; 52 across at size 1; it hangs on `floraTree(..., "bael")` | a round fruit in a hard shell, grey-green going to yellow (`ripe`), speckled, a short stalk; its leaves in threes, the middle one longest (two Commons photographs, CC0 and CC BY-SA 3.0). The measure of the Khom's tribute in the tale: gold "the size of four bael fruits" a year. On `flora.html` (seven fruits to a row now) |

The tale's soldiers (Tai and the Khom Dam, told apart by dress only), their spears and the Khom's pointed cap are in
figures.md; the cartoon maker's palette for all of these is in the maker's notes.

## Chiang Saen and the things of Chang Ngu (2026-10-23)

`chiangsaen.js` (sheet `chiangsaen.html`): what the second tale, Chang Ngu (`changngu/`), needs that the kit did not
draw. Each was drawn as two or three candidates and picked by the owner, and each is drawn from what is known of the
real thing (owner, 2026-10-23: "In reference to things like walls, pots, etc. try to be accurate"); every function's
comment names its source.

- **The city wall** (`cityWall`): Chiang Saen's fortifications as Hans Penth gathers them ("Again: the fortifications
  of Chiang San", JSS 63.2, 1975, from Hallett 1884 and Hosseus 1904): a low outer rampart of earth, the moat, then
  the high rampart, its outer face earth behind a teak palisade, its top a crenellated parapet of brick; no wall along
  the river, which was the east moat. Nobody knows what its gates looked like, so the gate claims the least: a passage
  lined with brick under the parapet, two teak doors, a timber bridge.
- **The Mae Khong in the dry season**: `sandbar`, `khraiNam` (Homonoia riparia, the shrub that covers the larger
  sandbanks), `riverReeds`, and the birds recorded on the Chiang Saen stretch (thaibirding.com; BirdLife's factsheet
  for the Mekong channel near Pakchom): `pratincole` (sits close on the sand; `fly: true` beats its wings),
  `riverLapwing`, `ringedPlover` (`peck` 0 to 1), `redAvadavat` (drinks at the margin), `spotbill` (swims and bobs).
  Their shared shape, `csBird()`, was drawn again on 2026-10-25 (owner: "Upgrade the quality of the birds ... make
  sure the birds have eyes"; the pick C of three): a teardrop body, a folded wing with pale feather edges and dark
  primaries past the tail, legs bent back at the ankle with three toes, a shadow on the sand, long pointed wings in
  flight; the eye ringed and drawn last, so no cap or mask covers it (the lapwing's cap had covered its eye).
- **Doi Chang Ngu** (`karstHill`): a tower of grey limestone out of the paddies with a cave at its foot, as the karst
  of Doi Chiang Dao; the elephant goes into it as a snake.
- **The tale's things**: `forge` (the upright bamboo piston bellows of mainland Southeast Asia), `dap`, `fireGun`
  (the chronicle's ปืนไฟ, a matchlock), `elephantHook` (the chronicle's own footnote: a thornless bamboo whose side
  branches make good hooks), `carryPole`, `goldPan` (another copy of the chronicle has the villagers panning the gold
  of the tribute), `salung` and `goldPot` (the elephant's vessels of gold, in the forms of Lanna metalwork, since the
  chronicle's word for them is not known), `hangingCradle` with `swaddledBaby`, `risingWall` (Indra's wall, the
  deva's light along its top), `statuePool` (the fountain round the statue's base before Chiang Saen), and `almsBowl`,
  which is kit only and never in the maker.

The tale's people are looks over the cast in the film's own `changngu/sets.js` (the Black Khom king, the seer).

## A cord, a vine, a snare that holds, and the trough's ends (2026-10-23)

The owner, on the Maeng film: "When the snare is around the monster's leg make the rope really look like it is there
instead of being to small and just near the leg. Change the rope he pulls up the hill and the vine to look more like
the snare rope and a real vine." And: "the golden trough looks broken because when it curves upwards the horizontal
trough places and end pipe brown colored image on the pipe."

- **`cord(brush, points, wide, colour)`** (`pieces.js`): twisted rattan along a row of points: a darker edge, its
  colour (the snare's `#7a5a2e` unless told), and the twist, a short pale strand slanting across it every `wide`.
  The snare's line and the rope Thukkhata pulls up the hill (s05) are cords.
- **`vine(brush, from, to, sag, look)`** (`pieces.js`): a forest creeper hung between two points: a stem of brown and
  green with a thinner strand twisting round it, leaves on short stalks to either side (here and there none), two
  curls of tendril; `look.round` loops its end round something that wide (a neck), `look.wide`, `look.seed`. The vine
  tied round the creature's neck in s06 is one; it was a green line.
- **The snare holds a leg.** `snare()`'s `look.caught` may be `[x, y, wide, lean]`: a leg that wide, running up at
  the angle lean, and the noose is three turns of cord pulled tight round it, each the near half of a ring with its
  shadow pressed into the fur, knotted on the side the line pulls from, a loose end hanging. `maengSiHuHaTa()` gives
  that for its near fore leg just over the paw, where the leg is as it steps (`shin`, beside `paw`). It was a ring 9 by
  5 by the paw: at the film's size a few pixels beside the leg.
- **The trough's ends.** `linKham()` draws its dark open end only while it is still being built (`built` under 1).
  The yard's trough is two parts laid end to end, and the near one's end sat on the joint where the far one turns up
  across the fields. A second thing showed there, once the end was gone: the far part's first post, whose forked top
  poked out over the near part's gold at the turn; `look.joined` gives a trough that starts on another's end a first
  post with no fork, and `maengYardTrough()` sets it for the far part.

## Lanna weaving: the patterns, the cloths and the looms (2026-10-24)

The owner: "Start a notebooklm notebook on lanna and Northern Thai weaving", "Include as many pattern samples as you
can into the kit", "Create some cloth samples for the kit and some sabai with the symbols you find. Try to make them
look as authentic as possible", and "Try recreating a pattern for section of cloth where you recreate each thread as
a line? Then model wind rippling through the cloth? Pick the flowing water pattern."

All of it is `weaving.js`, shown on `weaving.html` in five parts of five seconds (the flowing water in the wind; the
weavers; three sin and two sabai; every motif, named). It follows the NotebookLM notebook "Lanna and Northern Thai
weaving: looms, spinning, cloth and the women who weave" (16 sources: the Silpakorn University thesis on the teen
jok of Nan, the Mae Chaem study and the Nan teen jok paper in ThaiJO, SACIT's archive of Kru Pranom Tapang's cloth
of Mueang Long, the Lanna Folklife Museum of Chiang Mai, the Department of Sericulture on khit, the Textile Atlas,
Chiang Mai Citylife, Chang Puak, the Thai Enquirer, Tammachat, SEALG and four more ThaiJO papers).

| What | How | From |
|---|---|---|
| The motifs | `LAI`: 57 grids of threads, each with its Thai name, its sound, what it is, its town and its source; `LAI_ORDER` shows them in turn. Each says `how` it was drawn: `chart` (a source's graph-paper chart, as the source's text describes it), `rule` (a source's rule of drafting it: the stepped diamond steps one across for each thread up), `shape` (drawn here from a source's words about its outline: the sources give Mae Chaem's, Mueang Long's and the khit motifs as names, meanings and silhouettes, not as charts) | the Nan thesis's 9 charted kinds and the 6 forms of sai yoi; Mae Chaem's 11 master motifs and 5 combined ones; Mueang Long's named motifs; Tai Lue nam lai; khit |
| A pattern woven | `weaveGrid(brush, grid, x, y, cell, palette, look)`: each thread of the pattern a float over the ground, a cell wider than it is tall (a pick is thinner than a float is long), lit on top and shadowed under, a little uneven from float to float, as hand-picked jok is (seeded: the kit uses no unseeded random); `look.warp` stands the float up for mook, a warp float. `weaveGround()` is the plain weave under it | |
| The colours | `WEAVE_DYES` and `WEAVE_PALETTES`: Mae Chaem black and red with jackfruit or turmeric yellow; Nan black or indigo with silver paper thread, gold and its yellow birds; Mueang Long indigo with jackfruit, stick lac and green; the Tai Lue's blocks; khit indigo on white | the notebook, town by town |
| A swatch | `clothSample(brush, x, y, {motif, palette, cell, across, down})`: one motif repeated over a piece of its cloth, the warp's ends loose top and bottom | |
| The hem | `teenJok(brush, x, y, w, {town})`: the parts in the order the Nan paper gives them: the yellow nail stripe (lep lueang), the upper rows, a thin band, the main row of lanterns (kom) and offering bowls (khan) by turns, a thin band, the lower row, the hanging tassels (sai yoi) or the ship's tail (hang sapao), the plain red foot (teen daeng). `TEEN_JOK_ROWS` holds Mae Chaem's, Nan's and Mueang Long's | jica 94252; Silpakorn thesis; SACIT |
| A whole sin | `sinCloth(brush, x, y, {town, w})`: the waist of white cotton and red, the body in even stripes (sin ta) or, for Mueang Long, covered with pearl flowers of warp floats (mook), and the teen jok | the notebook |
| A sabai | `sabaiCloth(brush, x, y, {palette, motifs, body, drop, w, t})`: a shoulder cloth hung over a bamboo pole in two layers, its ends woven with bands of khit, a fringe, swaying a little. Khit was woven on narrow reeds for shoulder sashes, indigo on white | Department of Sericulture |
| Every thread a line, in the wind | `threadCloth(brush, x, y, t, {warps, picks, gap, weft, wind})`: the Tai Lue's flowing water (`namLaiWeft()`: colour blocks of the koh luang tapestry weave stepping 2, 3, 4 and 5 warps from one group of picks to the next, up and back down), every warp and every weft a line, the warp brought over the weft at every other crossing, each pick a round yarn (a darker edge, a lighter crown). The wind is travelling waves, sums of sines of where a thread is and of the second: still at the pole, more toward the hem, a gust that swells and dies, the cloth blown downwind and its hem swinging; each patch lit by its slope. Not a simulation that steps from frame to frame: a film may be drawn in any order (`seek_check.py`), so the cloth at a second is the same whatever came before | Nan thesis on nam lai |
| The loom | `frameLoom(brush, x, base, size, t, {work})`: the frame loom (huk, ki) the sources describe, which stood under the house: she sits on its bench, her feet on the treadles (klong klaeng), the cloth rolled on the breast beam (mai ok ma) at her lap, the warp to the far beam, the heddles (khao) on their pulleys; in two seconds she throws the shuttle (krasuai), changes the shed and pulls the beater (fuem) home twice. `work: "jok"`: she leans in and picks the pattern with a porcupine quill, the beater left back. (The jok is woven face down, the right side under: the cloth on her loom shows its back, which the cartoon does not try to tell.) | the notebook, "the loom used in the north" |
| Spinning | `spinningWheel(brush, x, base, size, t)`: the wheel (phian, la, nai): she sits beside it on the floor, her right hand on the rim turning it, her left drawing the carded cotton (hang fai) back from the iron spindle toward her, the thread twisting | the notebook, "spinning cotton" |

What the sources do not give, and so the kit does not have: a backstrap loom among the northern Tai (the sources
name the Karen as weavers but describe no backstrap loom); charts for Mae Chaem, Mueang Long and the khit motifs
(their grids are drawn from the words, `how: "shape"`, and a weaver of Mae Chaem would put them right); the shapes
of Bo Suak's 18 named motifs (cotton flower, pikul, paired roosters, golden turtle, dog's paw and the rest: named and
explained, not drawn, so not in `LAI`); the inventories of Lampang, Lamphun and Uttaradit. The weaver's clothes are
the kit's `weaver` (an indigo blouse, a striped sin): for work at the loom the sources give a plain striped sin (sin
ta), a breast cloth or the snug suea pat, the hair in a high bun.
