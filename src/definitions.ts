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
}
