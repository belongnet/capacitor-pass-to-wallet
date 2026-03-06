import { defineCustomElements } from '@ionic/core/loader';
import { isPlatform, setupConfig } from '@ionic/core/components';
import {
  iosTransitionAnimation,
  popoverEnterAnimation,
  popoverLeaveAnimation,
} from '@rdlabo/ionic-theme-ios26';
import '@ionic/core/css/ionic.bundle.css';
import '@rdlabo/ionic-theme-ios26/dist/css/default-variables.css';
import '@rdlabo/ionic-theme-ios26/dist/css/ionic-theme-ios26.css';
import '@rdlabo/ionic-theme-ios26/dist/css/md-remove-ios-class-effect.css';

setupConfig({
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
  popoverEnter: isPlatform('ios') ? popoverEnterAnimation : undefined,
  popoverLeave: isPlatform('ios') ? popoverLeaveAnimation : undefined,
});

defineCustomElements();
