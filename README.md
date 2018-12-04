# backend.ai-admin-console

Web-based Backend.AI administration GUI console.

## Develop and Test

```
$ npm install -g polymer-cli
$ npm install
$ polymer serve --npm
```

## Build (Web)

Default setup will build `es6-unbundled`.

```
$ polymer build
```

## Build (Electron App)

### Using makefile

```
$ make mac
$ make win (not yet working)
$ make linux (not yet working)
```

### Manual run (using local Electron)

```
$ polymer build
$ cd build/es6-unbundled
$ npm install --only=prod
$ cd ../..
$ npm start
```
