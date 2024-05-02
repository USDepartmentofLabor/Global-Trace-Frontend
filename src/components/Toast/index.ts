import Vue, { PluginFunction, AsyncComponent } from 'vue';
import { get } from 'lodash';
import i18n from 'config/i18n';
import BaseToastComponent from './Toast';

const showToast = (
  content: string | AsyncComponent,
  option: Toast.ToastOption,
) => {
  try {
    new (Vue.extend(BaseToastComponent))({
      el: document.createElement('div'),
      propsData: { ...option, content },
    });
    // eslint-disable-next-line no-empty
  } catch (error) {}
};

const ToastApi = (
  globalOption: Toast.ToastOption,
): Toast.ToastApi<AsyncComponent> => {
  return {
    success: (content, option?) => {
      showToast(content, { ...globalOption, ...option, type: 'success' });
    },
    error: (content, option?: Toast.ToastOption) => {
      showToast(content, { ...globalOption, ...option, type: 'error' });
    },
    info: (content, option?: Toast.ToastOption) => {
      showToast(content, { ...globalOption, ...option, type: 'info' });
    },
  };
};

const ToastPlugin: PluginFunction<Toast.ToastOption> = (_Vue, options?) => {
  const toastApi = ToastApi(options);
  _Vue.$toast = toastApi;
  _Vue.prototype.$toast = toastApi;
};

const handleError = (
  error: App.ResponseError,
  option?: Toast.ToastOption,
): void => {
  const message = get(error, 'message', i18n.t('something_wrong'));
  Vue.$toast.error(message, option);
};

export default ToastPlugin;
export { handleError };
