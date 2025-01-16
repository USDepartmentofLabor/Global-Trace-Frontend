import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import { formatDate } from 'utils/date';
import { CapStatusEnum, RequestExtensionStatusEnum } from 'enums/brand';
import { LevelRiskCategoryEnum } from 'enums/saq';
import { convertEnumToTranslation } from 'utils/translation';
import { getUserFacility } from 'utils/user';
import RiskLabel from 'components/RiskLabel';
import auth from 'store/modules/auth';
import * as Styled from './styled';

@Component
export default class RowItem extends Vue {
  @Prop({ required: true }) data: CAP.CAP;
  @Prop({ required: true }) openRequestExtensionModal: (data: CAP.CAP) => void;
  @Prop({ required: true }) openActionPlanModal: (data: CAP.CAP) => void;
  @Prop({ required: true }) openViewExtensionRequestModal: (
    data: CAP.CAP,
  ) => void;

  get name(): string {
    const facility = getUserFacility(auth.user);
    const isCreator = this.data.createdFacilityId === get(facility, 'id');
    if (isCreator) {
      return this.$t('issued_to_name', {
        name: this.data.facility.name,
      });
    }
    return this.$t('issued_by_name', {
      name: this.data.createdFacility.name,
    });
  }

  renderActions(): JSX.Element {
    if (auth.isProduct) {
      const showAction = this.data.status === CapStatusEnum.OVERDUE;
      const isRequestedExtension = this.data.requestExtensions.some(
        ({ status }) => status === RequestExtensionStatusEnum.PENDING,
      );
      const showRequestExtension = showAction && !isRequestedExtension;
      return (
        <Styled.Td>
          <Styled.RowActions>
            {showRequestExtension && (
              <Styled.Action
                vOn:click_native={(event: Event) => {
                  event.stopPropagation();
                  this.openRequestExtensionModal(this.data);
                }}
              >
                <font-icon name="more_time" size="20" color="highland" />
                <Styled.ActionLabel>
                  {this.$t('request_extension')}
                </Styled.ActionLabel>
              </Styled.Action>
            )}
          </Styled.RowActions>
        </Styled.Td>
      );
    }
  }

  render(): JSX.Element {
    const risk = get(this.data, 'riskScoreLevel');
    const showRisk =
      this.data.status === CapStatusEnum.RESOLVED &&
      risk !== LevelRiskCategoryEnum.NO_WEIGHT;
    const hasPendingRequest = this.data.requestExtensions.some(
      ({ status }) => status === RequestExtensionStatusEnum.PENDING,
    );
    const isOverdue = this.data.status === CapStatusEnum.OVERDUE;
    const showViewExtensionRequest =
      auth.isBrand && hasPendingRequest && isOverdue;
    return (
      <Styled.Tr
        vOn:click={() => {
          this.openActionPlanModal(this.data);
        }}
      >
        <Styled.Td>
          <Styled.Status variant={this.data.status}>
            {this.$t(convertEnumToTranslation(this.data.status))}
          </Styled.Status>
        </Styled.Td>
        <Styled.Td>{this.name}</Styled.Td>
        <Styled.Td>{formatDate(this.data.targetCompletionAt)}</Styled.Td>
        <Styled.Td>{formatDate(this.data.updatedAt)}</Styled.Td>
        <Styled.Td>
          {showRisk && <RiskLabel hasDot level={risk} text={risk} />}
          {showViewExtensionRequest && (
            <Styled.Action
              vOn:click_native={(event: Event) => {
                event.stopPropagation();
                this.openViewExtensionRequestModal(this.data);
              }}
            >
              <font-icon name="more_time" size="20" color="highland" />
              <Styled.ActionLabel>
                {this.$t('view_extension_request')}
              </Styled.ActionLabel>
            </Styled.Action>
          )}
        </Styled.Td>
        {this.renderActions()}
      </Styled.Tr>
    );
  }
}
