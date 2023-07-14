# twitch-extended-webos

Twitch App with extended functionalities

![Configuration Screen](https://github.com/nourlie/twitch-extended-webos/blob/master/screenshots/tw1.png?raw=true)
![Emotes example in chat](https://github.com/nourlie/twitch-extended-webos/blob/master/screenshots/tw2.png?raw=true)

## Features

- Bttv,7tv,ffz emotes
- Chat settings

## Configuration

Configuration screen can be opened by pressing 🟩 GREEN button on the remote.

## Installation

- Use [webOS Homebrew Channel](https://github.com/webosbrew/webos-homebrew-channel) - app is published in official webosbrew repo
- Use [Device Manager app](https://github.com/webosbrew/dev-manager-desktop)
- Use official webOS/webOS OSE SDK: `ares-install org.webosbrew.twitchex...ipk`
## Building and launch

```sh
# Install dependencies (need to do this only when updating local repository / package.json is changed)
npm install

npm run build-package
```

Installing:

```sh
npm run install
```

Launching:

```sh
npm run launch
```

if you want to capture all commands at once:

```sh
npm run build-package-install-run
```

## Credits

Skeleton from https://github.com/webosbrew/youtube-webos and https://github.com/TBSniller/twitch-webos
A lib from here https://github.com/Financial-Times/polyfill-library
A lib from here https://gist.github.com/adamhotep/7c9068f2196326ab79145ae308b68f9e
