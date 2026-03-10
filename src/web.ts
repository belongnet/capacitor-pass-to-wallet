import { WebPlugin } from '@capacitor/core';

import type { CapacitorPassToWalletPlugin } from './definitions';

export class CapacitorPassToWalletWeb extends WebPlugin implements CapacitorPassToWalletPlugin {
  addMultipleToWallet(options: { base64?: string[]; filePaths?: string[] }): Promise<{ value: string }> {
    console.log(options.base64, options.filePaths, 'Method not implemented on web.');
    throw new Error('Method not implemented.');
  }
  addToWallet(options: { base64?: string; filePath?: string }): Promise<{ value: string }> {
    console.log(options.base64, options.filePath, 'Method not implemented on web.');
    throw new Error('Method not implemented on web.');
  }
  passExists(options: { base64?: string; filePath?: string }): Promise<{ passExists: boolean }> {
    console.log(options.base64, options.filePath, 'Method not implemented on web.');
    throw new Error('Method not implemented on web.');
  }
}
