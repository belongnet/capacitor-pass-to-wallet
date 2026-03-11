<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Pass To Wallet Playground</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" color="light">
      <div class="layout">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Passes (.pkpass)</ion-card-title>
            <ion-card-subtitle>One flow for single and multiple passes</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="inset">
              <ion-item>
                <ion-label>Loaded passes</ion-label>
                <ion-note slot="end">{{ loadedCount }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label>Source</ion-label>
                <ion-note slot="end" class="source-value">{{ loadedSourceLabel }}</ion-note>
              </ion-item>
            </ion-list>

            <ion-segment v-model="sourceMode" class="source-segment">
              <ion-segment-button value="base64" content-id="source-base64">
                <ion-label>Base64</ion-label>
              </ion-segment-button>
              <ion-segment-button value="file-uri" content-id="source-file-uri">
                <ion-label>File URI</ion-label>
              </ion-segment-button>
              <ion-segment-button value="file" content-id="source-file">
                <ion-label>File</ion-label>
              </ion-segment-button>
              <ion-segment-button value="url" content-id="source-url">
                <ion-label>URL</ion-label>
              </ion-segment-button>
            </ion-segment>

            <ion-segment-view class="source-view">
              <ion-segment-content id="source-base64">
                <div class="source-pane">
                  <ion-note class="pane-note">Base64 flow (legacy example):</ion-note>
                  <ion-button size="small" expand="block" fill="outline" @click="loadExample('example1')" :disabled="isLoading">
                    Load example1.pkpass
                  </ion-button>
                  <ion-button size="small" expand="block" fill="outline" @click="loadExample('example2')" :disabled="isLoading">
                    Load example2.pkpass
                  </ion-button>
                  <ion-button size="small" expand="block" @click="loadExample('both')" :disabled="isLoading">
                    Load Both Examples
                  </ion-button>
                </div>
              </ion-segment-content>

              <ion-segment-content id="source-file-uri">
                <div class="source-pane">
                  <ion-note class="pane-note">File URI flow (save to Cache first):</ion-note>
                  <ion-button
                    size="small"
                    expand="block"
                    fill="outline"
                    color="medium"
                    @click="loadCachedExample('example1')"
                    :disabled="isLoading"
                  >
                    Save + Load file URI (example1)
                  </ion-button>
                  <ion-button
                    size="small"
                    expand="block"
                    fill="outline"
                    color="medium"
                    @click="loadCachedExample('example2')"
                    :disabled="isLoading"
                  >
                    Save + Load file URI (example2)
                  </ion-button>
                  <ion-button size="small" expand="block" color="medium" @click="loadCachedExample('both')" :disabled="isLoading">
                    Save + Load both file URIs
                  </ion-button>
                </div>
              </ion-segment-content>

              <ion-segment-content id="source-file">
                <div class="source-pane">
                  <ion-button size="small" expand="block" fill="outline" @click="openFilePicker" :disabled="isLoading">
                    Choose .pkpass File(s)
                  </ion-button>
                  <ion-note class="pane-note">Select one file for single mode or several for multiple mode.</ion-note>
                </div>
              </ion-segment-content>

              <ion-segment-content id="source-url">
                <div class="source-pane">
                  <ion-item>
                    <ion-input
                      v-model="passUrl"
                      label="Pass URL"
                      label-placement="stacked"
                      placeholder="https://example.com/pass.pkpass"
                    />
                  </ion-item>
                  <ion-button size="small" expand="block" @click="loadFromUrl" :disabled="isLoading">
                    Load From URL
                  </ion-button>
                </div>
              </ion-segment-content>
            </ion-segment-view>

            <div class="actions">
              <ion-button size="small" expand="block" @click="addLoadedToWallet" :disabled="isLoading || loadedCount === 0">
                {{ addActionLabel }}
              </ion-button>
              <ion-button
                size="small"
                expand="block"
                fill="outline"
                @click="checkLoadedPassExists"
                :disabled="isLoading || loadedCount !== 1"
              >
                Check Pass Exists (single only)
              </ion-button>
            </div>

          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Wallet Tools (Identifier)</ion-card-title>
            <ion-card-subtitle>Use passTypeIdentifier and optional serialNumber</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-item class="id-tool-input">
              <ion-input
                v-model="passTypeIdentifier"
                label="passTypeIdentifier"
                label-placement="stacked"
                placeholder="pass.com.example.membership"
              />
            </ion-item>
            <ion-item class="id-tool-input">
              <ion-input
                v-model="serialNumber"
                label="serialNumber (optional)"
                label-placement="stacked"
                placeholder="ABC-123"
              />
            </ion-item>
            <ion-note class="pane-note">
              When you load a `.pkpass`, these fields are auto-filled from `pass.json` when available.
            </ion-note>

            <div class="actions">
              <ion-button size="small" expand="block" fill="outline" @click="checkCanAddPasses" :disabled="isLoading">
                canAddPasses
              </ion-button>
              <ion-button size="small" expand="block" fill="outline" @click="checkPassExistsById" :disabled="isLoading">
                passExistsById
              </ion-button>
              <ion-button size="small" expand="block" fill="outline" @click="openPassInWalletById" :disabled="isLoading">
                openPassInWallet
              </ion-button>
              <ion-button size="small" expand="block" fill="outline" @click="listWalletPasses" :disabled="isLoading">
                listPasses
              </ion-button>
              <ion-button size="small" expand="block" color="danger" @click="removePassById" :disabled="isLoading">
                removePass
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Result</ion-card-title>
            <ion-card-subtitle>{{ resultLabel }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <pre class="result">{{ resultJson }}</pre>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-toast
        :is-open="isToastOpen"
        :message="toastMessage"
        position="bottom"
        :duration="2200"
        @didDismiss="isToastOpen = false"
      />

      <input
        ref="fileInputRef"
        class="hidden-file-input"
        type="file"
        multiple
        accept=".pkpass,application/vnd.apple.pkpass,application/octet-stream"
        @change="onFilesSelected"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonToast,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useWalletActions, type ExampleKey } from '../composables/useWalletActions';

const {
  passUrl,
  loadedCount,
  loadedSourceLabel,
  addActionLabel,
  resultLabel,
  resultVersion,
  resultPayload,
  isLoading,
  passTypeIdentifier,
  serialNumber,
  loadFromUrl,
  loadFromFiles,
  loadFromExamples,
  loadExampleUrisFromCache,
  addLoadedToWallet,
  checkLoadedPassExists,
  checkCanAddPasses,
  checkPassExistsById,
  openPassInWalletById,
  removePassById,
  listWalletPasses,
} = useWalletActions();

const isToastOpen = ref(false);
const toastMessage = ref('');
const sourceMode = ref<'base64' | 'file-uri' | 'file' | 'url'>('base64');
const fileInputRef = ref<HTMLInputElement | null>(null);

const resultJson = computed(() => JSON.stringify(resultPayload.value, null, 2));

watch(resultVersion, async () => {
  const payloadMessage = resultPayload.value?.message;
  const nextMessage =
    typeof payloadMessage === 'string' && payloadMessage.trim().length > 0
      ? payloadMessage
      : `${resultLabel.value}`;

  toastMessage.value = nextMessage;
  isToastOpen.value = false;
  await nextTick();
  isToastOpen.value = true;
});

function openFilePicker() {
  fileInputRef.value?.click();
}

async function onFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement | null;
  await loadFromFiles(target?.files);
  if (target) {
    target.value = '';
  }
}

async function loadExample(value: ExampleKey | 'both') {
  if (value === 'both') {
    await loadFromExamples(['example1', 'example2']);
    return;
  }
  await loadFromExamples([value]);
}

async function loadCachedExample(value: ExampleKey | 'both') {
  if (value === 'both') {
    await loadExampleUrisFromCache(['example1', 'example2']);
    return;
  }
  await loadExampleUrisFromCache([value]);
}
</script>

<style scoped>
.layout {
  max-width: 880px;
  margin: 0 auto;
  padding: 12px 12px 24px;
}

.source-value {
  max-width: 62%;
  text-align: right;
}

.source-segment {
  margin-top: 12px;
}

.source-view {
  margin-top: 10px;
  min-height: 192px;
  border-radius: 10px;
  background: var(--ion-color-step-100);
}

.source-pane {
  display: grid;
  gap: 10px;
  padding: 12px;
}

.pane-note {
  display: block;
  margin-top: 4px;
}

.actions {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}

.id-tool-input {
  margin-top: 8px;
}

.result {
  margin: 0;
  max-height: 280px;
  overflow: auto;
  background: var(--ion-color-step-100);
  padding: 10px;
  border-radius: 8px;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
  font-size: 12px;
  line-height: 1.4;
}

.hidden-file-input {
  display: none;
}
</style>
