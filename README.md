# WORDUP

A clean, fast Wordle-inspired word game built with React, TypeScript, and Vite.

[Play WORDUP](https://adamjpena.github.io/wordle-clone/)

## Features

- Six-guess word puzzle with physical and on-screen keyboard support
- Accurate tile scoring for duplicate letters
- Per-letter keyboard feedback for absent, present, and correct guesses
- Local win stats, streaks, and guess distribution
- Lightweight static deployment through GitHub Pages

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest
- Sass modules

## Getting Started

Use Node `22.12.0` or newer.

```bash
npm install
npm run dev
```

The dev server runs at [http://localhost:5173/wordle-clone/](http://localhost:5173/wordle-clone/).

## Scripts

```bash
npm run dev        # start local development
npm run typecheck  # run TypeScript checks
npm test -- --run  # run the test suite once
npm run build      # create a production build
npm run preview    # preview the production build locally
npm run deploy     # publish dist/ to GitHub Pages
```

## Deployment

The app is built with Vite using `/wordle-clone/` as its base path. `npm run deploy` builds the app and publishes `dist/` to the repository's `gh-pages` branch.

## Notes

WORDUP is an independent Wordle-inspired project. It is not affiliated with The New York Times.
