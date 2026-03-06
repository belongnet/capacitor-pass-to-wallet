import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

function normalizeBase64(value) {
  const input = String(value || '').trim();
  const marker = 'base64,';
  const markerIndex = input.indexOf(marker);
  if (markerIndex === -1) {
    return input;
  }
  return input.slice(markerIndex + marker.length).trim();
}

async function get(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to get ${url}. Status: ${response.status}`);
  }
  const blob = await response.blob();
  const base64 = await blobToBase64(blob);
  if (!base64 || base64 instanceof ArrayBuffer) {
    throw new Error(`Unable to convert ${url} to base64`);
  }
  return normalizeBase64(base64);
}

class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar>
          <ion-title>Wallet</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen="true" color="light">
        <ion-list inset="true">
          <ion-list-header>Single</ion-list-header>
          <ion-item-group>
            <ion-item>
              <ion-input id="passUrl" label="Pass URL" label-placement="stacked" placeholder="https://example.com/my-pass.pkpass"></ion-input>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <ion-button id="fetchPassBtn" expand="block">Download</ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button id="addFromUrlBtn" fill="outline" expand="block">Download + Add</ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
            <ion-item>
              <ion-textarea id="singleBase64" label="Single base64" label-placement="stacked" auto-grow="true" placeholder="Paste base64 for one .pkpass"></ion-textarea>
            </ion-item>
            <ion-item>
              <ion-grid>
                <ion-row>
                  <ion-col size="6">
                    <ion-button id="addSingleBtn" expand="block">Add To Wallet</ion-button>
                  </ion-col>
                  <ion-col size="6">
                    <ion-button id="passExistsBtn" fill="outline" expand="block">Check Pass Exists</ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <ion-list inset="true">
          <ion-list-header>Multiple</ion-list-header>
          <ion-item-group>
            <ion-item>
              <ion-textarea id="multiBase64" label="Multiple base64 values" label-placement="stacked" auto-grow="true" placeholder="base64-pass-1\nbase64-pass-2"></ion-textarea>
            </ion-item>
            <ion-item>
              <ion-button id="addMultipleBtn" expand="block">Add Multiple</ion-button>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <ion-list inset="true">
          <ion-list-header>Result</ion-list-header>
          <ion-item-group>
            <ion-item>
              <ion-textarea id="result" label="Output" label-placement="stacked" readonly auto-grow="true"></ion-textarea>
            </ion-item>
          </ion-item-group>
        </ion-list>
      </ion-content>
    `;
  }

  bindEvents() {
    const passUrlEl = this.querySelector('#passUrl');
    const singleBase64El = this.querySelector('#singleBase64');
    const multiBase64El = this.querySelector('#multiBase64');
    const fetchPassBtn = this.querySelector('#fetchPassBtn');
    const addFromUrlBtn = this.querySelector('#addFromUrlBtn');
    const addSingleBtn = this.querySelector('#addSingleBtn');
    const passExistsBtn = this.querySelector('#passExistsBtn');
    const addMultipleBtn = this.querySelector('#addMultipleBtn');
    const resultEl = this.querySelector('#result');

    const setResult = (label, payload) => {
      resultEl.value = `${label}\n${JSON.stringify(payload, null, 2)}`;
    };

    const getSingleBase64 = () => String(singleBase64El?.value || '').trim();
    const getPassUrl = () => String(passUrlEl?.value || '').trim();

    const getMultipleBase64 = () =>
      String(multiBase64El?.value || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

    fetchPassBtn?.addEventListener('click', async () => {
      try {
        const url = getPassUrl();
        if (!url) {
          setResult('Validation error', { message: 'Pass URL is required' });
          return;
        }

        const base64 = await get(url);
        singleBase64El.value = base64;
        setResult('get(url)', { message: 'Pass downloaded and converted to base64' });
      } catch (error) {
        setResult('get(url) error', {
          message: error?.message ?? String(error),
        });
      }
    });

    addFromUrlBtn?.addEventListener('click', async () => {
      try {
        const url = getPassUrl();
        if (!url) {
          setResult('Validation error', { message: 'Pass URL is required' });
          return;
        }

        const base64 = await get(url);
        singleBase64El.value = base64;
        const result = await CapacitorPassToWallet.addToWallet({ base64 });
        setResult('get(url) + addToWallet', result);
      } catch (error) {
        setResult('get(url) + addToWallet error', {
          message: error?.message ?? String(error),
        });
      }
    });

    addSingleBtn?.addEventListener('click', async () => {
      try {
        const base64 = normalizeBase64(getSingleBase64());
        if (!base64) {
          setResult('Validation error', { message: 'Single base64 is required' });
          return;
        }

        const result = await CapacitorPassToWallet.addToWallet({ base64 });
        setResult('addToWallet', result);
      } catch (error) {
        setResult('addToWallet error', {
          message: error?.message ?? String(error),
        });
      }
    });

    passExistsBtn?.addEventListener('click', async () => {
      try {
        const base64 = normalizeBase64(getSingleBase64());
        if (!base64) {
          setResult('Validation error', { message: 'Single base64 is required' });
          return;
        }

        const result = await CapacitorPassToWallet.passExists({ base64 });
        setResult('passExists', result);
      } catch (error) {
        setResult('passExists error', {
          message: error?.message ?? String(error),
        });
      }
    });

    addMultipleBtn?.addEventListener('click', async () => {
      try {
        const base64 = getMultipleBase64().map((item) => normalizeBase64(item));
        if (!base64.length) {
          setResult('Validation error', { message: 'At least one base64 is required' });
          return;
        }

        const result = await CapacitorPassToWallet.addMultipleToWallet({ base64 });
        setResult('addMultipleToWallet', result);
      } catch (error) {
        setResult('addMultipleToWallet error', {
          message: error?.message ?? String(error),
        });
      }
    });

    setResult('Ready', {
      platformHint:
        'Wallet actions require iOS device/simulator with Apple Wallet support. Web will return not implemented.',
    });
  }
}

customElements.define('home-page', HomePage);
