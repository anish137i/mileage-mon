# Milage Mon application 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started
0. Create Env

   ```bash
   cp example.env .env
   ```

1. Install dependencies

   ```bash
   npx expo install
   ```

2. Start dev app

   ```bash
   npx expo start
   ```

## Build for Android

#### check if EAS not installed 

```bash
npx eas -v


```

#### Install EAS
```bash
npm i -g eas-cli

```

#### Check is EAS is login
```bash

npx eas whoami

```

#### Login in EAS (Use Google)

```bash

npx eas login

```

#### Build Android for AAp

```bash
npx eas build --platform android

```
