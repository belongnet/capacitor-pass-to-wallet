export interface AddToWalletOptions {
  /**
   * Base64-encoded `.pkpass` file content.
   */
  base64: string;
}

export interface AddMultipleToWalletOptions {
  /**
   * List of base64-encoded `.pkpass` file contents.
   */
  base64: string[];
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
