import { WebPlugin } from '@capacitor/core';

import type { CapacitorPassToWalletPlugin } from './definitions';

export class CapacitorPassToWalletWeb extends WebPlugin implements CapacitorPassToWalletPlugin {
  canAddPasses(): Promise<{ canAddPasses: boolean }> {
    throw new Error('Method not implemented on web.');
  }
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
  passExistsById(options: { passTypeIdentifier: string; serialNumber?: string }): Promise<{ passExists: boolean }> {
    console.log(options.passTypeIdentifier, options.serialNumber, 'Method not implemented on web.');
    throw new Error('Method not implemented on web.');
  }
  openPassInWallet(options: { passTypeIdentifier: string; serialNumber?: string }): Promise<{ opened: boolean }> {
    console.log(options.passTypeIdentifier, options.serialNumber, 'Method not implemented on web.');
    throw new Error('Method not implemented on web.');
  }
  removePass(options: { passTypeIdentifier: string; serialNumber?: string }): Promise<{ removed: boolean }> {
    console.log(options.passTypeIdentifier, options.serialNumber, 'Method not implemented on web.');
    throw new Error('Method not implemented on web.');
  }
  listPasses(): Promise<{ passes: Array<{ passTypeIdentifier: string; serialNumber: string; organizationName?: string }> }> {
    throw new Error('Method not implemented on web.');
  }
}
