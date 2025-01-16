import { Vue, Component } from 'vue-property-decorator';
import Dropdown from 'components/FormUI/Dropdown';
import app from 'store/modules/app';
import FlagIcon from 'components/FlagIcon';
import { getLanguageOptions, windowReload } from 'utils/helpers';
import * as Styled from './styled';

@Component
export default class LanguageDropdown extends Vue {
  changeOptionValue(id: string): void {
    app.changeLanguage(id);
    windowReload();
  }

  renderOption(option: App.DropdownOption): JSX.Element {
    return (
      <Styled.LanguageOption>
        <FlagIcon name={option.icon} />
        <span>{option.name}</span>
      </Styled.LanguageOption>
    );
  }

  render(): JSX.Element {
    return (
      <Dropdown
        value={app.currentLanguage}
        className="select-language"
        changeOptionValue={({ id }: { id: string }) => {
          this.changeOptionValue(id);
        }}
        trackBy="id"
        searchable={false}
        options={getLanguageOptions()}
        scopedSlots={{
          singleLabel: (option: App.LanguageOption) =>
            this.renderOption(option),
          optionBody: (option: App.LanguageOption) => this.renderOption(option),
        }}
      />
    );
  }
}
