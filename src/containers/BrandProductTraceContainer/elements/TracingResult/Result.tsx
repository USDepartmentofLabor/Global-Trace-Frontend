import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import auth from 'store/modules/auth';
import { OrderCategoryEnum } from 'enums/order';
import { UserRoleEnum } from 'enums/user';
import { getDocumentLabel } from 'utils/risk-assessment';
import RiskAssessment from 'components/SupplierMap/RiskAssessment';
import { convertEnumToTranslation } from 'utils/translation';
import { formatDate } from 'utils/date';
import * as Styled from './styled';

@Component
export default class Result extends Vue {
  @Prop({ required: true }) readonly orderSupplier: BrandSupplier.OrderSupplier;
  @Prop({ default: null }) currentSupplierId: string;
  @Prop({
    default: () => {
      //
    },
  })
  changeCurrentSupplierId: (id: string) => void;
  @Prop({ required: true }) downloadDocument: (
    orderSupplier: BrandSupplier.OrderSupplier,
  ) => void;

  get isNotAvailableDocument(): boolean {
    return (
      this.orderSupplier.category === OrderCategoryEnum.SUPPLIER_MAPPING ||
      !this.orderSupplier.document
    );
  }

  openDetailModal(): void {
    const id = get(this.orderSupplier, 'supplier.id');
    const isBroker =
      get(this.orderSupplier, 'role.name') === UserRoleEnum.BROKER;
    if (auth.hasViewSupplierDetail && id && !isBroker) {
      this.changeCurrentSupplierId(id);
    }
  }

  getBusinessName(orderSupplier: BrandSupplier.OrderSupplier): string {
    if (orderSupplier.supplier) {
      return get(orderSupplier, 'supplier.name');
    }
    return this.$t('non_participating_role', {
      role: get(orderSupplier, 'role.name'),
    });
  }

  renderDownloadDocument(): JSX.Element {
    if (this.isNotAvailableDocument) {
      return <Styled.Td variant="disable">{this.$t('na')}</Styled.Td>;
    }
    return (
      <Styled.Td
        variant="active"
        vOn:click={(event: Event) => {
          event.stopPropagation();
          this.downloadDocument(this.orderSupplier);
        }}
      >
        <font-icon name="download" color="highland" size="16" />
        <Styled.Capitalize>
          {getDocumentLabel(get(this.orderSupplier, 'document'))}
        </Styled.Capitalize>
      </Styled.Td>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Tr vOn:click={this.openDetailModal}>
        <Styled.Td bold small variant="default">
          {this.getBusinessName(this.orderSupplier)}
        </Styled.Td>
        <Styled.Td variant="secondary">
          {formatDate(this.orderSupplier.transactedAt)}
        </Styled.Td>
        <Styled.Td variant="active">
          {this.$t(convertEnumToTranslation(this.orderSupplier.category))}
        </Styled.Td>
        {this.renderDownloadDocument()}
        <Styled.Td>
          {this.orderSupplier.supplier && (
            <RiskAssessment supplier={this.orderSupplier.supplier} />
          )}
        </Styled.Td>
      </Styled.Tr>
    );
  }
}
