# Credit Cards Demo

A modernised checkout sandbox built with React and [react-credit-cards](https://github.com/amarofashion/react-credit-cards). Type card data, watch the preview update instantly, and review the payload you would send to your payments API.

## Highlights

- **Real-time formatting** for number, expiry, and CVC fields.
- **Issuer detection** powered by Payment.js to mirror the look of real cards.
- **Inline validation** with accessible messaging to reduce form errors.
- **Responsive layout** featuring a glassmorphism treatment and curated card presets.

## Getting started

```bash
npm install
npm start
```

The demo runs at `http://localhost:3000`.

## Scripts

- `npm start` – start the development server with hot reloading.
- `npm run build` – produce an optimized production build in `build/`.
- `npm test` – run tests in watch mode (none are defined yet).

## Project structure

```
public/       Static assets and HTML shell
src/          React components, styles, and helpers
```

Key files:

- `src/App.js` – payment form container, preview, and payload presenter.
- `src/Cards.js` – gallery of supported card presets.
- `src/utils.js` – formatting helpers and validation wrappers.
- `src/styles.css` – dark theme layout and component styling.

## Credits

Built by [Arnaldo Gonzalez](https://agonzalez.netlify.app/) using [react-credit-cards](https://github.com/amarofashion/react-credit-cards).