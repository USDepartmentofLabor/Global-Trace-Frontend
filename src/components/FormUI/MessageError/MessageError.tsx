import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, assign } from 'lodash';
import * as Styled from './styled';

@Component
export default class MessageError extends Vue {
  @Prop({ required: true }) readonly field: string;
  @Prop({ required: true }) readonly messageErrors: {};

  get messages(): [] {
    const error = get(this.messageErrors, [this.field]);
    return get(assign({}, error), 'messages', []);
  }

  render(): JSX.Element {
    return (
      <fragment>
        {this.messages.map((error: string) => (
          <Styled.ErrorMessage>{error}</Styled.ErrorMessage>
        ))}
      </fragment>
    );
  }
}
