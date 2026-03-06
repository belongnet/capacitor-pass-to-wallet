class AboutPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>About</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen="true">
        <ion-grid fixed="true">
          <ion-row>
            <ion-col size="12" size-md="10" offset-md="1">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Playground notes</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  This example uses Ionic JavaScript custom elements + Capacitor plugin APIs.
                  Wallet methods are iOS-specific and expected to return not implemented on web.
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    `;
  }
}

customElements.define('about-page', AboutPage);
