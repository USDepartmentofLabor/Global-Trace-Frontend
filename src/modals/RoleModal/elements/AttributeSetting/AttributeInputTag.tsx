import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, isEmpty } from 'lodash';
import Input from 'components/FormUI/Input/Input';
import { ENTER_KEY } from 'config/constants';
import MessageError from 'components/FormUI/MessageError';
import * as Styled from './styled';

@Component
export default class AttributeInputTag extends Vue {
  @Prop({
    default: [],
  })
  tagIds: string[];
  @Prop() changeTags: (tags: string[]) => void;

  private value = '';
  private tags: string[] = [];
  private messageErrors: App.MessageError = null;

  created(): void {
    this.tags = this.tagIds;
  }

  onAdd(event: KeyboardEvent): void {
    if (event.key === ENTER_KEY) {
      this.handleAddTag();
    }
  }

  handleAddTag(): void {
    if (!isEmpty(this.value)) {
      const trimmedValue = this.value.trim();
      if (
        this.tags
          .map((tag) => tag.toLowerCase())
          .includes(trimmedValue.toLowerCase())
      ) {
        const error = {
          message: 'Validate Exception',
          errors: {
            value: {
              messages: [this.$t('message_duplicate_tag')],
            },
          },
        };
        this.messageErrors = get(error, 'errors');
      } else {
        this.tags.push(trimmedValue);
        this.onChange('');
        this.changeTags(this.tags);
      }
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChange(value: string): void {
    this.value = value;
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.changeTags(this.tags);
    this.onClearMessageErrors();
  }

  renderInput(): JSX.Element {
    return (
      <Styled.ItemWrapper>
        <Input
          label={this.$t('add_new_value')}
          name="value"
          height="48px"
          value={this.value}
          placeholder={this.$t('input_value')}
          iconColor="highland"
          keyDownInput={this.onAdd}
          changeValue={(value: string) => {
            this.onChange(value);
            this.onClearMessageErrors();
          }}
        />
        {this.messageErrors && (
          <MessageError field="value" messageErrors={this.messageErrors} />
        )}
        <font-icon
          name="add_box"
          size="24"
          color={!isEmpty(this.value) ? 'highland' : 'spunPearl'}
          class="add-tag"
          vOn:click_native={this.handleAddTag}
        />
      </Styled.ItemWrapper>
    );
  }

  renderTags(): JSX.Element {
    return (
      <Styled.Tags>
        {this.tags.map((tag, index) => (
          <Styled.Tag>
            <span>{tag}</span>
            <font-icon
              name="remove"
              color="stormGray"
              size="20"
              vOn:click_native={() => {
                this.removeTag(index);
              }}
            />
          </Styled.Tag>
        ))}
      </Styled.Tags>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.ItemWrapper>
        {this.renderTags()}
        {this.renderInput()}
      </Styled.ItemWrapper>
    );
  }
}
