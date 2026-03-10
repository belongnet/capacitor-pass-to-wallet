# [@belongnet/capacitor-pass-to-wallet](https://github.com/belongnet/capacitor-pass-to-wallet)

Allows adding `.pkpass` files to Apple Wallet.

<div align="center">
  <img src="demo.gif" alt="Demo" height="350">
</div>

## Install

```bash
bun add @belongnet/capacitor-pass-to-wallet
bunx cap sync
```

## Compatibility

| Capacitor Version | Plugin Version |
| ----------------- | -------------- |
| 7.x               | [package (v7)](https://github.com/atroo/capacitor-pass-to-wallet) |
| 8.x               | 8.x            |

## How-to & tutorials

- **[Adding Apple Wallet Passes](https://ionic.io/docs/tutorials/integrations/digitial-passes/apple-wallet-passes/adding)** — how to download a `.pkpass` and add it to Apple Wallet in a Capacitor app.
- **[Creating Apple Wallet Passes](https://ionic.io/docs/tutorials/integrations/digitial-passes/apple-wallet-passes/creating)** — how to design, sign, and deliver passes from a backend (e.g. Node/Cloudflare Worker).

## References

- **[atroo/capacitor-pass-to-wallet](https://github.com/atroo/capacitor-pass-to-wallet)** — fork for Capacitor 7.x (`@atroo/capacitor-pass-to-wallet`).
- **[NitnelavAH/capacitor-pass-to-wallet](https://github.com/NitnelavAH/capacitor-pass-to-wallet)** — original plugin (Capacitor 4–7).

## Requirements (Capacitor 8)

- `@capacitor/core` `>=8.0.0`
- iOS deployment target: `15.0+`
- Android `minSdkVersion`: `24+`
- Android build defaults in this plugin: `compileSdkVersion 36`, `targetSdkVersion 36`, Java `21`

## What's new

- `addToWallet` and `passExists` now support either `base64` or `filePath`.
- `addMultipleToWallet` now supports either `base64[]` or `filePaths[]`.
- Passing file paths avoids base64 conversion overhead when the pass file is already in local storage.

## Usage

### Add pass from base64 (existing behavior)

```ts
import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';

await CapacitorPassToWallet.addToWallet({
  base64: passBase64,
});
```

### Add pass from local file path/URI (new)

```ts
import { Filesystem, Directory } from '@capacitor/filesystem';
import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';

const { uri } = await Filesystem.getUri({
  directory: Directory.Cache,
  path: 'passes/example.pkpass',
});

await CapacitorPassToWallet.addToWallet({
  filePath: uri,
});
```

### Add multiple passes from local file URIs

```ts
await CapacitorPassToWallet.addMultipleToWallet({
  filePaths: [uri1, uri2],
});
```

### Check if pass already exists

```ts
const result = await CapacitorPassToWallet.passExists({
  filePath: uri,
});

console.log(result.passExists);
```

> [!NOTE]
> `filePath`/`filePaths` support is implemented on iOS. Android implementation in this repository is currently a placeholder.

## API

<docgen-index>

* [`addToWallet(...)`](#addtowallet)
* [`addMultipleToWallet(...)`](#addmultipletowallet)
* [`passExists(...)`](#passexists)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### addToWallet(...)

```typescript
addToWallet(options: AddToWalletOptions) => Promise<AddToWalletResult>
```

Opens Apple Wallet sheet for a single `.pkpass`.

| Param         | Type                                                              |
| ------------- | ----------------------------------------------------------------- |
| **`options`** | <code><a href="#addtowalletoptions">AddToWalletOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#addtowalletresult">AddToWalletResult</a>&gt;</code>

--------------------


### addMultipleToWallet(...)

```typescript
addMultipleToWallet(options: AddMultipleToWalletOptions) => Promise<AddToWalletResult>
```

Opens Apple Wallet sheet for multiple `.pkpass` files.

| Param         | Type                                                                              |
| ------------- | --------------------------------------------------------------------------------- |
| **`options`** | <code><a href="#addmultipletowalletoptions">AddMultipleToWalletOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#addtowalletresult">AddToWalletResult</a>&gt;</code>

--------------------


### passExists(...)

```typescript
passExists(options: AddToWalletOptions) => Promise<PassExistsResult>
```

Checks whether a pass already exists in Apple Wallet.

| Param         | Type                                                              |
| ------------- | ----------------------------------------------------------------- |
| **`options`** | <code><a href="#addtowalletoptions">AddToWalletOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#passexistsresult">PassExistsResult</a>&gt;</code>

--------------------


### Interfaces


#### AddToWalletResult

| Prop        | Type                | Description                                                           |
| ----------- | ------------------- | --------------------------------------------------------------------- |
| **`value`** | <code>string</code> | Operation status. Returns `"added"` when the pass sheet is presented. |


#### AddToWalletOptions

| Prop           | Type                | Description                                                                                                          |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **`base64`**   | <code>string</code> | Base64-encoded `.pkpass` file content. Optional when `filePath` is provided.                                         |
| **`filePath`** | <code>string</code> | Native file path/URI to a `.pkpass` file (for example from `Filesystem.getUri`). Optional when `base64` is provided. |


#### AddMultipleToWalletOptions

| Prop            | Type                  | Description                                                                            |
| --------------- | --------------------- | -------------------------------------------------------------------------------------- |
| **`base64`**    | <code>string[]</code> | List of base64-encoded `.pkpass` file contents. Optional when `filePaths` is provided. |
| **`filePaths`** | <code>string[]</code> | List of native file paths/URIs to `.pkpass` files. Optional when `base64` is provided. |


#### PassExistsResult

| Prop             | Type                 | Description                                              |
| ---------------- | -------------------- | -------------------------------------------------------- |
| **`passExists`** | <code>boolean</code> | `true` if the pass is already available in Apple Wallet. |

</docgen-api>

---

**License:** MIT
