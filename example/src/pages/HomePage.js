import { CapacitorPassToWallet } from '@belongnet/capacitor-pass-to-wallet';

class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar>
          <ion-title>Pass To Wallet Playground</ion-title>
          <ion-buttons slot="end">
            <ion-button router-link="/about" fill="clear">About</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen="true">
        <ion-grid fixed="true">
          <ion-row>
            <ion-col size="12" size-md="10" offset-md="1">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Single Pass</ion-card-title>
                  <ion-card-subtitle>Use one base64-encoded .pkpass</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <ion-textarea id="singleBase64" label="Single base64" label-placement="stacked" auto-grow="true" placeholder="Paste base64 for one .pkpass"></ion-textarea>
                  <div class="actions">
                    <ion-button id="addSingleBtn">Add To Wallet</ion-button>
                    <ion-button id="passExistsBtn" fill="outline">Check Pass Exists</ion-button>
                  </div>
                </ion-card-content>
              </ion-card>

              <ion-card>
                <ion-card-header>
                  <ion-card-title>Multiple Passes</ion-card-title>
                  <ion-card-subtitle>One base64 payload per line</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <ion-textarea id="multiBase64" label="Multiple base64 values" label-placement="stacked" auto-grow="true" placeholder="base64-pass-1\nbase64-pass-2"></ion-textarea>
                  <div class="actions">
                    <ion-button id="addMultipleBtn" color="secondary">Add Multiple</ion-button>
                  </div>
                </ion-card-content>
              </ion-card>

              <ion-card>
                <ion-card-header>
                  <ion-card-title>Result</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <pre id="result" class="result"></pre>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    `;
  }

  bindEvents() {
    const singleBase64El = this.querySelector('#singleBase64');
    const multiBase64El = this.querySelector('#multiBase64');
    const addSingleBtn = this.querySelector('#addSingleBtn');
    const passExistsBtn = this.querySelector('#passExistsBtn');
    const addMultipleBtn = this.querySelector('#addMultipleBtn');
    const resultEl = this.querySelector('#result');

    const setResult = (label, payload) => {
      resultEl.textContent = `${label}\n${JSON.stringify(payload, null, 2)}`;
    };

    const getSingleBase64 = () => String(singleBase64El?.value || '').trim();

    const getMultipleBase64 = () =>
      String(multiBase64El?.value || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

    addSingleBtn?.addEventListener('click', async () => {
      try {
        const base64 = getSingleBase64();
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
        const base64 = getSingleBase64();
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
        const base64 = getMultipleBase64();
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
