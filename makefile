
all:
	./node_modules/.bin/babel src -d .
	chmod +x index.js

clean:
	rm -rf index.js lib
