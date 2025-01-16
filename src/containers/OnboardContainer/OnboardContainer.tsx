import { Vue, Component } from 'vue-property-decorator';
import { get, isNull } from 'lodash';
import auth from 'store/modules/auth';
import { setUserInfo } from 'utils/cookie';
import { getHomeRoute } from 'utils/user';
import { OnboardMenuEnum } from 'enums/onboard';
import { getUserInfo } from 'api/user-setting';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import SAQ from 'components/SAQ';
import saqModule from 'store/modules/saq';
import Button from 'components/FormUI/Button';
import MyProfile from './elements/MyProfile';
import PartnersManager from './elements/PartnersManager';
import LaborProfile from './elements/LaborProfile/LaborProfile';
import * as Styled from './styled';

@Component
export default class OnboardContainer extends Vue {
  private showProfile: boolean = false;
  private showSAQ: boolean = false;
  private showPartners: boolean = false;
  private userInfo: Auth.User = null;
  private isLoading: boolean = true;
  private isSavingDraft: boolean = false;
  private SAQData: SAQ.SAQData = null;

  get isShowSAQ(): boolean {
    return auth.hasRequireSAQ && auth.isFirstUser && auth.uploadedSAQ;
  }

  get isShowPartner(): boolean {
    return auth.hasManagePartnerMenuForProducer && auth.isFirstUser;
  }

  get showMenuContent(): boolean {
    return this.showProfile || this.showSAQ || this.showPartners;
  }

  get isDraftSAQ(): boolean {
    return (
      isNull(get(this.SAQData, 'selfAssessment.completedSaqAt')) &&
      get(this.SAQData, 'selfAssessment.isDraft')
    );
  }

  get isDoneSAQ(): boolean {
    return (
      this.userInfo && !isNull(this.userInfo.currentFacility.answeredSaqAt)
    );
  }

  get isFailSAQ(): boolean {
    return this.isDraftSAQ;
  }

  get menus(): Onboard.Menu[] {
    return [
      {
        name: OnboardMenuEnum.PROFILE,
        isDone: this.userInfo ? !isNull(this.userInfo.updatedProfileAt) : false,
        isDisabled: false,
        onClick: () => {
          this.showProfile = true;
        },
      },
      this.isShowSAQ
        ? {
            name: OnboardMenuEnum.QUESTIONNAIRES,
            isDone: this.isDoneSAQ,
            isFail: this.isDraftSAQ,
            isDisabled: !auth.uploadedSAQ && auth.hasRequireSAQ,
            onClick: () => {
              if (auth.uploadedSAQ && auth.hasRequireSAQ) {
                this.showSAQ = true;
              }
            },
          }
        : null,
      this.isShowPartner
        ? {
            name: OnboardMenuEnum.PARTNERS,
            isDisabled: false,
            isDone: this.userInfo
              ? !isNull(this.userInfo.currentFacility.addedPartnerAt)
              : false,
            onClick: () => {
              this.showPartners = true;
            },
          }
        : null,
    ].filter((menu) => !isNull(menu));
  }

  get isDoneAll(): boolean {
    return this.menus.every((item) => {
      if (
        item.name === OnboardMenuEnum.QUESTIONNAIRES &&
        !auth.uploadedSAQ &&
        auth.hasRequireSAQ
      ) {
        return true;
      }
      return item.isDone;
    });
  }

  created(): void {
    this.getUserInfo();
    if (auth.hasRequireSAQ) {
      this.getSAQ();
    }
  }

  async getUserInfo(): Promise<void> {
    try {
      this.isLoading = true;
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  getSAQ(isInit: boolean = true): void {
    this.isLoading = true;
    saqModule.getSAQData({
      callback: {
        onSuccess: (data) => {
          this.SAQData = data;
          if (!isInit && this.SAQData.selfAssessment.totalDraftAnswers > 0) {
            this.$toast.success(this.$t('saved_saq'));
          }
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  close(): void {
    this.showProfile = false;
    if (this.showSAQ) {
      this.showSAQ = false;
    }
    this.showPartners = false;
  }

  onProfileUpdated(): void {
    this.showProfile = false;
    this.getUserInfo();
  }

  onPartnersUpdated(): void {
    this.showPartners = false;
    this.getUserInfo();
  }

  onBeforeSaveDraft(): void {
    this.isSavingDraft = true;
  }

  onFinishSaveDraft(): void {
    this.isSavingDraft = false;
    this.getUserInfo();
    this.getSAQ(false);
  }

  redirectToHomepage(): void {
    auth.setUser(this.userInfo);
    setUserInfo(this.userInfo);
    this.$router.push({ name: getHomeRoute() });
  }

  renderMenu(): JSX.Element {
    if (this.isLoading || this.isSavingDraft) {
      return <SpinLoading />;
    }
    return (
      <Styled.MenuContainer>
        {this.menus.map((menu, index) => {
          let variant = 'uncheck';
          if (menu.isDone) variant = 'checked';
          if (menu.isFail) variant = 'fail';
          if (menu.isDisabled) variant = 'disabled';
          return (
            <Styled.MenuItem key={menu.name} vOn:click={() => menu.onClick()}>
              <Styled.MenuNumber>{index + 1}.</Styled.MenuNumber>
              <Styled.MenuName>
                {this.$t(`onboardPage.${menu.name}`)}
              </Styled.MenuName>
              {!menu.isDisabled && (
                <Styled.CheckboxIcon variant={variant}>
                  {(menu.isDone || menu.isFail) && (
                    <font-icon name="check" color="white" size="16" />
                  )}
                </Styled.CheckboxIcon>
              )}
            </Styled.MenuItem>
          );
        })}
      </Styled.MenuContainer>
    );
  }

  renderAction(): JSX.Element {
    return (
      <Styled.Actions>
        <Button
          width="240px"
          type="button"
          variant="primary"
          label={this.$t('done')}
          disabled={!this.isDoneAll}
          click={this.redirectToHomepage}
        />
      </Styled.Actions>
    );
  }

  renderProfile(): JSX.Element {
    if (auth.isLabor) {
      return <LaborProfile updated={this.onProfileUpdated} />;
    }
    return <MyProfile exit={this.onProfileUpdated} />;
  }

  renderMenuContent(): JSX.Element {
    if (this.showProfile) {
      return (
        <fragment>
          <Styled.MenuTitle>
            {this.$t('onboardPage.my_profile')}
          </Styled.MenuTitle>
          {this.renderProfile()}
        </fragment>
      );
    } else if (this.showSAQ) {
      return (
        <fragment>
          <Styled.MenuTitle>
            {this.$t('onboardPage.self_assessment_questionnaire')}
          </Styled.MenuTitle>
          <SAQ
            beforeSaveDraft={this.onBeforeSaveDraft}
            finishSaveDraft={this.onFinishSaveDraft}
            finishSAQ={this.close}
          />
        </fragment>
      );
    } else if (this.showPartners) {
      return (
        <fragment>
          <Styled.MenuTitle>
            {this.$t('onboardPage.manage_business_partners')}
          </Styled.MenuTitle>
          <PartnersManager updated={this.onPartnersUpdated} />
        </fragment>
      );
    }
  }

  renderMenuContainer(): JSX.Element {
    if (this.showMenuContent) {
      return (
        <Styled.MenuWrapper>
          <Styled.MenuContent>
            {this.renderMenuContent()}
            <Styled.CloseButton vOn:click={this.close}>
              <font-icon name="arrow_left" size="22" color="envy" />
            </Styled.CloseButton>
          </Styled.MenuContent>
        </Styled.MenuWrapper>
      );
    }
  }

  render(): JSX.Element {
    return (
      <dashboard-layout>
        <Styled.Wrapper>
          <Styled.Content>
            <Styled.Title>{this.$t('sidebar.onboard')}</Styled.Title>
            <Styled.Description>
              {this.$t('onboardPage.tutorial')}
            </Styled.Description>
            {this.renderMenu()}
            {this.renderAction()}
          </Styled.Content>
        </Styled.Wrapper>
        {this.renderMenuContainer()}
      </dashboard-layout>
    );
  }
}
