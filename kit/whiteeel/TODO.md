# The White Eel: what is done, what is next

The owner, 2026-11-06, after scene 1's video: "Continue on until the entire video is complete." So every scene is
built in turn without waiting for a yes on each (stills are still shown), then the sound, the narration and the
render, LOCAL only: S3, YouTube and the site wait for the owner's word. The script is `story.py`; the recipe is
`docs/kit/films.md`. Each scene is `sNN_*.js` with its own `sNN.html`; shared things are in `sets.js`. The city of
Yonok is the Chang Ngu film's own (its palace, court, lanes, rooms and village): the pages load `../changngu/sets.js`
for them.

## The people (the owner's picks, 2026-11-06)

`WEL_BRAHMAN`, `WEL_WIDOW`, `WEL_YOUNG`, `WEL_HEADS` in `sets.js`; the prince `WEL_PRINCE` (pick A, the kit's noble,
as Chang Ngu's King Phang, his descendant: the princes of the murals are bare-chested with gold).

## The scenes

| # | Scene | s | State | Plan |
|---|---|---|---|---|
| 1 | Nong Lom today | 30 | built (75304a5) | dawn on the marsh, buffalo wading, the titles |
| 2 | The Brahman | 45 | built | midday plain by the Kok; the prince and his people walk in; the Brahman meets him, points over the land, speaks, the prince makes a wai; he walks into the reeds and is gone, a long ripple on the river |
| 3 | The naga's city | 40 | built | night: the Brahman by the river becomes the naga and goes round the plain, water filling behind him; cut to morning: the walls and gate stand (Chang Ngu's gate), people at work |
| 4 | Forty-five kings | 35 | built | the city through the years: the court with a king crowned, and another; the same gate; last, the old King Mahachaichana on his throne |
| 5 | The old widow | 35 | built | the edge of the city: her house on stilts; she sweeps under it, cooks a little rice for one; neighbours pass |
| 6 | The white eel | 45 | built | the Kok on a bright day: people fishing, the pale shape; the eel rises; nets and ropes; dragged up the bank, a groove in the mud (no killing shown) |
| 7 | The feast | 40 | built | the palace yard: the king points, the eel shared on banana leaves; dusk: smoke from every kitchen, lamps along the lane, her house dark |
| 8 | The young man | 55 | built | evening inside her house by one lamp: he climbs her stairs; rice and water set out, untouched; they talk |
| 9 | Down to the river | 40 | built | night: he speaks at the top of her stairs and goes down into the dark; moonlit Kok: a ripple and a pale gleam once; fireflies |
| 10 | Three roars | 60 | built | inside at night: three roars, each louder; the lamp swings; she sits up, goes to the door, goes back; before dawn, the top of her stairs, grey mist |
| 11 | Morning water | 40 | built | sunrise: mist lifting off flat water to both edges; her house alone on its stilts in the water, her small figure on the veranda |
| 12 | The village heads | 50 | built | late morning: the heads come in a line to the water's edge; pole a raft to her house; she comes down; the stream where the groove was |
| 13 | We were wrong | 50 | built | on the shore they bow to her and lead her to a house, food first; a circle, Khun Lang chosen; posts of a new town by the Mae Khong |
| 14 | Who was he? | 55 | built | the marsh today at sunset: buffalo swimming home, fires, the island with its temple and shrine; a pale shimmer under the water, or a cloud; the moral; the goodbye |
| 15 | The credits | 120 | built | the marsh by night, the roll (credits.js), the pandas' thanks |

The whole film: `film.html` (made by `film_page.py`), 740 s, 58 lines, all fifteen drawing (2026-11-06).

## Done (2026-11-06)

- Pan's voice: 174 takes, one kept a line (all 58 hers, heard at 0.89 or more of their Kam Mueang words); every voiced
  line checked to be the script's Kam Mueang, none Central Thai. Lines retimed to the takes (7f6d0d2).
- Music (feelings.py) and 49 sounds, a new roar in sounds.py; the mix at -14 LUFS.
- Rendered at 7f6d0d2 (render worktree C:/jslab/eel/render, its film_scenes/ clips kept for re-renders), joined after
  the hero film (v31) and the studio card: lanna_tales_whiteeel_v1.mp4, 875.3 s, -14.1 LUFS, peak -1.7 dBTP. LOCAL only.

## v3 (2026-11-07 and 08)

- The owner's asks after v2: the haulers in front of the tree at 5:55 (welPlainTreeSprites), the widow without the long
  neck, the painted women sized to the rig (people.js PEOPLE_FORM), the shine and fires behind the buffalo at 12:20, no
  shake or grit (film 0), birds, dragonflies and fish (sets.js), and the new hero (sash_maeng.html with the lab's
  princess in the finished sash).
- Rendered at 4fee38d by C:/jslab/eel/v3_all.sh: the hero Videos/maeng/lanna_sash_maeng32.mp4 (122.467 s, v31's sound,
  the words as v31's), then lanna_tales_whiteeel_v3.mp4, 875.3 s, -14.1 LUFS, peak -1.1 dB. LOCAL only.
- The kit check after: 89 pages, 11 failed. Eight wanted people.js (fixed on main, 8199bb2). floor.html and lanna.html
  counted the arms of people.js's unseen rig (arms_check now skips PEOPLE_SINK). The hero pages load slower with the
  finished cloth (kit_check SLOW_LOAD).

## v4: Pan's own voice and words (2026-11-09)

- Pan checked all 58 lines (her words now in story.py: 57 changed, 4 kept as the writer had them) and read every
  one aloud (8 Nov). Her readings are the narration, in place of the made voice: 394.6 s of voice against 318.8 s.
- Every scene laid out again for her lengths, no pause shortened, each scene's moments moved through its time warp
  (the Maeng film's way, 25 Oct): the tale 740.8 s -> 824.2 s. W10_ROARS moved by hand. No line crosses a cut.
- Her two ๆ (W049, W054) stay in the subtitles; SAY_AS says the word twice (tale_plan.py checks the spoken form).
- The English follows her words where they now mean something else: W011, W012, W037, W049, W056, W058.
- To do: the music again (feelings.py --film), her voice mixed over it, all 15 scenes rendered again (the kit's men
  changed too), joined after the hero and the studio card; the owner's look.

## Still open

- Pan's ear on story.py's ASK words (13): done by her checks of 8 Nov (every line hers).
- A reader of the Lanna script for the tale's title. The credits' headings are in Thai, as the first films'.
- The owner's look; S3, YouTube and the site on his word only; watdonchan sync (with the bare-chest kit fix).
