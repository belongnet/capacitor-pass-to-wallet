import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { computed, ref } from 'vue';
import { fileToBase64, normalizeBase64, passUrlToBase64 } from '../utils/pass';

type ResultPayload = Record<string, unknown>;
export type ExampleKey = 'example1' | 'example2';
type LoadedMode = 'base64' | 'filePath' | null;

interface UseWalletActionsReturn {
  passUrl: ReturnType<typeof ref<string>>;
  loadedCount: ReturnType<typeof computed<number>>;
  loadedSourceLabel: ReturnType<typeof ref<string>>;
  addActionLabel: ReturnType<typeof computed<string>>;
  resultLabel: ReturnType<typeof ref<string>>;
  resultVersion: ReturnType<typeof ref<number>>;
  resultPayload: ReturnType<typeof ref<ResultPayload>>;
  isLoading: ReturnType<typeof ref<boolean>>;
  loadFromUrl: () => Promise<void>;
  loadFromFiles: (files: File[] | FileList | null | undefined) => Promise<void>;
  loadFromExamples: (exampleKeys: ExampleKey[]) => Promise<void>;
  loadExampleUrisFromCache: (exampleKeys: ExampleKey[]) => Promise<void>;
  addLoadedToWallet: () => Promise<void>;
  checkLoadedPassExists: () => Promise<void>;
}

const EXAMPLE_FILES: Record<ExampleKey, string> = {
  example1: '/example1.pkpass',
  example2: '/example2.pkpass',
};

const EXAMPLE_CACHE_FOLDER = 'wallet-example-passes';

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function normalizeList(base64List: string[]): string[] {
  return base64List.map((item) => normalizeBase64(item)).filter(Boolean);
}

export function useWalletActions(): UseWalletActionsReturn {
  const passUrl = ref('');
  const loadedBase64 = ref<string[]>([]);
  const loadedFilePaths = ref<string[]>([]);
  const loadedMode = ref<LoadedMode>(null);
  const loadedCount = computed(() =>
    loadedMode.value === 'filePath' ? loadedFilePaths.value.length : loadedBase64.value.length,
  );
  const loadedSourceLabel = ref('No pass loaded');
  const addActionLabel = computed(() => (loadedCount.value <= 1 ? 'Add To Wallet' : 'Add Multiple To Wallet'));
  const resultLabel = ref('Ready');
  const resultVersion = ref(0);
  const resultPayload = ref<ResultPayload>({
    platformHint:
      'Wallet actions require iOS device/simulator with Apple Wallet support. Web returns not implemented.',
  });
  const isLoading = ref(false);

  function setResult(label: string, payload: ResultPayload) {
    resultLabel.value = label;
    resultPayload.value = payload;
    resultVersion.value += 1;
  }

  async function runAction(label: string, action: () => Promise<ResultPayload>) {
    isLoading.value = true;
    try {
      const data = await action();
      setResult(label, data);
    } catch (error) {
      setResult(`${label} error`, {
        message: toErrorMessage(error),
      });
    } finally {
      isLoading.value = false;
    }
  }

  function clearLoadedValues() {
    loadedBase64.value = [];
    loadedFilePaths.value = [];
    loadedMode.value = null;
  }

  function setLoadedPasses(base64List: string[], sourceLabel: string) {
    clearLoadedValues();
    loadedBase64.value = normalizeList(base64List);
    loadedMode.value = 'base64';
    loadedSourceLabel.value = sourceLabel;
  }

  function setLoadedFileUris(filePaths: string[], sourceLabel: string) {
    clearLoadedValues();
    loadedFilePaths.value = filePaths.map((value) => String(value || '').trim()).filter(Boolean);
    loadedMode.value = 'filePath';
    loadedSourceLabel.value = sourceLabel;
  }

  function getLoadedBase64Passes(): string[] {
    const normalized = normalizeList(loadedBase64.value);
    if (!normalized.length) {
      throw new Error('Load at least one .pkpass first');
    }
    return normalized;
  }

  function getLoadedFilePaths(): string[] {
    const normalized = loadedFilePaths.value.map((item) => String(item || '').trim()).filter(Boolean);
    if (!normalized.length) {
      throw new Error('Load at least one .pkpass file URI first');
    }
    return normalized;
  }

  function validateNonEmpty(value: string, fieldName: string): string {
    const normalized = String(value || '').trim();
    if (!normalized) {
      throw new Error(`${fieldName} is required`);
    }
    return normalized;
  }

  async function loadFromUrl() {
    await runAction('load(url)', async () => {
      const url = validateNonEmpty(passUrl.value, 'Pass URL');
      const base64 = await passUrlToBase64(url);
      setLoadedPasses([base64], `Loaded from URL: ${url}`);
      return { message: 'Loaded 1 pass from URL', url };
    });
  }

  async function loadFromFiles(files: File[] | FileList | null | undefined) {
    await runAction('load(file)', async () => {
      const list = Array.from(files ?? []);
      if (!list.length) {
        throw new Error('Please choose one or more .pkpass files');
      }

      const base64List = await Promise.all(list.map((file) => fileToBase64(file)));
      setLoadedPasses(
        base64List,
        list.length === 1 ? `Loaded from file: ${list[0].name}` : `Loaded from files: ${list.length}`,
      );
      return {
        message: `Loaded ${list.length} file(s)`,
        files: list.map((file) => ({ name: file.name, size: file.size })),
      };
    });
  }

  async function loadFromExamples(exampleKeys: ExampleKey[]) {
    await runAction('load(example)', async () => {
      const keys = Array.from(new Set(exampleKeys));
      if (!keys.length) {
        throw new Error('Choose at least one test example');
      }

      const files = keys.map((key) => EXAMPLE_FILES[key]);
      const base64List = await Promise.all(files.map((path) => passUrlToBase64(path)));
      const names = keys.map((key) => `${key}.pkpass`);
      setLoadedPasses(
        base64List,
        names.length === 1 ? `Loaded test file: ${names[0]}` : `Loaded test files: ${names.join(', ')}`,
      );
      return {
        message: `Loaded ${keys.length} test file(s)`,
        files: names,
      };
    });
  }

  async function cacheExampleAsFileUri(key: ExampleKey): Promise<{ key: ExampleKey; path: string; uri: string }> {
    const sourcePath = EXAMPLE_FILES[key];
    const base64 = await passUrlToBase64(sourcePath);
    const fileName = `${key}-${Date.now()}-${Math.floor(Math.random() * 10000)}.pkpass`;
    const relativePath = `${EXAMPLE_CACHE_FOLDER}/${fileName}`;

    await Filesystem.writeFile({
      path: relativePath,
      directory: Directory.Cache,
      data: base64,
      recursive: true,
    });

    const { uri } = await Filesystem.getUri({
      path: relativePath,
      directory: Directory.Cache,
    });

    return { key, path: relativePath, uri };
  }

  async function loadExampleUrisFromCache(exampleKeys: ExampleKey[]) {
    await runAction('load(example:file-uri)', async () => {
      const keys = Array.from(new Set(exampleKeys));
      if (!keys.length) {
        throw new Error('Choose at least one test example');
      }

      const files = await Promise.all(keys.map((key) => cacheExampleAsFileUri(key)));
      setLoadedFileUris(
        files.map((item) => item.uri),
        files.length === 1 ? `Loaded file URI from cache: ${files[0].path}` : `Loaded ${files.length} file URIs from cache`,
      );

      return {
        message: `Saved ${files.length} file(s) to cache and loaded as file URI`,
        files,
      };
    });
  }

  async function addLoadedToWallet() {
    await runAction('addToWallet(auto)', async () => {
      if (loadedMode.value === 'filePath') {
        const filePaths = getLoadedFilePaths();
        if (filePaths.length === 1) {
          const result = await CapacitorPassToWallet.addToWallet({ filePath: filePaths[0] });
          return { inputMode: 'filePath', mode: 'single', filePath: filePaths[0], ...result };
        }

        const result = await CapacitorPassToWallet.addMultipleToWallet({ filePaths });
        return { inputMode: 'filePath', mode: 'multiple', count: filePaths.length, filePaths, ...result };
      }

      const base64 = getLoadedBase64Passes();
      if (base64.length === 1) {
        const result = await CapacitorPassToWallet.addToWallet({ base64: base64[0] });
        return { inputMode: 'base64', mode: 'single', ...result };
      }

      const result = await CapacitorPassToWallet.addMultipleToWallet({ base64 });
      return { inputMode: 'base64', mode: 'multiple', count: base64.length, ...result };
    });
  }

  async function checkLoadedPassExists() {
    await runAction('passExists', async () => {
      if (loadedMode.value === 'filePath') {
        const filePaths = getLoadedFilePaths();
        if (filePaths.length !== 1) {
          throw new Error('passExists requires exactly one loaded pass');
        }
        const result = await CapacitorPassToWallet.passExists({ filePath: filePaths[0] });
        return {
          inputMode: 'filePath',
          filePath: filePaths[0],
          ...result,
          message: result.passExists
            ? 'Pass already exists in Apple Wallet.'
            : 'Pass was not found in Apple Wallet. You can add it now.',
        };
      }

      const base64 = getLoadedBase64Passes();
      if (base64.length !== 1) {
        throw new Error('passExists requires exactly one loaded pass');
      }
      const result = await CapacitorPassToWallet.passExists({ base64: base64[0] });
      return {
        inputMode: 'base64',
        ...result,
        message: result.passExists
          ? 'Pass already exists in Apple Wallet.'
          : 'Pass was not found in Apple Wallet. You can add it now.',
      };
    });
  }

  return {
    passUrl,
    loadedCount,
    loadedSourceLabel,
    addActionLabel,
    resultLabel,
    resultVersion,
    resultPayload,
    isLoading,
    loadFromUrl,
    loadFromFiles,
    loadFromExamples,
    loadExampleUrisFromCache,
    addLoadedToWallet,
    checkLoadedPassExists,
  };
}
