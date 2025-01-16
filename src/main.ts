import 'normalize.css';
import 'vue2-datepicker/index.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import '@sum.cumo/vue-datepicker/dist/Datepicker.css';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
import Multiselect from 'vue-multiselect';
import VueModal from 'vue-js-modal';
import Draggable from 'vuedraggable';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import VueFormulate from '@braid/vue-formulate';
import VueDatePicker from '@sum.cumo/vue-datepicker';
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip';
import Toast from 'components/Toast';
import router from 'config/router';
import store from 'store/index';
import FontIcon from 'components/FontIcon';
import Fragment from 'components/Fragment';
import TextDirection from 'components/TextDirection';
import i18n from 'config/i18n';
import {
  passwordValidator,
  nameValidator,
  difference,
  length,
  emailValid,
  notInApp,
  specialChar,
  integer,
  uuid,
} from 'utils/formulate-validation';
import { directiveDropdownOverflow } from './directives/overflow-dropdown';

const DashboardLayout = () => import('components/Layout/DashboardLayout');
const GuestLayout = () => import('components/Layout/GuestLayout');
const ModalLayout = () => import('components/Layout/ModalLayout');
const ServiceLayout = () => import('components/Layout/ServiceLayout');
const Application = () => import('components/Application');

Vue.use(VueRouter);
Vue.use(VueHead);
Vue.use(Toast);
Vue.use(VueModal);
Vue.use(VueFormulate, {
  rules: {
    passwordValidator,
    nameValidator,
    difference,
    length,
    emailValid,
    notInApp,
    specialChar,
    integer,
    uuid,
  },
});
Vue.use(PerfectScrollbar);

Vue.directive('tooltip', VTooltip);
Vue.directive('close-popover', VClosePopover);
Vue.directive('overflow', directiveDropdownOverflow);
Vue.component('v-popover', VPopover);
Vue.component('VueDatePicker', VueDatePicker);
Vue.component('Multiselect', Multiselect);
Vue.component('FontIcon', FontIcon);
Vue.component('DashboardLayout', DashboardLayout);
Vue.component('GuestLayout', GuestLayout);
Vue.component('ModalLayout', ModalLayout);
Vue.component('ServiceLayout', ServiceLayout);
Vue.component('Fragment', Fragment);
Vue.component('Draggable', Draggable);
Vue.component('TextDirection', TextDirection);

try {
  new Vue({
    store,
    i18n,
    router,
    el: '#app',
    render: (h) => {
      return h(Application);
    },
  });
  // eslint-disable-next-line no-empty
} catch (error) {}
