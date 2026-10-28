# What the weaving motifs mean, in the sources' own words

The meanings of `LAI_MEANS` in `kit/weaving.js` (owner, 2026-10-28: the kit carries what its symbols mean). Each
was first given by the NotebookLM notebook "Lanna Thai weaving iconography: symbols, archetypes and patterns"
(`268fba1d-6fd8-4bca-8aec-0753a056f560`, 25 sources), asked motif by motif, and then **found in the source's own
text**: a meaning that could not be found there is not in the kit. The sources are in copyright, so each gets a
short quotation and its link. The Thai is the PDFs' text with its tone marks put back in order (a PDF's text puts
some of them after the vowel).

Checking the answers against the text changed them both ways:

- **Taken out, never in any source.** The kit had the hook "holding fast to fortune", paired birds "faithfulness"
  and the quail "care of the home", from the first weaving notebook's answers of 2026-10-24
  (`71327141-3b7a-44c3-8e99-5edb24305197`). Neither notebook's sources say any of them (searched in Thai and
  English: the only "fortune" is a shop's "we had the good fortune to be invited"). The notebook's new answers
  added kinship to flowing water and fern shoots to the hook; the text says neither, and they are not in the kit.
- **Put in, though the notebook said "not in the sources".** The lantern (kom) and the bowl (khan): the Mae Chaem
  paper names both among the Buddhist signs of a Mae Chaem hem.

## Most motifs carry no meaning, by the sources' own word

The Nan thesis says the base motifs, the diamond unit (ลายหน่วย), the triangle (ลายกาบ), the hook (ลายขอ) and the
zigzag, are where the others come from, "ลวดลายพื้นฐานที่อาจไม่มีความหมายใด ๆ" (base motifs that may carry no
meaning at all), and that a meaning comes with the figures made of them: "เป็นลวดลายที่มีความหมายในเชิงสัญลักษณ์
อันสืบเนื่องมาจากธรรมชาติ จินตนาการ ความเชื่อ" (motifs with a symbolic meaning, from nature, imagination, belief).
So 30 of the 57 motifs have `means: null`.

## The three realms

Two Tai Lue sources give where Tai cosmology puts the figures on a cloth, in nearly the same words: "มอม/สิงค์
ตำแหน่งการวางลายจะอยู่ตรงกลาง (พื้นดิน) บนฟ้า (ด้านบน) เป็นอาณาจักรของนก ด้านล่างเป็นบาดาลหรือใต้ดินเป็นอาณาจักรของ
งู/นาค" (the Mom or lion is placed in the middle, the ground; the sky, above, is the realm of birds; below is the
underworld, beneath the earth, the realm of snakes and naga): the Tai Lue thesis and the Chiang Kham paper. That is
`realm`. It is said of Tai Lue cloth: `checks/lai_check.py` lists the realms down each teen jok and never fails on
their order.

## The motifs

| Motif | What the kit says | The source's words |
|---|---|---|
| `kap` | a bamboo sheath, some say; others, a house's gable (Tai Lue) | ลายกาบ "บางความเชื่อสื่อถึงกาบไผ่ บางที่สื่อถึงหน้าจั่วบ้าน" [lue] |
| `khruaKho` | belonging to one's people, duty to one's family (Tai Lue) | "ลวดลายที่แสดงความเป็นพวกพ้อง และหน้าที่ต่อคนในครอบครัว ได้แก่ ลายขอเครือ ..." [chiangKham] |
| `buaLoy` | the light of wisdom; flourishing | "ลายบัวลอย ความหมายของลายคือ ความสว่างทางปัญญา เฟื่องฟู" [boSuak] |
| `chanPaetKleeb` | a blessed flower; on a Tai Lue tung, the eight directions | "ลายจันแปดกลีบ ความหมายของลายคือ ดอกไม้มงคล" [boSuak]; "'Dok Chan Paet Klip' (eight-petal flowers) symbolises the eight directions" [banner] |
| `dokKaeo` | a blessed flower; like the ta laew that marks sacred ground | "ลายดอกแก้ว ความหมายของลายคือ ดอกไม้มงคล" [boSuak]; "ลายดอกแก้วยังคล้ายคลึงกับ 'ตาแหลว' ที่เป็นงานจักสานไม้ไผ่ใช้เป็นสัญลักษณ์แสดงเขตพื้นที่ศักดิ์สิทธิ์ หรือใช้ป้องกันผีร้าย" [mueangNgoen] |
| `nok` | nature and plenty (Tai Lue) | "ลายนก/ไก่น้อย : สื่อถึงความเป็นธรรมชาติและความอุดมสมบูรณ์ มักปรากฏคู่กับลายม้า" [lue] |
| `nokKhu`, `nokKhuTon` | paired birds: plenty and worship | "ลายนกคู่-ไก่คู่ ความหมายของลายคือ ความอุดมสมบูรณ์ การบูชา" [boSuak] |
| `hongPloi`, `hongBi`, `hongKhu` | the hong: a Buddhist sign (Mae Chaem); the ancestors and the journey after death (Tai Lue) | "โคม ขัน นาค หงส์ น้ำต้น สะเปา อันเป็นสัญลักษณ์สำคัญทางพุทธศาสนาอันหมายถึง เขาพระสุเมรุ ทะเลสีทันดร สัตว์หิมพานต์" [maeChaem]; "ลายหงส์ ลายนาค เป็นรูปสัญลักษณ์เก่าแก่ที่เชื่อมโยงกับคติเชื่อเรื่องวิญญาณบรรพบุรุษและการเดินทางไปยังโลกหลังความตาย" [lue] |
| `nak`, `nakKum` | fertility, rain, the rivers; the rainbow; the ancestors | "นาคในความหมายเก่าของท้องถิ่นเป็นสัญลักษณ์แห่งอวัยวะเพศชาย เป็นผู้บันดาลสายฝน และคุ้มครองแม่น้ำ ... เมื่อท้องถิ่นรับพุทธศาสนาเข้ามา นาคได้หมายถึงสายรุ้ง" [thaiLao]; "ลายงู/นาค/ลวง : สื่อถึงคติความเชื่อดั้งเดิมในการนับถือผีบรรพบุรุษและธรรมชาติผู้ให้กำเนิดสรรพสิ่ง" [lue] |
| `chang` | wisdom, leading, greatness, wealth | "ลายช้าง : สื่อถึงสติปัญญา ความเป็นผู้นำ ความยิ่งใหญ่ความเจริญรุ่งเรือง อำนาจ วาสนา และฐานะทางสังคมที่เชื่อมโยงกับทรัพย์สมบัติ ดังคำผู้เฒ่าผู้แก่อวยพร 'มีช้างมีม้า 3 ใต้ถุนเรือน'" [lue], also [chiangKham], [mueangNgoen] |
| `ma` | plenty; with a rider or a bird, a carrier, and endurance | "ลายม้า ... สื่อถึงความอุดมสมบูรณ์ของธรรมชาติ หากบางที่มีรูปคนขี่ม้าหรือนกเกาะอยู่บนหลังม้าจะสื่อถึงพาหนะ และความอดทน" [lue] |
| the bowls (`khan...`), the lanterns (`kom...`) | a Buddhist sign of a Mae Chaem hem | the Mae Chaem passage above [maeChaem] |
| `sapaoLoiNam`, `hangSapao` | a Buddhist sign; the boat to the world of spirits | the Mae Chaem passage above; "เรือ หรือ 'แม่นอนทราย' พาหนะที่จะนำปราสาท และสิ่งของเครื่องใช้ไปยังโลกแห่งวิญญาณ" [chiangKham] |
| `prasat` | the castle at the heart of a Tai Lue tung | "the castle ranges from 3-9 levels in height ... which is unique to the Tai Lue Tung" [banner]; the boat above [chiangKham] |
| `phuKhao` | obstacles, tangles | "ลายล้วงภูเขา ความหมายของลายคือ อุปสรรค ความซับซ้อน" [boSuak] |
| `namLai` | the stream, passing past obstacles; the Nan river of the Tai Lue's move | "ลายน้ำไหล ความหมายของลายคือ สายน้ำและความราบรื่นจากอุปสรรค" [boSuak]; "ลายน้ำไหล : สันนิษฐานว่าน่าจะเกิดจากการเลียนแบบมาจากสายน้ำน่าน ตอนที่ถูกกวาดต้อนมาจากสิบสองพันนา" [lue] |
| `maiSin` | the weaver's own mark | "ช่างทอจะจบลงด้วยลวดลายพิเศษเพื่อเป็นเครื่องหมายเฉพาะของผู้ทอ เรียกว่า 'หมายซิ่น' เพื่อแสดงความเป็นเจ้าของหรือป้องกันการถูกลักขโมย" [long] |

`nokKum` has a realm (a bird) and no meaning: the sources only name it, among Mae Chaem's eleven master motifs.

## The sources

| Key | Source |
|---|---|
| boSuak | อรรถพงษ์ ประดิษฐพงษ์, การจัดการความรู้ผ้าตีนจกเมืองน่าน, Silpakorn University thesis: its list of meanings follows "เกณฑ์ลวดลายและความหมายของลวดลายผ้าซิ่นเมืองน่าน จากกลุ่มทอผ้า ตำบลบ่อสวก" (the weaving group of Bo Suak, Mueang Nan). [PDF](http://ithesis-ir.su.ac.th/dspace/bitstream/123456789/901/1/54112311%20%E0%B8%AD%E0%B8%A3%E0%B8%A3%E0%B8%96%E0%B8%9E%E0%B8%87%E0%B8%A9%E0%B9%8C%20%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B4%E0%B8%A9%E0%B8%90%E0%B8%9E%E0%B8%87%E0%B8%A9%E0%B9%8C.pdf) |
| lue | วรุษา อุตระ (2567), การส่งต่อวัฒนธรรมผ้าไทลื้อ ..., Silpakorn University thesis. [PDF](http://ithesis-ir.su.ac.th/dspace/bitstream/123456789/5484/1/620430028.pdf) |
| chiangKham | ลายผ้าทอชาติพันธุ์ไทลื้อ: สัญวิทยาและบทบาท ..., วารสารมนุษยสังคมปริทัศน์ 26 (2), 2567. [ThaiJO](https://so05.tci-thaijo.org/index.php/hspbruacthjournal/article/download/277661/184530) |
| maeChaem | วารสารศิลปศาสตร์ มทร.กรุงเทพ 3 (2), 2564, pp. 25-36 (the eleven master motifs of Mae Chaem). [ThaiJO](https://so02.tci-thaijo.org/index.php/larts-journal/article/download/247740/171085) |
| thaiLao | สื่อสัญลักษณ์ความเชื่อสู่อัตลักษณ์ผ้าทอไทย-ลาว, Journal of Liberal Arts (Wang Nang Leng) RMUTP 1 (1), 2021. [ThaiJO](https://so07.tci-thaijo.org/index.php/LiberalJ/article/download/1307/893) |
| mueangNgoen | วัฒนธรรมผ้าทอไทลื้อในเมืองเงิน, Chiang Mai University thesis, 2556, chapter 4. [PDF](https://archive.lib.cmu.ac.th/full/T/2556/regio41256ms_ch4.pdf) |
| banner | The Buddhist Banner: Identity and Aestheticism in the Dimension of Meaning Reflection on the Tai Lue Ethnic Group. [ResearchGate](https://www.researchgate.net/publication/368320260_The_Buddhist_Banner_Identity_and_Aestheticism_in_the_Dimension_of_Meaning_Reflection_on_the_Tai_Lue_Ethnic_Group_Education) |
| long | กรมหม่อนไหม (Department of Sericulture), ผ้าจกเมืองลอง. [page](https://qsds.go.th/silkcotton/k_11.php) |
