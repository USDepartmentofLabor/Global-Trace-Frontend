import { Vue, Component, Prop } from 'vue-property-decorator';
import grievanceReportModule from 'store/modules/grievance-report';
import DropDown from 'components/FormUI/Dropdown';

@Component
export default class Reason extends Vue {
  @Prop({ default: false }) isSubmitting: boolean;
  @Prop({ default: false }) isEdit: boolean;
  @Prop({ default: null }) selectedReason: App.DropdownOption;
  @Prop({
    default: () => {
      //
    },
  })
  changeReason: (option: App.DropdownOption) => void;

  render(): JSX.Element {
    return (
      <DropDown
        title={this.$t('createReportModal.reason')}
        height="48px"
        options={grievanceReportModule.reasons}
        width="100%"
        value={this.selectedReason}
        changeOptionValue={this.changeReason}
        placeholder={this.$t('createReportModal.reason_placeholder')}
        disabled={this.isSubmitting || !this.isEdit}
        overflow
      />
    );
  }
}
