import Vue from 'vue';
import VueRouter from 'vue-router';
import router from 'config/router';
import store from 'store/index';
import i18n from 'config/i18n';
import Application from 'components/Application';

Vue.use(VueRouter);

export function createApp(context) {
  return new Promise((resolve, reject) => {
    const app = new Vue({
      store,
      i18n,
      router,
      render: (h) => {
        return h(Application);
      },
    });

    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      resolve(app);
    }, reject);
  });
}
