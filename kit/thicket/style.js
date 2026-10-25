// style.js - the style of the film "Through the flowers" (thicket/), read by the kit as it loads. Every page of the
// film loads it first, before oldcartoon.js, so each scene's own page and the film's draw alike. As the tales': the
// sheet is 1920 wide at two device pixels to a film pixel, and the light comes from the upper left; the old print
// shows at three tenths only, as the film is a walk through the flowers in clear light.
window.FILM_STYLE = {wide: 1920, pixels: 2, film: 0.3, light: [-0.6, 0.5]};
