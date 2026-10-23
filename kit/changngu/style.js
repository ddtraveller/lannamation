// style.js - the style of the film of Chang Ngu (ตำนานช้างงู), read by the kit as it loads. Every page of the film
// loads it first, before oldcartoon.js: each scene's own page and the film's, so all of them draw alike. As the first
// tale's (maeng/style.js): the sheet is 1920 wide at two device pixels to a film pixel; nobody hops (people stand still
// and walk evenly); the old print shows at six tenths; the light comes from the upper left. Its words are lettered in
// web fonts its pages load, Noto Sans Thai and Gelasio (made to Georgia's measure), so the laptop and the Spark render
// them alike (owner, 2026-10-23: "Same open fonts").
window.FILM_STYLE = {wide: 1920, pixels: 2, hop: false, film: 0.6, light: [-0.6, 0.5],
                     letters: {thai: "'Noto Sans Thai'", latin: "Gelasio"}};
