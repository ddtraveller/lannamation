"""Hong Hin, the stone swan (หงส์หิน): the tale's plan and every line, for ../tale_plan.py.

    python tale_plan.py honghin        (in kit/: writes plan.html, words.js, central.txt here)

Proposed 2026-11-11. The owner chose the tale on 11 Nov 2026, after the White Eel, and set its rules: tell it as the old
text tells it, naturally, at whatever length it takes ("Don't worry about fitting the story to a time"); do not judge
the other culture by another's standards ("Don't be too judgemental of other cultures"); the ghouls eat raw flesh, as
the story has it; only the beheading of the six wives and their sons is not shown: "just say they were punished
severely". The telling followed is Chao Suriyawong's khao so (ค่าวหงส์หิน, 1901, printed 1917), with the palm-leaf Jataka
where the two agree, read through the tale's NotebookLM notebook (its quotes of the khao so give the names).
The Kam Mueang is a draft by Claude in Pan's spellings (as her corrections of the White Eel: บ่า, กิ๋น, เป๋น, กั๋น,
ตี้, ก่อ, ละก่อ, หื้อ, หัน, ผ่อ, อู้, ฮ้อง, ปิ๊ก, แห๋ม, ตึง, ขนาด, กั๋ว, บะดี, เปิ้น); no native speaker has checked it
yet. ASK lists the words most worth her ear.
"""

PLAN = {
    "title": "Hong Hin, the Stone Swan",
    "thai": "หงส์หิน",
    "prefix": "H",
    "subtitle": "The prince who rode a swan of stone: a Lanna Tales cartoon, told in Kam Mueang. "
                "Proposed script of 11 November 2026.",
    "lede": """In Varanasi, six jealous wives steal the chief queen's newborn son, put a spotted puppy in his place and
have her driven out. Indra catches the falling baby, raises him in heaven, and at thirteen sends him home with a sword
that cannot break and a swan made of stone that flies. Living with his mother in a gardener's hut, the boy beats his six
half-brothers at saba with red seeds, kills the giantess who eats the city's people, and lets the brothers take the
credit. When the king sends his sons to bring back his own mother, stolen by ghouls twenty years before, the boy flies
for them: through three giant kingdoms, where he wins three wives, to the ghoul city, where he finds his grandmother,
and past the beast that swallows elephants. At the river the brothers kill him and take her home. Indra brings him back;
his grandmother knows him; the truth comes out; the wives and their sons are punished severely; the king begs Vimala's
forgiveness; and Hong Hin is crowned.""",
    "before": 109.75,
    "before_words": "the hero film (97.75 s) and the studio card (12 s)",
    "credits": 150,
    "first": [
        ("The choices in this script", """<p>Owner, 11 November 2026: tell the tale <b>as the old text tells it,
naturally</b>, at whatever length it takes; <b>do not judge</b> the other culture by another's standards; the ghouls
<b>eat their meat raw</b>, as the story has it; only the beheading of the six wives and their sons is not shown:
<b>"just say they were punished severely"</b>. The telling followed is Chao Suriyawong's khao so
(<span class="th">ค่าวหงส์หิน</span>, 1901), with the palm-leaf Jataka where they agree; its names are the khao so's,
as the tale's NotebookLM notebook quotes them.</p>
<p>The owner's answers to the plan's four questions, 11 November 2026: the killings (the giantess, the ghouls, the
Hemmarat) are shown as <b>the stroke, then a cut</b> to the body already fallen, no head seen coming off; the sign of the
milk is <b>shown as the text tells it</b>; the three princesses' vow is <b>as the text</b>: a fire, and leaping into
it to die with him; the hero is <b>named once</b>, when his mother names him, then "the boy".</p>"""),
        ("Where the tellings differ, and what this script says", """<div class="wrap"><table>
<tr><th>Point</th><th>Chao Suriyawong's khao so (1901)</th><th>Others</th><th>This script</th></tr>
<tr><td>The hero's name</td><td><span class="th">เจ้าทุตคตขัตติวงศ์</span>, "born of suffering"; called
<span class="th">เจ้าหินหงส์</span> and <span class="th">หน่อโพธิสัตว์</span></td><td>Loma Wisai's khao so: Hong Pha Kham;
the Isan palm leaf: Thao Hong Hin</td><td>named once, then "the boy" (owner)</td></tr>
<tr><td>The game</td><td>saba (<span class="th">หมากบ้า</span>): the brothers' pieces of gold, his of red seeds
(<span class="th">หมากนิมแดง</span>)</td><td></td><td>as the khao so</td></tr>
<tr><td>The giantess</td><td><span class="th">ย่ายักข์เถ้า</span> under the great sugar palm at the south gate; eats
people every seventh day; Kanchai takes off her head</td><td>the cartoon of today: a widow giantess</td><td>as the khao
so; the stroke, then a cut (owner)</td></tr>
<tr><td>The grandmother</td><td>stolen by ghouls when the king was twenty; twenty years without salt, fire or rice</td>
<td></td><td>as the khao so</td></tr>
<tr><td>The ghouls</td><td><span class="th">ยักษ์ผีดิบ</span>, who eat their meat raw; their bodies fall from the sky
"like rain"</td><td></td><td>as the khao so (owner: the raw flesh is fine)</td></tr>
<tr><td>The beast</td><td><span class="th">เหมะราช</span>, "like a lion, but with wings, as big as an elephant", that
swallows elephants</td><td></td><td>the kit's <code>hemmarat()</code> (the owner's pick)</td></tr>
<tr><td>The six wives and sons</td><td>beheaded at the cemetery; the earth swallows them</td><td>the cartoon of today:
banished</td><td>"punished severely" (owner); not shown</td></tr>
<tr><td>The ending</td><td>Vimala refuses, the king begs, she forgives; the gardeners honoured; a festival and the
crowning</td><td></td><td>as the khao so</td></tr>
</table></div>"""),
    ],
    "last": [
        ("Words for Pan's ear", """<p>The Kam Mueang is Claude's draft, in Pan's spellings where her corrections show
them. The words in ASK (below the scenes) most need her ear before the voice reads them.</p>"""),
        ("Made for the kit (2026-11-11)", """<p>Every being and thing below was drawn as candidates and picked by the
owner; sheet <code>honghin.html</code>: the stone swan with its rider and the grandmother behind
(<code>hongHin</code>), Indra flying, standing and on his throne (<code>indra</code>), the ghouls and the giantess
(<code>ogre</code> kinds), the three daughters (<code>ogreDaughter</code>), the Hemmarat (<code>hemmarat</code>), the
sugar palm, the swan hidden as a log, the saba beans and red seeds, the puppy, Kanchai, the crossbow, musket and
fetters, the three floating palaces (<code>vimana</code>), the bai si and the conch.</p>
<p><b>Still to make, as the film's sets</b> (<code>honghin/sets.js</code>, from the kit's pieces): Varanasi's palace
and its south gate, the queen's room, the orchard hut, Indra's heaven, the frontier river and the camp, the three
giant cities, the ghoul city's huts, the mountain pass, the fair and its high pavilion, the trial.</p>"""),
        ("Sources", """<p>Chao Suriyawong's khao so of Hong Hin (<span class="th">ค่าวหงส์หิน</span>, 1901, printed 1917),
and the Fine Arts Department's retelling, both through the tale's NotebookLM notebook, which quotes the khao so's lines;
the studies of the Lanna Hong Hin (its manuscripts, Phraya Loma Wisai's khao so); the Lanna Folktales cartoon of today
(not copied).</p>"""),
    ],
}

# Each scene: (title, seconds, what we see, what the kit has, what it needs new, [(English, Central Thai, Kam Mueang)]).
SCENES = [
    ("The ghouls come", 45,
     "Night over Varanasi: the walls, the palace, lamps. Ghouls of three kinds come out of the forest, climb the wall, "
     "and carry off an old queen into the dark. A young king of twenty wakes to an empty room. Title: หงส์หิน.",
     "ogre (ghoul, ghoulPale, ghoulDark), hoKham, cityWall, sceneryMoon, sceneryStars, the hero film's titles",
     "Varanasi by night",
     [("Long ago, in the city of Varanasi, there lived a king called Purantapa.",
       "นานมาแล้ว ที่เมืองพาราณสี มีพระราชาชื่อพระเจ้าปุรันตปะ",
       "สมัยก่อนพุ้น ตี้เมืองปาราณสี มีพระญาจื่อพระเจ้าปุรันตปะ"),
      ("When he was twenty, ghouls came out of the forest by night.",
       "ตอนพระองค์อายุยี่สิบปี ยักษ์ผีดิบออกมาจากป่าในตอนกลางคืน",
       "ต๋อนเปิ้นอายุซาวปี๋ ยักษ์ผีดิบออกมาลุ๊กดงป่าไม้ต๋อนกลางคืน"),
      ("They stole the king's own mother and took her away into the deep forest.",
       "พวกมันลักพาพระมารดาของพระราชาไป เข้าไปในป่าลึก",
       "หมู่มันลักเอาแม่ของพระญาไป เข้าไปในดงป่าไม้เลิ๊ก"),
      ("No one could follow them, and no one ever found her.",
       "ไม่มีใครตามไปได้ และไม่มีใครพบนางอีกเลย",
       "บ่ามีไผโตยไปได้ ละก่อบ่ามีไผหันเปิ้นแห๋มเลย"),
      ("This is the story of Hong Hin, the swan of stone.",
       "นี่คือเรื่องของหงส์หิน",
       "นี่เป๋นเรื่องของหงส์หิน")]),

    ("The astrologers", 45,
     "Years later, by day: the king with his chief queen Vimala, heavy with child, and his six other wives. The "
     "astrologers at their boards. The six wives listen behind a screen, and look at each other.",
     "hoKham (fine), noble, castWoman (princess, court, lady), the seer of Chang Ngu",
     "the astrologers' boards; the six wives' looks",
     [("The king grew up and married. His chief queen was Vimala, and he had six other wives.",
       "พระราชาเติบโตขึ้น มีมเหสีชื่อพระนางวิมาลา และมีสนมอีกหกนาง",
       "พระญาใหญ่ขึ้นมา มีเมียหลวงจื่อนางวิมาลา ละก่อมีเมียน้อยแห๋มหกนาง"),
      ("Each of the six had borne him a son.",
       "สนมทั้งหกต่างมีลูกชายคนละคน",
       "เมียน้อยตึงหกนาง มีลูกจายคนละคน"),
      ("Vimala was with child, and the child would not come, even past the tenth month.",
       "พระนางวิมาลาทรงครรภ์ เกินสิบเดือนแล้วลูกก็ยังไม่คลอด",
       "นางวิมาลามีต๊อง เกิ๋นสิบเดือนแล้ว ลูกก่อยังบ่าออกมา"),
      ("The astrologers read the stars and said: this is no demon. It is a child of great merit, who will rule the land.",
       "โหรดูดาวแล้วทูลว่า ไม่ใช่ยักษ์มาร แต่เป็นผู้มีบุญ จะได้ครองแผ่นดิน",
       "หมอโหรผ่อดาวแล้วบอกว่า บ่าแม่นยักษ์มาร แต่เป๋นต๋นบุญ จะได้เป๋นพระญาครองเมือง"),
      ("The six wives heard it, and they were afraid. Their own sons would be nothing.",
       "สนมทั้งหกได้ยินก็กลัว ลูกของตนจะไม่มีความหมาย",
       "เมียน้อยตึงหกได้ยินก่อกั๋วขนาด กั๋วลูกของตั๋วจะบ่าได้เป๋นอะหยั๋ง")]),

    ("The puppy", 55,
     "Night, the queen's room, a lamp. The six crowd round her and send everyone out; she faints. Their hands, a "
     "spotted puppy, the baby taken to a hole in the floor. Far above, Indra's stone throne glows red; he looks down; "
     "the falling baby is caught in the air by Indra and Witsanukam and carried up into the clouds. Morning: the six "
     "before the king; his face.",
     "castWoman, lamp light, puppy, indra (throne, fly), thewada, swaddledBaby",
     "the queen's room by night; Witsanukam (a second thewada)",
     [("When her time came, the six wives crowded into her room and kept everyone else away.",
       "เมื่อถึงเวลาคลอด สนมทั้งหกเข้าไปในห้อง และกันคนอื่นไว้ข้างนอก",
       "เมื่อถึงเวลาออกลูก เมียน้อยตึงหกเข้าไปในห้อง ละก่อกั้นคนอื่นไว้ตางนอก"),
      ("Vimala fainted with the pain.",
       "พระนางวิมาลาเจ็บจนสลบไป",
       "นางวิมาลาเจ็บขนาด จ๋นสลบไป"),
      ("They took a little spotted puppy, smeared it with her blood, and laid it beside her.",
       "พวกนางเอาลูกสุนัขลายตัวเล็กๆ มาทาเลือด แล้ววางไว้ข้างพระนาง",
       "หมู่นางเอาลูกหมาลายตั๋วหน้อยมาทาเลือด แล้ววางไว้ข้างนางวิมาลา"),
      ("And the baby boy they pushed down through a hole in the floor.",
       "ส่วนพระโอรส พวกนางผลักลงไปทางรูใต้พื้น",
       "ส่วนลูกจายแต้แต้ หมู่นางยู้ลงไปตางฮูใต้พื้น"),
      ("Far above, Indra's stone throne grew hot. He looked down and saw the child falling.",
       "บนสวรรค์ แท่นศิลาของพระอินทร์ร้อนขึ้น พระองค์มองลงมา เห็นเด็กกำลังตกลงไป",
       "บนสวรรค์ แท่นหินของพระอินทร์ฮ้อนขึ้นมา เปิ้นผ่อลงมา หันละอ่อนกำลังต๊กลงไป"),
      ("With Witsanukam he caught the baby in the air, and carried him up to heaven.",
       "พระอินทร์กับพระวิษณุกรรมรับเด็กไว้กลางอากาศ แล้วพาขึ้นไปบนสวรรค์",
       "พระอินทร์กับวิสุกัมฮับละอ่อนไว้ก๋างอากาศ แล้วปาขึ้นไปบนสวรรค์")]),

    ("Driven out", 45,
     "The six tell the king; the king stands, cold; Vimala, in the morning, holds the bloodied puppy and is sent "
     "through the gate. She walks into the dusk, weeping, the puppy in her arms.",
     "castWoman, noble, cityWall, puppy, scenerySun low",
     "Varanasi's gate",
     [("The six told the king: your queen has borne a dog. She has been with dogs.",
       "สนมทั้งหกทูลพระราชาว่า มเหสีคลอดลูกเป็นหมา นางคบกับหมา",
       "เมียน้อยตึงหกไปบอกพระญาว่า เมียหลวงออกลูกเป๋นหมา นางไปคบกับหมา"),
      ("The king believed them. That same day he drove Vimala out of the city.",
       "พระราชาหลงเชื่อ วันนั้นเองก็ขับไล่พระนางวิมาลาออกจากเมือง",
       "พระญาเจื้อหมู่นาง วันนั้นเลยไล่นางวิมาลาออกจากเมือง"),
      ("She walked into the night, weeping, the little dog in her arms.",
       "พระนางเดินออกไปในความมืด ร้องไห้ อุ้มลูกหมาไว้ในอ้อมแขน",
       "นางเตียวออกไปในความมืด ไห้ไปตวย กอดลูกหมาไว้ในแขน")]),

    ("The gardeners", 40,
     "Late night: an orchard at the city's edge, a small hut. An old couple wake, light a torch, and find the queen. "
     "They take her in; morning, she sweeps, she waters the garden.",
     "fieldHut, elder, grandmother (old rig), sceneryLampLight, flora",
     "the orchard hut",
     [("At an orchard on the edge of the city lived an old man and an old woman, who had no children.",
       "ที่สวนชายเมือง มีตายายสองคน ไม่มีลูกสักคน",
       "ตี้สวนปายเวียง มีป้ออุ้ยแม่อุ้ยสองคน บ่ามีลูกสักคน"),
      ("They lit a torch, saw the weeping lady, and took her in.",
       "ตายายจุดคบไฟ เห็นนางร้องไห้อยู่ ก็รับนางไว้",
       "ป้ออุ้ยแม่อุ้ยจุดไต้ หันนางไห้อยู่ ก่อฮับนางไว้"),
      ("They shared what little they had: taro, bananas, vegetables from the garden.",
       "แบ่งของที่มีน้อยนิดให้ เผือก กล้วย ผักในสวน",
       "ปั๋นของตี้มีหน้อยหน้อยหื้อ เผือก กล้วย ผักในสวน"),
      ("And the queen lived on as their daughter, a gardener.",
       "พระนางจึงอยู่กับตายาย เหมือนเป็นลูกสาว ช่วยทำสวน",
       "นางเลยอยู่กับป้ออุ้ยแม่อุ้ย เหมือนเป๋นลูกสาว จ่วยยะสวน")]),

    ("The boy in heaven", 45,
     "Heaven: gold palaces on clouds. Indra's queens try to nurse a baby who cries; years pass; a boy asks Indra "
     "something; Indra kneels to him and points down through the clouds to a small hut.",
     "vimana, thaiCloud, indra (stand), thewada, celestial, boy",
     "Indra's heaven",
     [("In heaven, Indra's queens tried to nurse the child, but they had no milk, and he cried.",
       "บนสวรรค์ มเหสีของพระอินทร์พยายามให้นม แต่ไม่มีน้ำนม เด็กจึงร้องไห้",
       "บนสวรรค์ เมียของพระอินทร์จะหื้อนม แต่บ่ามีน้ำนม ละอ่อนเลยไห้"),
      ("He grew, and asked: who is my mother?",
       "เด็กโตขึ้น แล้วถามว่า แม่ของข้าคือใคร",
       "ละอ่อนใหญ่ขึ้นมา แล้วถามว่า แม่ของข้าเป๋นไผ"),
      ("Indra told him everything: the six wives, the puppy, and his mother in the orchard.",
       "พระอินทร์เล่าให้ฟังทุกอย่าง เรื่องสนมทั้งหก ลูกหมา และแม่ของเขาที่อยู่ในสวน",
       "พระอินทร์เล่าหื้อฟังกู๊อย่าง เรื่องเมียน้อยตึงหก ลูกหมา ละก่อแม่ของเปิ้นตี้อยู่ในสวน")]),

    ("The stone swan", 55,
     "Indra before a golden boulder, chanting; the boulder glows and opens its wings: the stone swan. Indra gives "
     "the boy the sword Kanchai. The boy, thirteen, climbs on, takes the reins, and they dive down through the "
     "clouds toward the city.",
     "indra (stand), hongHin, kanchai, thaiCloud, boy, regalia",
     "the golden boulder; the swan waking from it",
     [("When the boy was thirteen, Indra made him ready to go home.",
       "เมื่อเด็กอายุสิบสามปี พระอินทร์เตรียมให้เขากลับบ้าน",
       "เมื่อละอ่อนอายุสิบสามปี๋ พระอินทร์ก่อเตียมหื้อเปิ้นปิ๊กเฮือน"),
      ("He took a golden boulder, spoke words over it, and the stone became a swan that could fly.",
       "พระองค์เอาก้อนหินทองคำมา ร่ายมนต์ แล้วหินก็กลายเป็นหงส์ที่บินได้",
       "เปิ้นเอาก้อนหินคำมา ว่าคาถาใส่ แล้วหินก่อกลายเป๋นหงส์ตี้บินได้"),
      ("Hong Hin, the stone swan. It flew like a shooting star, and the boy steered it by its reins.",
       "หงส์หิน บินเร็วเหมือนดาวตก เด็กบังคับด้วยบังเหียน",
       "หงส์หิน บินไวเหมือนดาวต๊ก ละอ่อนบังคับมันด้วยสายจู๋ง"),
      ("And Indra gave him a sword that nothing could break: Kanchai.",
       "แล้วพระอินทร์ประทานดาบที่ไม่มีอะไรทำลายได้ ชื่อดาบกัญชัย",
       "แล้วพระอินทร์หื้อดาบตี้บ่ามีอะหยั๋งหักได้ จื่อดาบกัญไจย")]),

    ("Mother", 55,
     "Dusk at the orchard: the swan lands in the thicket and folds itself into a mossy log under creepers. The boy at "
     "the hut's door; Vimala turns away, not believing. He raises his hands in a vow; her milk streams to his mouth, as the text tells it (owner); she weeps, holds him.",
     "hongHin, swanLog, fieldHut, castWoman, boy, wai, scenerySun",
     "the swan folding into the log",
     [("He hid the swan in the thicket, where it folded itself up to look like an old log.",
       "เขาซ่อนหงส์ไว้ในพุ่มไม้ หงส์หุบตัวลงเหมือนขอนไม้เก่า",
       "เปิ้นซ่อนหงส์ไว้ในป่าไม้ หงส์ก่อหุบตั๋วลงเหมือนขอนไม้เก่า"),
      ("At the hut he said: I am your son.",
       "ที่กระท่อม เขาบอกว่า ข้าเป็นลูกของแม่",
       "ตี้ตูบ เปิ้นบอกว่า ข้าเป๋นลูกของแม่"),
      ("She would not believe him. Her child, they had told her, was a dog.",
       "นางไม่เชื่อ เพราะเขาบอกว่าลูกของนางเป็นหมา",
       "นางบ่าเจื้อ ย้อนเขาบอกว่าลูกของนางเป๋นหมา"),
      ("So he made a vow of truth: if I am her son, let her milk come to me.",
       "เขาจึงอธิษฐานว่า ถ้าข้าเป็นลูกของแม่จริง ขอให้น้ำนมของแม่ไหลมาหาข้า",
       "เปิ้นเลยอธิษฐานว่า ถ้าข้าเป๋นลูกของแม่แต้ ขอหื้อน้ำนมของแม่ไหลมาหาข้า"),
      ("Her milk flowed to him, and she knew. She held him and wept.",
       "น้ำนมของนางไหลมาหาเขา นางก็รู้ กอดลูกแล้วร้องไห้",
       "น้ำนมของนางไหลมาหาเปิ้น นางก่อฮู้ กอดลูกแล้วไห้"),
      ("She named him Thukkhata, the prince born of suffering.",
       "นางตั้งชื่อเขาว่า ทุตคตขัตติวงศ์ เจ้าชายที่เกิดมาจากความทุกข์",
       "นางใส่จื่อหื้อเปิ้นว่า ทุตคตขัตติวงศ์ เจ้าจายตี้เกิ๊ดมาลุ๊กความตุ๊ก")]),

    ("Red seeds against gold", 55,
     "Day, the crossroads before the palace: six princes in silk play saba with gold pieces. The boy watches; Vimala "
     "brings a pouch of red seeds; they laugh; he throws; gold falls row after row; he walks home with all of it.",
     "sabaBean, redSeed, seedPouch, noble (six princes), boy, castWoman",
     "the crossroads before the palace",
     [("The six brothers played saba in the street, with pieces of solid gold.",
       "พี่น้องทั้งหกเล่นสะบ้ากันกลางถนน ด้วยลูกสะบ้าทองคำ",
       "ปี้น้องตึงหกเล่นหมากบ้ากั๋นก๋างถนน ด้วยหมากบ้าคำ"),
      ("The boy had no gold. His mother brought him a bag of red seeds from the forest.",
       "เด็กไม่มีทอง แม่เก็บเมล็ดมะกล่ำตาแดงจากป่ามาให้ถุงหนึ่ง",
       "ละอ่อนบ่ามีคำ แม่เก็บหมากนิมแดงลุ๊กป่ามาหื้อถุงหนึ่ง"),
      ("The brothers laughed: seeds, against gold?",
       "พี่น้องหัวเราะ เมล็ดมะกล่ำจะสู้ทองได้หรือ",
       "ปี้น้องหัวขวัน หมากนิมแดงจะสู้คำได้กา"),
      ("If I lose, I will be your servant, he said. If you lose, the gold is mine.",
       "เขาว่า ถ้าข้าแพ้ ข้าจะเป็นข้ารับใช้ ถ้าพวกท่านแพ้ ทองเป็นของข้า",
       "เปิ้นว่า ถ้าข้าแป้ ข้าจะเป๋นขี้ข้า ถ้าหมู่ตั๋วแป้ คำเป๋นของข้า"),
      ("He threw, and threw, and won every piece, and carried the gold home to his mother.",
       "เขาโยนแล้วโยนอีก ชนะทุกลูก แล้วนำทองกลับไปให้แม่",
       "เปิ้นโยนแล้วโยนแห๋ม ชนะกู๊ลูก แล้วเอาคำปิ๊กไปหื้อแม่")]),

    ("The giantess under the palm", 60,
     "The south gate: the great old sugar palm, the hollow at its foot, bones. Empty lanes. The red giantess comes "
     "out and lunges; the boy draws Kanchai: the stroke, then a cut to her fallen (owner). Then the six brothers creep up, beat the body, "
     "smear its blood on their clothes, and press a sack of gold into the boy's hands.",
     "sugarPalm, ogre (giantess), kanchai, noble (six), crossbow, musket, ogreMeat",
     "the south gate; the empty lanes",
     [("At the south gate, under a great sugar palm, lived an old giantess.",
       "ที่ประตูเมืองทางใต้ ใต้ต้นตาลใหญ่ มียักษ์แก่ตนหนึ่งอาศัยอยู่",
       "ตี้ประตู๋เมืองตางใต้ ใต้ต้นต๋าลหลวง มีย่ายักษ์เถ้าตนหนึ่งอยู่"),
      ("Every seventh day she caught people on the road and ate them raw. No one lived on that side of the city any more.",
       "ทุกเจ็ดวัน นางจับคนบนถนนกินดิบๆ ไม่มีใครกล้าอยู่ทางนั้นอีก",
       "กู๊เจ็ดวัน นางจับคนบนถนนกิ๋นดิบดิบ บ่ามีไผก้าอยู่ตางนั้นแห๋ม"),
      ("The boy walked straight to the tree. She sprang at him.",
       "เด็กเดินตรงไปที่ต้นตาล นางยักษ์กระโจนเข้าใส่",
       "ละอ่อนเตียวซื่อไปตี้ต้นต๋าล ย่ายักษ์โดดเข้าใส่"),
      ("You think I am easy meat? he said. You have never bitten a bird's-eye chilli.",
       "เขาว่า คิดว่าข้ากินง่ายหรือ ยังไม่เคยกัดพริกขี้หนูละสิ",
       "เปิ้นว่า กึ๊ดว่าข้ากิ๋นง่ายกา ยังบ่าเกยขบพริกขี้หนูหนา"),
      ("He drew Kanchai, and with one stroke the giantess was dead.",
       "เขาชักดาบกัญชัย ฟันทีเดียว นางยักษ์ก็ตาย",
       "เปิ้นจักดาบกัญไจย ฟันเตื้อเดียว ย่ายักษ์ก่อต๋าย"),
      ("Then the six brothers came, beat the body, smeared its blood on their clothes, and paid him to keep quiet.",
       "แล้วพี่น้องทั้งหกก็มา ตีซากยักษ์ เอาเลือดทาเสื้อผ้า แล้วจ่ายทองให้เขาเงียบไว้",
       "แล้วปี้น้องตึงหกก่อมา ตี๋ซากยักษ์ เอาเลือดทาเสื้อผ้า แล้วจ่ายคำหื้อเปิ้นอยู่เงียบเงียบ"),
      ("They told the king they had killed her. The king had his doubts, but he gave them a feast.",
       "พวกเขาทูลพระราชาว่าฆ่ายักษ์ได้ พระราชาสงสัย แต่ก็จัดงานเลี้ยงให้",
       "หมู่เขาไปบอกพระญาว่าฆ่ายักษ์ได้ พระญาสงสัย แต่ก่อจัดงานเลี้ยงหื้อ")]),

    ("The king's test", 50,
     "The palace hall: the king, the six heroes in their bloodied silks. He commands them; their faces. Night, the "
     "six at the orchard gate offering more gold to the boy. Then a march: three thousand men to a great river; the "
     "six sit down on the bank; the swan rises over the army and the soldiers drop to their knees.",
     "hoKham, noble, soldier (army), cngRiver, hongHin, sceneryWater",
     "the frontier river and the camp",
     [("The king remembered his stolen mother. If you are such heroes, he said, go and bring her back, or die.",
       "พระราชานึกถึงพระมารดาที่ถูกลักไป ตรัสว่า ถ้าเก่งนัก จงไปพาพระมารดากลับมา ไม่อย่างนั้นต้องตาย",
       "พระญานึกถึงแม่ตี้ถูกลักไป เลยว่า ถ้าเก่งขนาด ไปเอาแม่ปิ๊กมา บ่าอั้นจะต้องต๋าย"),
      ("The brothers were terrified. Again they went to the boy, with more gold.",
       "พี่น้องกลัวจนตัวสั่น ไปหาเด็กอีก พร้อมทองคำ",
       "ปี้น้องกั๋วจ๋นสั่น ไปหาละอ่อนแห๋ม เอาคำไปโตย"),
      ("They marched with three thousand men to a great river, and there they stopped, too frightened to cross.",
       "พวกเขายกทัพสามพันคนไปถึงแม่น้ำใหญ่ แล้วก็หยุด ไม่กล้าข้าม",
       "หมู่เขายกตั๊พสามพันคนไปเถิงแม่น้ำหลวง แล้วก่อยั้ง บ่าก้าข้าม"),
      ("The boy rose on his stone swan over their heads and was gone into the clouds.",
       "เด็กขี่หงส์หินบินข้ามหัวพวกเขา หายเข้าไปในเมฆ",
       "ละอ่อนขี่หงส์หินบินข้ามหัวหมู่เขา หายเข้าไปในเมฆ")]),

    ("The first giant king", 55,
     "Above forests, then a red-gold city of giants. The swan lands on a palace roof; a giant princess, rose-skinned, "
     "at her window; their eyes meet. Her father bursts in roaring. The boy speaks calmly; the giant king's face "
     "changes; a wedding feast of roast game and raw meat.",
     "hongHin, ogre (mural, king), ogreDaughter (mukhawadi), hoKham, ogreMeat",
     "the first giant city",
     [("He came to the city of the giant king Wassawaro, and landed on the palace roof.",
       "เขามาถึงเมืองของพญายักษ์วัสสะวโร แล้วลงบนหลังคาปราสาท",
       "เปิ้นมาเถิงเมืองของพญายักษ์วัสสะวโร แล้วลงบนหลังคาปราสาท"),
      ("There he saw the king's daughter, Mukhawadi, and they loved each other at once.",
       "ที่นั่นเขาเห็นธิดาของพญายักษ์ ชื่อมุกขะวดี ทั้งสองรักกันทันที",
       "ตี้หั้นเปิ้นหันลูกสาวพญายักษ์ จื่อมุกขะวดี ตึงสองฮักกั๋นเลย"),
      ("The giant king came in roaring that he would eat him.",
       "พญายักษ์เข้ามา คำรามว่าจะกินเขา",
       "พญายักษ์เข้ามา ร้องอู้ว่าจะกิ๋นเปิ้น"),
      ("But the boy spoke calmly and told him who he was, and the giant gave him his daughter.",
       "แต่เด็กพูดอย่างสงบ บอกว่าตนเป็นใคร พญายักษ์จึงยกธิดาให้",
       "แต่ละอ่อนอู้เย็นเย็น บอกว่าตั๋วเป๋นไผ พญายักษ์เลยยกลูกสาวหื้อ"),
      ("They feasted on roast meat and raw.",
       "แล้วกินเลี้ยงกัน ทั้งเนื้อย่างและเนื้อดิบ",
       "แล้วกิ๋นเลี้ยงกั๋น ตึงจิ๊นปิ้งละก่อจิ๊นดิบ")]),

    ("The second and the third", 60,
     "A green palace in the forest: Princess Culakantha, pale green, black eyes like gems; her father Kumbhanda "
     "challenges and then bows. A blue city: King Anumat storms in, sees the wheel on the soles of the boy's feet, "
     "and kneels; Princess Salicanta; the king points south.",
     "hongHin, ogre (king, forest), ogreDaughter (culakantha, salicanta), hoKham",
     "the second and third giant cities",
     [("In the second city, King Kumbhanda gave him his daughter Culakantha, pale green, with eyes as black as gems.",
       "ที่เมืองที่สอง พญากุมภัณฑ์ยกธิดาชื่อจุละกันธาให้ นางผิวเขียวอ่อน ตาดำเหมือนนิล",
       "ตี้เมืองตี้สอง พญากุมภัณฑ์ยกลูกสาวจื่อจุละกั๋นธาหื้อ นางผิวเขียวอ่อน ต๋าดำเหมือนแก้วนิล"),
      ("In the third, King Anumat came at him in a rage, until he saw the wheel on the soles of the boy's feet.",
       "ที่เมืองที่สาม พญาอานุมาโกรธจัด จนเห็นรอยจักรที่ฝ่าเท้าของเด็ก",
       "ตี้เมืองตี้สาม พญาอานุมาใจ๋ฮ้ายขนาด จ๋นหันฮอยจักรตี้ฝ่าตี๋นของละอ่อน"),
      ("Then the giant bowed down, and gave him his daughter Salicanta.",
       "พญายักษ์จึงก้มกราบ แล้วยกธิดาชื่อสะหลีจันตาให้",
       "พญายักษ์เลยก้มกราบ แล้วยกลูกสาวจื่อสะหลีจั๋นตาหื้อ"),
      ("And he showed him the way south, to the city of the ghouls.",
       "แล้วบอกทางไปทิศใต้ ไปเมืองยักษ์ผีดิบ",
       "แล้วบอกตางไปตางใต้ ไปเมืองยักษ์ผีดิบ")]),

    ("The ghoul city", 60,
     "Deep forest, thatched huts, bones, water pots. The ghouls are out hunting. An old, starving woman sits alone. "
     "She tells him her story. He smashes the huts and the pots with a club, sets her on the swan, rises; the ghouls "
     "come home and swarm into the sky after them, throwing stones and trunks; Kanchai flashes; cut to the ghouls "
     "falling like rain (owner).",
     "ogre (ghoul horde), ogreMeat, hongHin (behind), kanchai, grandmother, fieldHut",
     "the ghouls' huts in the deep forest",
     [("He came down among huts in the deep forest, while the ghouls were out hunting.",
       "เขาลงมาท่ามกลางกระท่อมในป่าลึก ตอนที่ยักษ์ผีดิบออกไปล่าสัตว์",
       "เปิ้นลงมาก๋างตูบในดงป่าไม้เลิ๊ก ต๋อนตี้ยักษ์ผีดิบออกไปล่าสัตว์"),
      ("One old woman sat there alone, thin and starving. She was his grandmother.",
       "มีหญิงชราผอมโซนั่งอยู่คนเดียว นางคือย่าของเขา",
       "มีแม่อุ้ยผอมขนาดนั่งอยู่คนเดียว นางคือย่าของเปิ้น"),
      ("Twenty years without salt, without fire, without rice, she said, while they eat their meat raw.",
       "ยี่สิบปีไม่มีเกลือ ไม่มีไฟ ไม่มีข้าว นางเล่า ส่วนพวกมันกินเนื้อดิบๆ",
       "ซาวปี๋ บ่ามีเกลือ บ่ามีไฟ บ่ามีข้าว นางเล่า ส่วนหมู่มันกิ๋นจิ๊นดิบดิบ"),
      ("He smashed their huts and their water pots, set her on the swan, and rose into the air.",
       "เขาทุบกระท่อมและหม้อน้ำของพวกมันจนแตก พาย่าขึ้นหลังหงส์ แล้วบินขึ้น",
       "เปิ้นตุบตูบละก่อหม้อน้ำของหมู่มันแตก เอาย่าขึ้นหลังหงส์ แล้วบินขึ้น"),
      ("The ghouls came home and flew after him, throwing stones and trees.",
       "ยักษ์ผีดิบกลับมา บินตามไป ขว้างก้อนหินและต้นไม้ใส่",
       "ยักษ์ผีดิบปิ๊กมา บินโตยไป ขว้างก้อนหินละก่อต้นไม้ใส่"),
      ("He swept Kanchai through them, and they fell from the sky like rain.",
       "เขาฟาดดาบกัญชัย พวกยักษ์ร่วงจากฟ้าเหมือนฝน",
       "เปิ้นฟาดดาบกัญไจย หมู่ยักษ์ร่วงลุ๊กฟ้าเหมือนฝนต๊ก")]),

    ("The Hemmarat", 45,
     "A high mountain pass at dusk. A huge dark winged beast with an elephant in its claws sees them and lunges; "
     "Kanchai flashes; cut to the beast falling below (owner); the swan flies on with the grandmother holding tight.",
     "hemmarat, hongHin, kanchai, highlands, mistSea",
     "the mountain pass",
     [("In a high mountain pass lived the Hemmarat, like a lion but with wings, as big as an elephant.",
       "ที่ช่องเขาสูง มีเหมะราช รูปร่างคล้ายสิงห์แต่มีปีก ตัวใหญ่เท่าช้าง",
       "ตี้จ่องดอยสูง มีเหมะราช ฮูปฮ่างคล้ายสิงห์ แต่มีปี๊ก ตั๋วหลวงเท่าจ๊าง"),
      ("Every day it swallowed a bull elephant whole.",
       "ทุกวันมันกลืนช้างพลายทั้งตัว",
       "กู๊วันมันกืนจ๊างพลายตึงตั๋ว"),
      ("It saw the swan, and sprang at it. With one flash of Kanchai, the beast fell into the forest.",
       "มันเห็นหงส์ ก็โผเข้าใส่ ดาบกัญชัยวาบเดียว สัตว์ร้ายก็ตกลงไปในป่า",
       "มันหันหงส์ ก่อโผเข้าใส่ ดาบกัญไจยวาบเดียว สัตว์ฮ้ายก่อต๊กลงไปในป่า")]),

    ("The brothers' crime", 60,
     "Over each giant city the swan circles; three palaces rise from them on clouds and follow it: a white prasat, a "
     "palace hall, a lotus pavilion. At the river he leaves them on the far bank and brings his grandmother across. "
     "The six wait in the camp; they seize her, surround him; dusk; they ride away on an elephant with her through "
     "the night. In the weeds, the boy lies still.",
     "hongHin, vimana (prasat, hall, lotus), thaiCloud, streamer, noble (six), elephant, grandmother",
     "the camp at dusk",
     [("On his way home, his three wives' palaces rose into the air and followed the swan.",
       "ระหว่างทางกลับ ปราสาทของชายาทั้งสามลอยขึ้นฟ้า บินตามหงส์มา",
       "ระหว่างตางปิ๊ก ปราสาทของเมียตึงสามลอยขึ้นฟ้า บินโตยหงส์มา"),
      ("At the river he left them on the far bank, and took his grandmother across alone.",
       "ที่แม่น้ำ เขาให้ทั้งสามรออยู่ฝั่งโน้น แล้วพาย่าข้ามมาคนเดียว",
       "ตี้แม่น้ำ เปิ้นหื้อตึงสามละอยู่ฝั่งพู้น แล้วปาย่าข้ามมาคนเดียว"),
      ("The six brothers were waiting. They took the old woman, fell on him all together, and killed him.",
       "พี่น้องทั้งหกรออยู่ พวกเขาแย่งย่าไป รุมทำร้ายเด็กจนตาย",
       "ปี้น้องตึงหกละอยู่ หมู่เขาแย่งเอาย่าไป รุมกั๋นตี๋ละอ่อนจ๋นต๋าย"),
      ("They left him in the weeds, put her on an elephant, and rode through the night to claim the reward.",
       "ทิ้งเขาไว้ในพงหญ้า เอาย่าขึ้นหลังช้าง แล้วรีบกลับไปรับบำเหน็จ",
       "ขว้างเปิ้นไว้ในป่าหญ้า เอาย่าขึ้นหลังจ๊าง แล้วฟ้าวปิ๊กไปฮับรางวัล")]),

    ("The three wives, and Indra", 60,
     "Morning: the three princesses cross the river and find him; Mukhawadi holds his head, Culakantha his hands, "
     "Salicanta weeps at his feet. A handsome young prince appears and offers them palaces; they turn away. A "
     "monster appears; they gather wood for a fire, to leap in and die with him (as the text, owner). An old Brahman pours medicine on the "
     "boy's chest; he breathes, sits up.",
     "ogreDaughter (three), indra, ogre, the Brahman of the White Eel, boy",
     "the riverbank in the morning",
     [("When he did not come back, the three princesses crossed the river and found him.",
       "เมื่อเขาไม่กลับมา เจ้าหญิงทั้งสามข้ามแม่น้ำมา และพบร่างของเขา",
       "เมื่อเปิ้นบ่าปิ๊กมา ลูกสาวพญายักษ์ตึงสามข้ามน้ำมา แล้วก่อหันเปิ้น"),
      ("Indra came down to test them, as a handsome prince, offering them palaces. They would have no one but their husband.",
       "พระอินทร์ลงมาทดสอบ แปลงเป็นเจ้าชายรูปงาม เสนอปราสาทให้ นางทั้งสามไม่ยอม รักแต่สามีของตน",
       "พระอินทร์ลงมาลอง แปลงเป๋นเจ้าจายฮูปงาม เอาปราสาทมาหื้อ นางตึงสามบ่ายอม ฮักก้าผัวของตั๋ว"),
      ("Then as a monster, who would eat the body. They said they would build a fire and leap into it, to die with him.",
       "แล้วแปลงเป็นยักษ์ร้าย จะกินร่างของเขา นางทั้งสามว่า จะก่อกองไฟ แล้วกระโดดเข้าไป ตายตามเขา",
       "แล้วแปลงเป๋นยักษ์ฮ้าย จะกิ๋นร่างของเปิ้น นางตึงสามว่า จะก่อไฟกองหลวง แล้วโดดเข้าไป ต๋ายไปตวยเปิ้น"),
      ("Then Indra came as an old Brahman, poured heavenly medicine on the boy's wounds, and he lived again.",
       "แล้วพระอินทร์แปลงเป็นพราหมณ์ชรา เทยาทิพย์ลงบนแผล เด็กก็ฟื้นคืนชีวิต",
       "แล้วพระอินทร์แปลงเป๋นพราหมณ์เฒ่า เทยาทิพย์ลงบนแผล ละอ่อนก่อฟื้นคืนมา")]),

    ("The grandmother speaks", 55,
     "Varanasi: the six parade with the grandmother; a victory feast being set up. Days pass; she weeps at a window. "
     "The king asks; she turns on him. The fairground: a high pavilion, a single gate, the whole city passing in. "
     "From the pavilion she sees a boy at the gate and cries out.",
     "hoKham, noble, grandmother, crowd, tung, vimana (far)",
     "the fair and its high pavilion; the single gate",
     [("In Varanasi the brothers were heroes again, and the king made ready a great feast.",
       "ที่พาราณสี พี่น้องทั้งหกเป็นวีรบุรุษอีกครั้ง พระราชาเตรียมงานเลี้ยงใหญ่",
       "ตี้ปาราณสี ปี้น้องตึงหกเป๋นคนเก่งแห๋ม พระญาเตียมงานเลี้ยงหลวง"),
      ("But his mother wept every day. Those six never saved me, she said.",
       "แต่พระมารดาร้องไห้ทุกวัน ตรัสว่า ไม่ใช่หกคนนั้นที่ช่วยข้า",
       "แต่แม่ของพระญาไห้กู๊วัน เปิ้นว่า บ่าแม่นหกคนนั้นตี้จ่วยข้า"),
      ("A shining boy on a swan of stone brought me out. They only took me from him at the river.",
       "เด็กหนุ่มขี่หงส์หินพาข้าออกมา พวกมันแค่แย่งข้าไปที่แม่น้ำ",
       "ละอ่อนขี่หงส์หินปาข้าออกมา หมู่มันก้าแย่งข้าไปตี้แม่น้ำ"),
      ("So the king built a high pavilion at the fair, and the whole city had to come in by one gate.",
       "พระราชาจึงสร้างพลับพลาสูงที่ลานงาน ให้คนทั้งเมืองเข้าทางประตูเดียว",
       "พระญาเลยแป๋งพลับพลาสูงตี้ข่วงงาน หื้อคนตึงเมืองเข้าตางประตู๋เดียว"),
      ("When the boy came through, his grandmother saw him and called out to her grandson.",
       "เมื่อเด็กเดินเข้ามา ย่าเห็นเขา ก็ร้องเรียกหลาน",
       "เมื่อละอ่อนเตียวเข้ามา ย่าหันเปิ้น ก่อฮ้องหาหลาน")]),

    ("The truth", 55,
     "The throne hall: the boy before the king tells it all; the six wives deny it; a palace maid is brought in and "
     "swears to her spotted puppy; the six wives and sons in fetters; the king's judgement; the hall empties; the "
     "king alone, his head in his hands.",
     "hoKham, noble, castWoman (six wives, a maid), fetters, puppy (in the maid's telling)",
     "the throne hall; the trial",
     [("Before the throne, the boy told it all: the puppy, the gold, the giantess, the ghouls, and the river.",
       "ต่อหน้าบัลลังก์ เด็กเล่าทุกอย่าง ลูกหมา ทองคำ นางยักษ์ ยักษ์ผีดิบ และแม่น้ำ",
       "ต่อหน้าบัลลังก์ ละอ่อนเล่ากู๊อย่าง ลูกหมา คำ ย่ายักษ์ ยักษ์ผีดิบ ละก่อแม่น้ำ"),
      ("The six wives said it was a lie, until the palace maid came, whose spotted puppy they had taken that night.",
       "สนมทั้งหกว่าโกหก จนกระทั่งนางกำนัลมา นางเป็นเจ้าของลูกหมาลายที่ถูกเอาไปคืนนั้น",
       "เมียน้อยตึงหกว่าจุ๊ จ๋นนางข้าหลวงมา นางเป๋นเจ้าของลูกหมาลายตี้ถูกเอาไปคืนนั้น"),
      ("In fetters, the six wives and their sons told the truth.",
       "เมื่อถูกจองจำ สนมทั้งหกกับลูกชายก็ยอมรับ",
       "เมื่อถูกใส่ขื่อคา เมียน้อยตึงหกกับลูกจายก่อยอมฮับ"),
      ("And they were punished severely.",
       "แล้วพวกเขาก็ถูกลงโทษอย่างหนัก",
       "แล้วหมู่เขาก่อถูกลงโทษหนักขนาด")]),

    ("Vimala's answer", 55,
     "The orchard: ministers with a palanquin and robes; Vimala sends them away. Then the king himself, on his "
     "elephant, white carpets, banners, trays of flowers; he kneels in the garden and weeps; the boy beside him. She "
     "forgives. The old gardeners are led to the palace.",
     "fieldHut, castWoman, noble, elephant (regalia), tung, khan, elder, grandmother",
     "the orchard by day",
     [("The king sent his ministers for Vimala. She sent them away.",
       "พระราชาส่งขุนนางไปรับพระนางวิมาลา พระนางไล่กลับไป",
       "พระญาส่งขุนนางไปฮับนางวิมาลา นางไล่ปิ๊กไป"),
      ("A broken bowl cannot be mended, she said. I will stay here with my son.",
       "ชามที่แตกแล้วต่อไม่ได้ นางว่า ข้าจะอยู่ที่นี่กับลูก",
       "ถ้วยตี้แตกแล้วต่อบ่าได้ นางว่า ข้าจะอยู่ตี้นี่กับลูก"),
      ("Then the king came himself, knelt in the garden, and wept, and begged her to forgive him.",
       "แล้วพระราชาเสด็จมาเอง คุกเข่าในสวน ร้องไห้ ขอให้พระนางอภัย",
       "แล้วพระญามาเอง คุกเข่าในสวน ไห้ ขอหื้อนางอภัยหื้อ"),
      ("She forgave him. And she asked one thing: that the old gardeners come with her.",
       "พระนางให้อภัย และขอเพียงอย่างเดียว ให้ตายายคนสวนไปด้วย",
       "นางอภัยหื้อ ละก่อขอเพียงอย่างเดียว หื้อป้ออุ้ยแม่อุ้ยคนสวนไปตวย")]),

    ("Hong Hin is crowned", 60,
     "The palace: three floating palaces settle inside its walls; the princesses bow to the king and Vimala. Seven "
     "days of festival: dances, music, lanterns. The crowning: water poured from conches; the bai si; white threads "
     "tied; the boy on the throne, Vimala beside him, his three wives, the grandmother, the old gardeners in new "
     "clothes. The stone swan on the palace roof, folding its wings.",
     "vimana (three), hoKham (fine), baiSri, conch, ogreDaughter, castWoman, hongHin, tung, band.js, khom",
     "the festival; the crowning",
     [("The three princesses brought their palaces down inside the palace walls.",
       "เจ้าหญิงทั้งสามนำปราสาทลงมาในกำแพงวัง",
       "ลูกสาวพญายักษ์ตึงสามเอาปราสาทลงมาในกำแปงหอคำ"),
      ("For seven days and seven nights the city danced.",
       "เจ็ดวันเจ็ดคืน ทั้งเมืองเฉลิมฉลอง",
       "เจ็ดวันเจ็ดคืน คนตึงเมืองฟ้อนกั๋นม่วนขนาด"),
      ("They poured water over him from conch shells, and called his spirits home with the bai si.",
       "เขาหลั่งน้ำจากสังข์ และทำบายศรีสู่ขวัญ",
       "เขาฮดน้ำลุ๊กหอยสังข์ ละก่อเฮียกขวัญด้วยขันบายศรี"),
      ("And the boy born of suffering became king of Varanasi.",
       "และเจ้าชายที่เกิดมาจากความทุกข์ ได้เป็นพระราชาแห่งพาราณสี",
       "ละก่อเจ้าจายตี้เกิ๊ดมาลุ๊กความตุ๊ก ได้เป๋นพระญาเมืองปาราณสี"),
      ("He ruled with his mother beside him, kindly and justly, and the stone swan kept watch from the roof.",
       "เขาครองเมืองโดยมีแม่อยู่เคียงข้าง ด้วยความเมตตาและยุติธรรม และหงส์หินก็เฝ้าอยู่บนหลังคา",
       "เปิ้นครองเมือง มีแม่อยู่ข้างข้าง ด้วยความเมตต๋าละก่อความยุติธรรม ละก่อหงส์หินก่อเฝ้าอยู่บนหลังคา")]),
]

# How each scene's place is painted (docs/kit/places.md, "Painting the scenery"; scenery.js). A first plan: each is
# looked at with the owner, scene by scene, before it is painted.
SCENERY = {
    1: "night: sceneryMoon, sceneryStars (no Milky Way); lamps on the walls (sceneryLampLight); farRange() dark hills; "
       "the forest edge a dark band the ghouls come out of",
    2: "midday in the palace: lamp-gold on the hall's woodwork (look.fine); flowering bushes in the court behind",
    3: "night in the queen's room: one lamp (sceneryLampLight); then heaven's clouds (thaiCloud) gold-lit at dawn",
    4: "dusk at the gate: scenerySun low, a warm disc; long shadows; petals in the air",
    5: "night to morning at the orchard: torch light, then a soft sunrise; flowering fruit trees (thkTreeOn), beds of "
       "flowers behind the hut, blossom framing in front",
    6: "heaven: thaiCloud banks, vimana far off, a gold glow; sceneryAir light, one butterfly",
    7: "heaven at dawn: thaiCloud, light rays; then the dive through clouds to farRange() hills and the city",
    8: "dusk at the orchard: scenerySun low; fireflies as the light goes (sceneryFireflies); lamp in the hut",
    9: "bright morning street: flowering trees, tung banners, the palace behind; petals",
    10: "hot noon at the south gate: a hard light, empty lanes, dust in the air; the sugar palm's shade",
    11: "the hall's lamp-gold; then the river at evening: water as the pine lake's, farRange() far bank",
    12: "a red-gold sky over the first giant city; painted trees in flower round the palace",
    13: "a green forest palace in morning light; then a blue city under a clear sky",
    14: "the deep forest in shade: dark trees, shafts of light, mist low; then the open sky",
    15: "dusk in the high pass: highlands, mistSea below, scenerySun low",
    16: "evening at the river camp: scenerySun low, warm; then night (sceneryMoon) over the weeds",
    17: "morning on the riverbank: mist on the water, reeds, a soft sunrise",
    18: "the fair by day: tung, flowers, crowds; a clear sky",
    19: "the throne hall: lamp-gold, deep shade at the edges",
    20: "the orchard by day: flowering fruit trees, beds of flowers, petals; the king's procession in sunlight",
    21: "festival nights: khom lanterns, lamps (sceneryLampLight), stars; the crowning by day in gold light",
}

# Names and words said the Northern way by the voice; the subtitle keeps the written form.
SAY_AS = {}

# The words most worth a native ear before the voice reads them (the plan's "Words for Pan's ear" shows them too).
ASK = [("เมืองปาราณสี", "Varanasi (the khao so writes ปารา)"),
       ("พระญา", "the king"),
       ("ป้ออุ้ยแม่อุ้ย", "the old gardener couple"),
       ("ย่า", "the prince's grandmother, the king's mother"),
       ("ย่ายักษ์เถ้า", "the old giantess (the khao so's ย่ายักข์เถ้า)"),
       ("ต้นต๋าลหลวง", "the great sugar palm (the khao so's spelling)"),
       ("หมากบ้าคำ", "the gold saba pieces"),
       ("หมากนิมแดง", "the red seeds (the khao so's)"),
       ("ดาบกัญไจย", "the sword Kanchai (the khao so's)"),
       ("ยักษ์ผีดิบ", "the ghouls"),
       ("เหมะราช", "the Hemmarat"),
       ("วิสุกัม", "Witsanukam (the khao so's)"),
       ("ละอ่อน", "the child, the boy"),
       ("สายจู๋ง", "the reins"),
       ("ขื่อคา", "fetters"),
       ("ฮดน้ำ", "to pour water over (the crowning)"),
       ("เฮียกขวัญ", "to call the spirits home"),
       ("ทุตคตขัตติวงศ์", "the prince's name, as the khao so spells it")]
