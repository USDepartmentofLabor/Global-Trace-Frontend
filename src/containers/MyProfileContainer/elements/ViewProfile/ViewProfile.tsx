import { Vue, Component, Prop } from 'vue-property-decorator';
import { head, join } from 'lodash';
import { DATE_TIME_FORMAT } from 'config/constants';
import { getBusinessLocation } from 'utils/helpers';
import { formatDate } from 'utils/date';
import { convertEnumToTranslation } from 'utils/translation';
import { getUserFacility } from 'utils/user';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

const SAQResultModal = () => import('modals/SAQResultModal');

@Component
export default class ViewProfile extends Vue {
  @Prop({ required: true }) userInfo: Auth.User;
  @Prop({
    type: Function,
    default: () => {
      //
    },
  })
  editProfile: () => void;

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get businessLocation(): string {
    if (this.userFacility) {
      return getBusinessLocation(this.userFacility);
    }
    return '';
  }

  get userCommodities(): string {
    if (this.userFacility) {
      return join(this.userFacility.goods, ', ');
    }
    return '';
  }

  get reconciliationDuration(): string {
    const duration = this.userFacility.reconciliationDuration.split(' ');
    const month = parseInt(head(duration));
    return month > 1
      ? `${month} ${this.$t('months')}`
      : `${month} ${this.$t('month')}`;
  }

  getReconciliationDate(timestamp: number): string {
    return timestamp ? formatDate(timestamp, DATE_TIME_FORMAT) : '';
  }

  showSAQResultModal(): void {
    this.$modal.show(
      SAQResultModal,
      {},
      { width: '100%', height: '100%', clickToClose: false },
    );
  }

  renderInfo(label: string, value: string): JSX.Element {
    return (
      <Styled.Info>
        <Styled.Label>{label}</Styled.Label>
        <Styled.Text>{value}</Styled.Text>
      </Styled.Info>
    );
  }

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <Styled.Row>
          {this.renderInfo(this.$t('first_name'), this.userInfo.firstName)}
          {this.renderInfo(this.$t('last_name'), this.userInfo.lastName)}
          {this.renderInfo(this.$t('phone'), this.userInfo.phoneNumber)}
          {this.renderInfo(this.$t('email'), this.userInfo.email)}
        </Styled.Row>
        {this.renderInfo(this.$t('password'), '⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁')}
      </Styled.Content>
    );
  }

  renderInformation(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('information')}</Styled.Title>
        <Styled.Information>
          {this.renderInfo(
            this.$t('business_code'),
            this.userFacility.businessRegisterNumber,
          )}
          {this.renderInfo(this.$t('os_id'), this.userFacility.oarId)}
          {this.renderInfo(this.$t('goods'), this.userCommodities)}
          {this.renderInfo(this.$t('business_name'), this.userFacility.name)}
          {this.renderInfo(this.$t('address'), this.businessLocation)}
        </Styled.Information>
      </Styled.Content>
    );
  }

  renderCertification(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>
          {this.$t('myProfilePage.certification_and_custody_model')}
        </Styled.Title>
        <Styled.Row>
          {this.renderInfo(
            this.$t('certification'),
            this.$t(convertEnumToTranslation(this.userFacility.certification)),
          )}
          {this.renderInfo(
            this.$t('myProfilePage.chain_of_custody'),
            this.$t(convertEnumToTranslation(this.userFacility.chainOfCustody)),
          )}
          {this.userFacility.reconciliationStartAt &&
            this.renderInfo(
              this.$t('myProfilePage.reconciliation_date'),
              this.getReconciliationDate(
                this.userFacility.reconciliationStartAt,
              ),
            )}
          {this.userFacility.reconciliationDuration &&
            this.renderInfo(
              this.$t('myProfilePage.reconciliation_duration'),
              this.reconciliationDuration,
            )}
        </Styled.Row>
      </Styled.Content>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="100%"
          variant="primary"
          label={this.$t('myProfilePage.edit_profile')}
          click={this.editProfile}
        />
        <Button
          width="100%"
          variant="primary"
          label={this.$t(
            'myProfilePage.start_new_self_assessment_questionnaire',
          )}
          click={this.showSAQResultModal}
        />
      </Styled.Actions>
    );
  }

  renderViewSAQButton(): JSX.Element {
    return (
      <Button
        width="360px"
        variant="primary"
        label={this.$t('view_self_assessment_questionnaire')}
        click={this.showSAQResultModal}
      />
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Container>
        {this.renderContact()}
        {this.userFacility && this.renderInformation()}
        {this.userFacility && this.renderCertification()}
        {this.renderActions()}
      </Styled.Container>
    );
  }
}
