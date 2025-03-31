import { Vue, Component, Prop } from 'vue-property-decorator';
import { isEmpty } from 'lodash';
import Input from 'components/FormUI/Input';
import Button from 'components/FormUI/Button';
import * as Styled from './styled';

@Component
export default class DNAIdentifierList extends Vue {
  @Prop({ required: true }) isSubmitting: boolean;
  @Prop({ required: true }) change: (list: string[]) => void;

  private DNAIdentifiers: string[] = [];
  private value = '';

  changeInputValue(value: string): void {
    this.value = value;
  }

  keyDownInput(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.DNAIdentifiers.includes(this.value)) {
      this.addDNA();
      this.resetValue();
    }
  }

  blurInput() {
    if (!isEmpty(this.value) && !this.DNAIdentifiers.includes(this.value)) {
      this.addDNA();
      this.resetValue();
    }
  }

  addDNA(): void {
    this.DNAIdentifiers.push(this.value);
    this.onChange();
  }

  removeDNA(index: number): void {
    this.DNAIdentifiers.splice(index, 1);
    this.onChange();
  }

  removeAllDNA(): void {
    this.DNAIdentifiers = [];
    this.onChange();
  }

  resetValue(): void {
    this.value = '';
  }

  onChange(): void {
    this.change(this.DNAIdentifiers);
  }

  render(): JSX.Element {
    return (
      <Styled.DNAListWrapper>
        <Input
          name="dna"
          value={this.value}
          height="48px"
          disabled={this.isSubmitting}
          placeholder={this.$t('add_dna_identifiers')}
          changeValue={this.changeInputValue}
          keyDownInput={this.keyDownInput}
          blurInput={this.blurInput}
        />
        {this.DNAIdentifiers.map((item, key) => (
          <Styled.DNAList key={key}>
            <Styled.Name>{item}</Styled.Name>
            <font-icon
              vOn:click_native={() => this.removeDNA(key)}
              name="close_circle"
              color="highland"
              size="20"
            />
          </Styled.DNAList>
        ))}
        <Styled.Action>
          <Button
            label={this.$t('remove_all')}
            type="button"
            icon="delete_forever"
            variant="transparentPrimary"
            isDisabled={this.isSubmitting}
            click={this.removeAllDNA}
          />
        </Styled.Action>
      </Styled.DNAListWrapper>
    );
  }
}
