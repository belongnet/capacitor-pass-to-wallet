import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { isPlatform, setupConfig } from '@ionic/core/components';
import {
  iosTransitionAnimation,
  popoverEnterAnimation,
  popoverLeaveAnimation,
} from '@rdlabo/ionic-theme-ios26';
import App from './App.vue';
import router from './router';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';
import './theme/variables.css';

setupConfig({
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
  popoverEnter: isPlatform('ios') ? popoverEnterAnimation : undefined,
  popoverLeave: isPlatform('ios') ? popoverLeaveAnimation : undefined,
});

createApp(App).use(IonicVue).use(router).mount('#app');
