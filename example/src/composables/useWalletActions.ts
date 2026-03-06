import { computed, ref } from 'vue';
import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';
import { fileToBase64, normalizeBase64, passUrlToBase64 } from '../utils/pass';

type ResultPayload = Record<string, unknown>;
export type ExampleKey = 'example1' | 'example2';

const EXAMPLE_FILES: Record<ExampleKey, string> = {
  example1: '/example1.pkpass',
  example2: '/example2.pkpass',
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function normalizeList(base64List: string[]): string[] {
  return base64List.map((item) => normalizeBase64(item)).filter(Boolean);
}

export function useWalletActions() {
  const passUrl = ref('');
  const loadedBase64 = ref<string[]>([]);
  const loadedCount = computed(() => loadedBase64.value.length);
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

  function setLoadedPasses(base64List: string[], sourceLabel: string) {
    loadedBase64.value = normalizeList(base64List);
    loadedSourceLabel.value = sourceLabel;
  }

  function getLoadedPasses(): string[] {
    const normalized = normalizeList(loadedBase64.value);
    if (!normalized.length) {
      throw new Error('Load at least one .pkpass first');
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

  async function addLoadedToWallet() {
    await runAction('addToWallet(auto)', async () => {
      const base64 = getLoadedPasses();
      if (base64.length === 1) {
        const result = await CapacitorPassToWallet.addToWallet({ base64: base64[0] });
        return { mode: 'single', ...result };
      }

      const result = await CapacitorPassToWallet.addMultipleToWallet({ base64 });
      return { mode: 'multiple', count: base64.length, ...result };
    });
  }

  async function checkLoadedPassExists() {
    await runAction('passExists', async () => {
      const base64 = getLoadedPasses();
      if (base64.length !== 1) {
        throw new Error('passExists requires exactly one loaded pass');
      }
      const result = await CapacitorPassToWallet.passExists({ base64: base64[0] });
      return {
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
    addLoadedToWallet,
    checkLoadedPassExists,
  };
}
