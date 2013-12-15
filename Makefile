
all: src/game.js game.js

src/game.js: src/game.ls
	lsc -c src/game.ls

game.js:
	browserify src/game.js -o game.js

clean:
	rm -f game.js src/game.js

