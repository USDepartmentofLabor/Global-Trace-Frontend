import { Component, Vue, Prop, Ref } from 'vue-property-decorator';
import { get } from 'lodash';
import { getFacilityById } from 'api/brand-supplier';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import RiskLabel from 'components/RiskLabel';
import Tabs from 'components/Tabs';
import { SupplierDetailTabEnum } from 'enums/brand';
import { LevelRiskCategoryEnum } from 'enums/saq';
import GeneralInformation from './elements/GeneralInformation/GeneralInformation';
import ComplianceHistory from './elements/ComplianceHistory/ComplianceHistory';
import * as Styled from './styled';

@Component
export default class SupplierDetails extends Vue {
  @Ref('supplierDetailTab') supplierDetailTabs: Tabs;

  @Prop({ default: '' }) private supplierId: string;
  @Prop({
    default: () => {
      //
    },
  })
  close: () => void;

  private isShow: boolean = false;
  private isLoading: boolean = true;
  private supplierData: Auth.Facility = null;
  private currentTopIssue: Auth.TopIssue = null;

  get riskOptions(): App.DropdownOption[] {
    return [
      {
        name: this.$t('low'),
        id: LevelRiskCategoryEnum.LOW,
      },
      {
        name: this.$t('medium'),
        id: LevelRiskCategoryEnum.MEDIUM,
      },
      {
        name: this.$t('high'),
        id: LevelRiskCategoryEnum.HIGH,
      },
      {
        name: this.$t('extreme'),
        id: LevelRiskCategoryEnum.EXTREME,
      },
    ];
  }

  get tabs(): App.Tab[] {
    return [
      {
        name: SupplierDetailTabEnum.GENERAL_INFORMATION,
        title: this.$t('general_information'),
        component: GeneralInformation,
      },
      {
        name: SupplierDetailTabEnum.COMPLIANCE_HISTORY,
        title: this.$t('compliance_history'),
        component: ComplianceHistory,
      },
    ];
  }

  get name(): string {
    return get(this.supplierData, 'name', '');
  }

  created(): void {
    if (this.supplierId) {
      this.getSupplierData();
    }
  }

  async getSupplierData(): Promise<void> {
    try {
      this.isLoading = true;
      this.supplierData = await getFacilityById(this.supplierId);
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isLoading = false;
    }
  }

  changeTab(tabIndex: number): void {
    const index = this.tabs.findIndex(
      ({ name }) => name === SupplierDetailTabEnum.COMPLIANCE_HISTORY,
    );
    if (tabIndex !== index) {
      this.currentTopIssue = null;
    } else {
      this.refreshHistory();
    }
  }

  refreshHistory() {
    const index = this.tabs.findIndex(
      ({ name }) => name === SupplierDetailTabEnum.COMPLIANCE_HISTORY,
    );
    const complianceHistory = this.$refs[
      `tabContent_${index}`
    ] as ComplianceHistory;
    complianceHistory.refresh();
  }

  openHistory(issue: Auth.TopIssue): void {
    const index = this.tabs.findIndex(
      ({ name }) => name === SupplierDetailTabEnum.COMPLIANCE_HISTORY,
    );
    const complianceHistory = this.$refs[
      `tabContent_${index}`
    ] as ComplianceHistory;
    complianceHistory.setCurrentRisk(
      issue.indicator.category.id,
      issue.indicator.id,
      issue.subIndicator.id,
    );
    this.supplierDetailTabs.activeTab = index;
    this.currentTopIssue = issue;
    this.refreshHistory();
  }

  handleClose() {
    this.isShow = false;
    setTimeout(() => {
      this.close();
    }, 100);
  }

  mounted() {
    setTimeout(() => {
      this.isShow = true;
    });
  }

  renderTitle(): JSX.Element {
    return (
      <Styled.Title>
        <Styled.Back onClick={this.handleClose}>
          <font-icon name="arrow_left" color="black" size="20" />
        </Styled.Back>
        <Styled.SupplierName>{this.name}</Styled.SupplierName>
      </Styled.Title>
    );
  }

  renderTabs(): JSX.Element {
    return (
      <Styled.Tabs>
        <Tabs
          ref="supplierDetailTab"
          tabs={this.tabs}
          scopedSlots={{
            tab: ({
              item: { component: TabComponent },
              index,
            }: {
              item: App.Tab;
              index: number;
            }) => (
              <TabComponent
                ref={`tabContent_${index}`}
                supplierId={this.supplierId}
                supplierData={this.supplierData}
                topIssue={this.currentTopIssue}
                openHistory={this.openHistory}
              />
            ),
          }}
          changeTab={this.changeTab}
        />
      </Styled.Tabs>
    );
  }

  renderContent(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Empty>
          <SpinLoading />
        </Styled.Empty>
      );
    }
    return (
      <Styled.Container>
        <Styled.Content>
          <Styled.Header>
            {this.renderTitle()}
            <Styled.RiskGroup>
              {this.riskOptions.map(({ id, name }) => (
                <RiskLabel level={id} text={name} hasDot />
              ))}
            </Styled.RiskGroup>
          </Styled.Header>
          {this.renderTabs()}
        </Styled.Content>
      </Styled.Container>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper isShow={this.isShow}>
        {this.renderContent()}
      </Styled.Wrapper>
    );
  }
}
