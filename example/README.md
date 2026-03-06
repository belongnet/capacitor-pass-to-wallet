## Ionic Vue + Capacitor Playground

This workspace package is an Ionic Vue playground for testing `@belongnet/capacitor-pass-to-wallet`.

The example now uses:

- `vue@3.5`
- `@ionic/vue`
- `@ionic/vue-router`
- `vite`

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

Note: Wallet methods are iOS-specific. In web browser you should expect "not implemented" responses from the plugin methods.
