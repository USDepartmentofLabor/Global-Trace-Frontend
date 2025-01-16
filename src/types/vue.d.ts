import { AsyncComponent } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $toast: Toast.ToastApi<AsyncComponent>;
  }
  interface VueConstructor {
    $toast: Toast.ToastApi<AsyncComponent>;
  }
}
