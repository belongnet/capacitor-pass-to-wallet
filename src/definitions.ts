export interface AddToWalletOptions {
  /**
   * Base64-encoded `.pkpass` file content.
   *
   * Optional when `filePath` is provided.
   */
  base64?: string;

  /**
   * Native file path/URI to a `.pkpass` file (for example from `Filesystem.getUri`).
   *
   * Optional when `base64` is provided.
   */
  filePath?: string;
}

export interface AddMultipleToWalletOptions {
  /**
   * List of base64-encoded `.pkpass` file contents.
   *
   * Optional when `filePaths` is provided.
   */
  base64?: string[];

  /**
   * List of native file paths/URIs to `.pkpass` files.
   *
   * Optional when `base64` is provided.
   */
  filePaths?: string[];
}

export interface AddToWalletResult {
  /**
   * Operation status. Returns `"added"` when the pass sheet is presented.
   */
  value: string;
}

export interface PassExistsResult {
  /**
   * `true` if the pass is already available in Apple Wallet.
   */
  passExists: boolean;
}

export interface PassIdentifierOptions {
  /**
   * Wallet pass type identifier (for example `pass.com.example.membership`).
   */
  passTypeIdentifier: string;

  /**
   * Optional serial number to target a specific pass instance.
   */
  serialNumber?: string;
}

export interface CanAddPassesResult {
  /**
   * `true` when the device can present add-to-wallet flow.
   */
  canAddPasses: boolean;
}

export interface OpenPassInWalletResult {
  /**
   * `true` when a matching pass was found and open action was started.
   */
  opened: boolean;
}

export interface RemovePassResult {
  /**
   * `true` when a matching pass was removed from wallet.
   */
  removed: boolean;
}

export interface WalletPassSummary {
  /**
   * Wallet pass type identifier (for example `pass.com.example.membership`).
   */
  passTypeIdentifier: string;

  /**
   * Pass serial number.
   */
  serialNumber: string;

  /**
   * Organization name from pass payload when available.
   */
  organizationName?: string;
}

export interface ListPassesResult {
  /**
   * Passes currently visible in the wallet library.
   */
  passes: WalletPassSummary[];
}

export interface CapacitorPassToWalletPlugin {
  /**
   * Opens Apple Wallet sheet for a single `.pkpass`.
   */
  addToWallet(options: AddToWalletOptions): Promise<AddToWalletResult>;

  /**
   * Opens Apple Wallet sheet for multiple `.pkpass` files.
   */
  addMultipleToWallet(options: AddMultipleToWalletOptions): Promise<AddToWalletResult>;

  /**
   * Checks whether a pass already exists in Apple Wallet.
   */
  passExists(options: AddToWalletOptions): Promise<PassExistsResult>;

  /**
   * Checks whether a pass exists by identifier and optional serial number.
   */
  _experimental_passExistsById(options: PassIdentifierOptions): Promise<PassExistsResult>;

  /**
   * Returns whether device can add passes.
   */
  _experimental_canAddPasses(): Promise<CanAddPassesResult>;

  /**
   * Opens an existing pass in Apple Wallet by identifier.
   */
  _experimental_openPassInWallet(options: PassIdentifierOptions): Promise<OpenPassInWalletResult>;

  /**
   * Removes an existing pass from Apple Wallet by identifier.
   */
  _experimental_removePass(options: PassIdentifierOptions): Promise<RemovePassResult>;

  /**
   * Lists wallet passes visible to the app.
   */
  _experimental_listPasses(): Promise<ListPassesResult>;
}
