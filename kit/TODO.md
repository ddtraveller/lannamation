# The kit's to-do: what the Lanna tales need that it does not draw yet

Written 2026-10-22 from the research for the tales: seventeen Lanna folk tales and legends (the Lanna Folktales
cartoons of the Thai Media Fund, and others), the Singhanawat chronicle (ตำนานสิงหนวติกุมาร) and the sources on
Chang Ngu. Each piece goes through candidates when its tale comes: two or three drawn beside a reference, the owner
picks, then the kit. A film's own list stays beside it (maeng/TODO.md). The eight candidates for the next film,
tale by tale, with what the kit has and lacks for each: `next_tales.md` (2026-10-25).

"Kit only" marks what stays out of the children's cartoon maker: things of the monkhood, of relics and of funeral rites
(the respect rule: a temple may stand in a film, but nobody plays at being a monk).

Done for Chang Ngu (2026-10-22): the river snakes, the white elephant's look, the kangsadan, Chang Ngu, the bael;
the soldiers and their spears (figures.md).

## Animals and creatures

- a turtle, and the golden-shelled turtle (เต่าน้อยอองคำ, Ban Thung Khan Chai, Chiang Rai)
- a catfish (pla duk) with its spines (ขะต๋ำป๋าค่ำตุ๊)
- a frog
- Rahu, the giant who swallows the sun and the moon (กบกินเดือนกินตะวัน, the eclipse)
- the giant white eel of Wiang Nong Lom (ตำนานปลาไหลเผือก)
- a riding horse with its saddle; Kanthoka, the flying horse (เจ้าสุวัตร นางบัวคำ)
- the mermaid, ngueak (เจ้าสุวัตร นางบัวคำ)
- a hen with six chicks as a family, and the seven stars of the Pleiades (ดาววีไก่น้อย)
- the forest's deer, monkeys and wild boar

## Architecture and places

- a city wall with a gate and a moat (Chiang Saen; Wiang Chai Prakan, the frontier town; Wiang Si Tuang)
- a sala, the village pavilion where travellers stay (ดาววีไก่น้อย)
- a hermit's hut in the forest, and a maiden's hall (เจ้าสุวัตร นางบัวคำ)
- a Lua (Lawa) village in the hills (ปู่เจ้าลาวจก)
- twin chedi on a peak with the long bamboo banner (Doi Tung; kit only for the relic shrine)
- the crystal cave of Pu Thaen Ya Thaen, with its throne (ปู่แถนย่าแถน)
- landscapes: the sandstone pillars of Phae Mueang Phi (Phrae), a lake with one island (Wiang Nong Lom), a cliff over
  the Ping (ผาวิ่งชู้), a ravine into a mountain (Doi Chang Ngu), the Kok river

## Food

- miang, fermented tea leaves in their packets (and Xieng Miang, the trickster)
- kaeng om and ho mok, the dishes of ดาววีไก่น้อย
- sacks of salt (ขะต๋ำป๋าค่ำตุ๊); a rice ladle, thapphi (กบกินเดือนกินตะวัน)

## Clothes and people

- a king's astrologer (hora), a queen, a young prince (the crowns are there)
- a white-robed ascetic, chi pa khao (the devotee in white is close), a hermit (rue-si)
- Lua (Lawa) dress
- a novice (kit only)

## Other things

- the drums and gongs beaten at an eclipse to make Rahu let go (กบกินเดือนกินตะวัน)
- a flower garland, phuang malai (เต่าน้อยอองคำ, เจ้าสุวัตร)
- a balance scale, ta chang, and the white wrist threads, sai sin (ปู่แถนย่าแถน)
- golden saba game pieces (หงส์หิน); a floating casket (นางผมหอม); a palanquin, saliang
- a sword (dap), a bow, war banners, matchlock fire-guns (puean fai: in the tale of Phrom's birth)
- a hoe, chok (ปู่เจ้าลาวจก: the name Lao Chok)
- the sound of the kangsadan, "ting ting", for the sound kit (sounds.py)
- an alms bowl (kit only)

## The hero film (sash_maeng.html)

- the mountains behind the village, the pond and the fields painted anew with the kit's new painters, as the
  garden and the pond were (owner, 2026-10-26: "upgrading the mountains in the background with the new kit"):
  forestHill() and softMist() of pinewoods.js, ridgeLayer(), limestonePeak() and natRays() of wildplaces.js, in
  place of the backdrop's flat hills and hillMist(). Begun the same day: the far range of the village, the pond, the
  dusk and the night sets is farRange() (a far ridge, a limestone peak, a forested range). Still to do: the rice
  fields' mountains (paddySet(), drawn on the paddy backdrop), the middle range (its ridge is where the elephants
  walk and the terraces stand), and the mist between them
- the first scene with the new sprites (owner, 2026-10-30: "redo the first scene of the hero video with the new
  sprites"; "The idea for the video is to start focused on a woman and then everything starts moving and then as it
  pulls back the viewer realizes it's the exact same woman that was started with"): drawn beside the kit, not in the
  film yet: the woman as the mural maiden wearing the cloth laid on her own body all the way across it, the woven figure
  the camera opens on the same maiden, the two weavers seated (mural_seated.js). Into the film and its render on the
  owner's word
- the woven cloth made better (owner, 2026-10-30: "Write down 4-7 as next steps after 1-3 and then begin on 1-3").
  First, begun the same day: (1) its figures woven, not painted: each tile laid as floats of the cloth's few thread
  colours on a grid, the warp showing between them, as a teen jok is woven; (2) light and folds: a shade along its
  lower edge and a sheen along its upper, darker where it turns over the shoulder with a crease at the fold, a soft
  shadow on her blouse, its gold catching the light as she sways; (3) a finished end: the tail behind her shoulder a
  decorated end panel and a knotted fringe that swings. Then (4), (5) and (7), and all of them into the kit on
  2026-10-31 (owner: "yes to the kit"): `sabai_finish.js`, a cloth with `finish: true` (docs/kit/things.md, "The sabai
  finished"); (6) is met by (1) for now (every figure woven), unless the owner would rather the mural figure. Still to
  do: the hero film itself wearing it (`sash_maeng.html` and its render), on the owner's word:
  - (4) woven borders: in place of the flat gold lines, selvedge borders of small teeth or diamonds in gold thread, as
    the teen jok's borders are
  - (5) moving as cloth: the tail lagging her sway, small ripples running down to its end, the same breeze as the tung
    on its pole, the fringe trailing last
  - (6) one style: every woven figure drawn as the new sprites are (the mural figure), or all as woven figures (1)
  - (7) less at a distance: as the camera pulls back, the twelve rows of small figures giving way to broader bands of
    pattern, as a cloth is seen from across a yard

## The films' scenery (docs/kit/places.md, "Painting the scenery"; scenery.js)

- Maeng (owner, 2026-10-26: "start upgrading and updating the meang si hoo cartoon like the hero video"): begun. Done:
  the far mountains of every set (farRange()), the meadow's and the city's trees painted in flower and fruit, the
  air of scenes 3, 6, 9, 11, 12 and 14 (MAENG_AIR in maeng/sets.js) with soft grass or blossom at the picture's edges.
  Then, from stills the owner approved: Doi Khao Khwai painted anew (maengForest(): rows of bushes, pines, flowers and
  fruit near its foot), the new cave in scenes 1, 5, 6 and 13 (sceneryCave()), scene 1's night with fine stars, the
  moon and bats going out behind the mountain, soft clouds in place of the cartoon cumulus in every scene, the film's
  own far mountains (MAENG_FAR: no limestone peak). Then the owner went through every scene, 1 to 15, from stills
  and a plan each ("I'd like to go through all the scenes like this"), all approved: the paddy water mirrored with
  egrets over it (2), the meadow's grass, flowers and the magpie's branch (3), the hut's bamboo and the pen's woodwork
  in fine grain, its ladder up into the house (4, ruenPhuk() and kok() look.fine), the cave's bushes and the bush at
  the snare (5, 6, 13), the yard's stars and moon and the fire's light (7), the garden's earth and the sun and moon
  crossing the sky (8), the palace's plinth, posts, court and wall and jars of flowers (9 to 12, hoKham() look.fine),
  the sunset, the lanterns' light and the dawn (10), the morning (11), the wedding's sunset and strings of khom (12),
  the run home and Doi Khao Khwai in the morning (13), the goodbye's dusk and lamp (14), the credits' night (15). To
  do: the film rendered again, all 15 scenes, with the new beasts (c7b37e6); the owner's word before S3.
- Chang Ngu: v3, its own plan, kit/changngu/TODO.md "v3" (scene by scene with the owner, as Maeng).
