import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { filter, head, pick, uniqBy } from 'lodash';
import { confirmMatchOarId, rejectMatchOarId } from 'api/onboard';
import { OarIdEnum, OarIdStatusEnum } from 'enums/onboard';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import BusinessInformation from './elements/BusinessInformation';
import OAR from './elements/OAR';
import * as Styled from './styled';

/* eslint-disable max-lines-per-function */

@Component
export default class RegisterOarIdModal extends Vue {
  @Prop({
    default: () => {
      //
    },
  })
  onSuccess: (oarDetail: Onboard.OarIdDetail) => void;

  @Ref('businessInformation')
  readonly businessInformationRef!: BusinessInformation;

  private requestedOarId: boolean = false;
  private oarId: string = null;
  private oarIdStatus: OarIdStatusEnum = null;
  private oarIdMatches: Onboard.OarIdDetail[] = [];
  private isSubmitting: boolean = false;
  private oarIdDetail: Onboard.OarIdDetail = null;
  private oarIdData: Onboard.OarIdItem = null;
  private oarIdRequest: Onboard.RegisterOarIdParams = null;

  get isPotential(): boolean {
    return this.oarIdStatus == OarIdStatusEnum.POTENTIAL_MATCH;
  }

  get isMatched(): boolean {
    return this.oarIdStatus == OarIdStatusEnum.MATCHED;
  }

  get isNotMe(): boolean {
    return this.oarId == OarIdEnum.NOT_ME;
  }

  get submitLabel(): string {
    if (this.isPotential || this.isMatched) {
      return this.$t('done');
    }
    return this.$t('common.action.ok');
  }

  closeModal(): void {
    this.$emit('close');
  }

  onRegistered(
    data: Onboard.OarIdItem,
    oarIdRequest: Onboard.RegisterOarIdParams,
  ): void {
    this.oarIdData = data;
    this.oarIdRequest = oarIdRequest;
    const { matches, status, oarId } = data;
    const { address, countryId, provinceId, districtId, name } = oarIdRequest;
    this.oarIdStatus = status;
    switch (status) {
      case OarIdStatusEnum.POTENTIAL_MATCH:
        this.oarIdMatches = matches;
        this.oarId = head(matches).oarId;
        break;
      case OarIdStatusEnum.MATCHED:
        this.oarIdMatches = uniqBy(matches, (oar) => oar.oarId);
        this.oarId = oarId;
        break;
      case OarIdStatusEnum.NEW_FACILITY: {
        const {
          oarIdAttributeId,
          nameAttributeId,
          countryIdAttributeId,
          provinceIdAttributeId,
          districtIdAttributeId,
          addressAttributeId,
        } = head(matches);
        this.oarIdMatches = [
          {
            name,
            nameAttributeId,
            oarId,
            oarIdAttributeId,
            address,
            addressAttributeId,
            countryId,
            countryIdAttributeId,
            provinceId,
            provinceIdAttributeId,
            districtId,
            districtIdAttributeId,
          },
        ];
        this.oarId = oarId;
        break;
      }
      default:
        this.oarIdMatches = null;
        this.oarId = null;
        break;
    }
    this.requestedOarId = true;
  }

  async handleSuccess(): Promise<void> {
    try {
      if (this.isMatched && this.isNotMe) {
        this.oarId = null;
        this.requestedOarId = false;
        this.oarIdStatus = null;
        this.businessInformationRef.resetFormInput();
        return;
      }
      if (this.isPotential) {
        if (this.isNotMe) {
          await this.handleNotMeWithPotential();
          return;
        } else {
          const { facilityMatchId } = this.oarIdMatches.find(
            (oarId) => oarId.oarId == this.oarId,
          );
          if (facilityMatchId) {
            await confirmMatchOarId({ id: facilityMatchId });
          }
        }
      }
      this.oarIdDetail = this.oarIdMatches.find(
        (oarId) => oarId.oarId == this.oarId,
      );
      if (this.oarIdDetail) {
        this.onSuccess && this.onSuccess(this.oarIdDetail);
        this.closeModal();
      }
      this.$toast.success(this.$t('registerOsIdModal.os_id_registered'));
    } catch (error) {
      handleError(error as App.ResponseError);
    }
  }

  async handleNotMeWithPotential(): Promise<void> {
    this.isSubmitting = true;
    try {
      const oarIds = filter(this.oarIdMatches, (match) => !match.isConfirmed)
        .map((mch) => mch.facilityMatchId)
        .join(',');
      const response = await rejectMatchOarId(oarIds);
      if (response.oarId) {
        this.oarIdDetail = response;
        this.activeNewFacilityView();
      }
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  activeNewFacilityView(): void {
    const params = {
      status: OarIdStatusEnum.NEW_FACILITY,
      ...pick(this.oarIdDetail, [
        'name',
        'nameAttributeId',
        'address',
        'addressAttributeId',
        'districtId',
        'districtIdAttributeId',
        'provinceId',
        'provinceIdAttributeId',
        'countryId',
        'countryIdAttributeId',
        'oarId',
        'oarIdAttributeId',
      ]),
    };
    this.onRegistered(
      { ...this.oarIdData, ...params },
      {
        ...this.oarIdRequest,
        ...params,
      },
    );
  }

  changeOarId(oarId: string): void {
    this.oarId = oarId;
  }

  renderOar(): JSX.Element {
    if (this.requestedOarId && this.oarIdMatches) {
      return (
        <OAR
          changeOarId={this.changeOarId}
          oarIdMatches={this.oarIdMatches}
          status={this.oarIdStatus}
        />
      );
    }
  }

  renderFooter() {
    if (this.requestedOarId) {
      return (
        <Styled.Actions>
          <Styled.ButtonGroupEnd>
            <Button
              label={this.$t('common.action.cancel')}
              variant="outlinePrimary"
              click={this.closeModal}
            />
            <Button
              type="button"
              variant="primary"
              label={this.submitLabel}
              click={this.handleSuccess}
              isLoading={this.isSubmitting}
              disabled={this.isSubmitting}
            />
          </Styled.ButtonGroupEnd>
        </Styled.Actions>
      );
    }
  }

  render(): JSX.Element {
    return (
      <modal-layout
        title={this.$t('registerOsIdModal.register_os_id')}
        closeModal={this.closeModal}
      >
        <Styled.Wrapper>
          <perfect-scrollbar>
            <Styled.Content>
              <BusinessInformation
                disabledSubmit={this.requestedOarId}
                ref="businessInformation"
                success={this.onRegistered}
              />
              {this.renderOar()}
            </Styled.Content>
          </perfect-scrollbar>
          {this.renderFooter()}
        </Styled.Wrapper>
      </modal-layout>
    );
  }
}
