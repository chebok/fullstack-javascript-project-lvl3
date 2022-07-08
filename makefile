install:
		npm ci # установка
test:
		DEBUG=page-loader,axios NODE_OPTIONS=--experimental-vm-modules npx jest
lint:
		npx eslint . # eslinting