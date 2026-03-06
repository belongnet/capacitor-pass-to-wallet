export function normalizeBase64(value: string): string {
  const input = String(value || '').trim();
  const marker = 'base64,';
  const markerIndex = input.indexOf(marker);
  if (markerIndex === -1) {
    return input;
  }
  return input.slice(markerIndex + marker.length).trim();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Unable to convert blob to base64 string'));
    };
    reader.readAsDataURL(blob);
  });
}

export async function fileToBase64(file: File): Promise<string> {
  if (!file) {
    throw new Error('File is required');
  }
  const encoded = await blobToBase64(file);
  if (!encoded) {
    throw new Error(`Unable to convert ${file.name} to base64`);
  }
  return normalizeBase64(encoded);
}

export async function passUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to get ${url}. Status: ${response.status}`);
  }
  const blob = await response.blob();
  const encoded = await blobToBase64(blob);
  if (!encoded) {
    throw new Error(`Unable to convert ${url} to base64`);
  }
  return normalizeBase64(encoded);
}

export function splitBase64Multiline(rawValue: string): string[] {
  return String(rawValue || '')
    .split('\n')
    .map((item: string) => normalizeBase64(item))
    .filter(Boolean);
}
