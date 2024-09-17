import { Vue, Component } from 'vue-property-decorator';
import { get, has, head, isEmpty } from 'lodash';
import { DATE_TIME_FORMAT } from 'config/constants';
import { formatDate } from 'utils/date';
import AppModule from 'store/modules/app';
import { convertEnumToTranslation } from 'utils/translation';
import { RoleAttributeTypeEnum } from 'enums/role';
import { getUserInfo } from 'api/user-setting';
import { getUserFacility, getUserRoleAttributes } from 'utils/user';
import Button from 'components/FormUI/Button';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { InputAttributeEnum } from 'enums/app';
import * as Styled from './styled';
import EditProfile from '../EditProfile';

@Component
export default class ViewProfile extends Vue {
  private isLoading = true;
  private userInfo: Auth.User = null;
  private isEdit = false;

  get currentLocale(): string {
    return AppModule.locale;
  }

  get userFacility(): Auth.Facility {
    return getUserFacility(this.userInfo);
  }

  get roleAttributeOrderKeys(): RoleAttributeTypeEnum[] {
    return get(this.userInfo, 'roleAttributeOrderKeys');
  }

  get roleAttributes(): Auth.RoleAttributes {
    return getUserRoleAttributes(this.userInfo);
  }

  get reconciliationDuration(): string {
    const duration = this.userFacility.reconciliationDuration.split(' ');
    const month = parseInt(head(duration));
    return month > 1
      ? `${month} ${this.$t('months')}`
      : `${month} ${this.$t('month')}`;
  }

  created() {
    this.initUserInfo();
  }

  async initUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const result = await getUserInfo();
      this.userInfo = result;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  getReconciliationDate(timestamp: number): string {
    return timestamp ? formatDate(timestamp, DATE_TIME_FORMAT) : '';
  }

  getAttributeName(attribute: RoleAndPermission.RoleAttributeParams): string {
    return (
      get(attribute, `nameTranslation.${this.currentLocale}`) || attribute.name
    );
  }

  getAttributeLabel(attribute: Auth.RoleAttribute) {
    if (attribute.attribute.category === InputAttributeEnum.DATE) {
      return formatDate(attribute.value, DATE_TIME_FORMAT);
    }
    return attribute.label;
  }

  toggleEdit(reload = false) {
    this.isEdit = !this.isEdit;
    if (!this.isEdit && reload) {
      this.initUserInfo();
    }
  }

  renderInfo(label: string, value: string, unit: string = ''): JSX.Element {
    return (
      <Styled.Info>
        <Styled.Label>{label}</Styled.Label>
        <text-direction>
          <Styled.Text>
            {value} {unit}
          </Styled.Text>
        </text-direction>
      </Styled.Info>
    );
  }

  renderRoleAttributes(type: RoleAttributeTypeEnum): JSX.Element {
    if (has(this.roleAttributes, type)) {
      const attributes: Auth.RoleAttribute[] = this.roleAttributes[type];
      return (
        <Styled.Content>
          <Styled.Title>{this.$t(convertEnumToTranslation(type))}</Styled.Title>
          <Styled.Information>
            {attributes.map((attribute) =>
              this.renderInfo(
                this.getAttributeName(attribute.attribute),
                this.getAttributeLabel(attribute),
                attribute.quantityUnit,
              ),
            )}
          </Styled.Information>
        </Styled.Content>
      );
    }
  }

  renderContact(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>{this.$t('contact')}</Styled.Title>
        <Styled.Information>
          {this.renderInfo(
            this.$t('first_name'),
            this.$t(this.userInfo.firstName),
          )}
          {this.renderInfo(
            this.$t('last_name'),
            this.$t(this.userInfo.lastName),
          )}
          {this.renderInfo(
            this.$t('phone'),
            this.$t(this.userInfo.phoneNumber),
          )}
          {this.renderInfo(this.$t('email'), this.$t(this.userInfo.email))}
        </Styled.Information>
      </Styled.Content>
    );
  }

  renderCertification(): JSX.Element {
    return (
      <Styled.Content>
        <Styled.Title>
          {this.$t('certification_and_custody_model')}
        </Styled.Title>
        <Styled.Information>
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
          {!isEmpty(this.userFacility.goods) &&
            this.renderInfo(
              this.$t('goods'),
              this.userFacility.goods.join(', '),
            )}
        </Styled.Information>
      </Styled.Content>
    );
  }

  renderActions(): JSX.Element {
    return (
      <Styled.HeaderAction>
        <Styled.HeaderTitle>
          {this.$t('onboardPage.my_profile')}
        </Styled.HeaderTitle>
        {!this.isEdit && (
          <Button
            variant="primary"
            label={this.$t('edit_profile')}
            icon="edit"
            click={() => {
              this.toggleEdit(false);
            }}
          />
        )}
      </Styled.HeaderAction>
    );
  }

  renderContent(): JSX.Element {
    if (this.isEdit) {
      return <EditProfile exit={this.toggleEdit} />;
    }
    return (
      <Styled.Container>
        {this.renderContact()}
        {this.roleAttributeOrderKeys.map((type) =>
          this.renderRoleAttributes(type),
        )}
        {this.userFacility && this.renderCertification()}
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Loading>
          <SpinLoading />
        </Styled.Loading>
      );
    }
    return (
      <Styled.Wrapper>
        {this.renderActions()}
        {this.renderContent()}
      </Styled.Wrapper>
    );
  }
}
