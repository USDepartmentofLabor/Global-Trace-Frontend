import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import { get, noop } from 'lodash';
import { getPartnerTransporters, createTransport } from 'api/transport';
import store from 'store/index';
import { MODULE } from './constants';

@Module({
  dynamic: true,
  namespaced: true,
  name: MODULE,
  store: store,
})
class Transport extends VuexModule implements AppStore.TransportState {
  public partnerTransporters: Transport.PartnerTransporter[] = [];

  @Action
  public resetPartnerTransporters(): void {
    this.RESET_PARTNER_TRANSPORTERS();
  }

  @Action
  async getPartnerTransporter({
    callback,
  }: {
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);
    try {
      const response = await getPartnerTransporters();
      this.SET_LIST_PARTNER_TRANSPORTER(response);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async createTransport({
    data,
    callback,
  }: {
    data: Transport.RequestParams;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await createTransport(data);
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Mutation
  private SET_LIST_PARTNER_TRANSPORTER(
    data: Transport.PartnerTransporter[],
  ): void {
    this.partnerTransporters = data;
  }

  @Mutation
  private RESET_PARTNER_TRANSPORTERS(): void {
    this.partnerTransporters = [];
  }
}

export default getModule(Transport);
