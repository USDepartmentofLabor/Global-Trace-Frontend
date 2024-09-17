import { get } from 'lodash';
import { Vue, Component } from 'vue-property-decorator';
import { POLICY } from 'config/constants';
import AppModule from 'store/modules/app';

@Component
export default class PrivacyPolicyContainer extends Vue {
  get currentLocale(): string {
    return AppModule.locale;
  }

  mounted() {
    this.fetchData();
  }

  fetchData = (): void => {
    const path = get(POLICY, this.currentLocale, POLICY.en);
    fetch(path)
      .then((response) => response.text())
      .then((res: string) => {
        setTimeout(() => {
          (this.$refs.content as HTMLElement).innerHTML = res;
        }, 100);
      });
  };

  render(): JSX.Element {
    return (
      <service-layout title={this.$t('privacy_policy')}>
        <div ref="content"></div>
      </service-layout>
    );
  }
}
