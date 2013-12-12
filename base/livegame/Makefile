all: game.js img/magic.png

clean: 
	rm -f src/game.js
	rm -f game.js

src/game.js: src/game.ls
	lsc -c src/game.ls

game.js: src/game.js
	browserify src/game.js -o game.js

img/magic.png: img/magic.base.png
	convert img/magic.base.png -scale 512x512 img/magic.png
