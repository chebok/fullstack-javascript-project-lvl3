install:
		npm ci # установка
test:
		NODE_OPTIONS=--experimental-vm-modules npx jest
lint:
		npx eslint . # eslinting