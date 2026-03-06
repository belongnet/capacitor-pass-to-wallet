## Ionic JavaScript + Capacitor Playground

This workspace package is a pure JavaScript Ionic playground for testing `@belongnet/capacitor-pass-to-wallet`.

The setup follows Ionic JavaScript quickstart structure (`@ionic/core`, custom elements pages, `ion-router`, Vite static copy for Ionic runtime).

### Run playground

```bash
bun install
bun run --filter @belongnet/capacitor-pass-to-wallet-example dev
```

### Build web assets for Capacitor

```bash
bun run --filter @belongnet/capacitor-pass-to-wallet-example build
```

### Sync with native platforms

```bash
bun run --filter @belongnet/capacitor-pass-to-wallet-example cap:sync
```

Note: Wallet methods are iOS-specific. In web browser you should expect "not implemented" responses.
