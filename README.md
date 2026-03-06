# capacitor-pass-to-wallet

Allows adding `.pkpass` files to Apple Wallet.

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

| Prop         | Type                | Description                            |
| ------------ | ------------------- | -------------------------------------- |
| **`base64`** | <code>string</code> | Base64-encoded `.pkpass` file content. |


#### AddMultipleToWalletOptions

| Prop         | Type                  | Description                                     |
| ------------ | --------------------- | ----------------------------------------------- |
| **`base64`** | <code>string[]</code> | List of base64-encoded `.pkpass` file contents. |


#### PassExistsResult

| Prop             | Type                 | Description                                              |
| ---------------- | -------------------- | -------------------------------------------------------- |
| **`passExists`** | <code>boolean</code> | `true` if the pass is already available in Apple Wallet. |

</docgen-api>

---

**License:** MIT
