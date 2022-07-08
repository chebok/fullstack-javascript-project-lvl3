install:
		npm ci # установка
test:
		DEBUG=nock.* NODE_OPTIONS=--experimental-vm-modules npx jest
lint:
		npx eslint . # eslinting