import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Styled from './styled';

@Component
export default class CameraPreview extends Vue {
  @Prop({ default: true }) readonly show: boolean;
  @Prop({ default: true }) readonly qrPreviewId: string;
  @Prop({
    default: () => {
      //
    },
  })
  stopScan: () => void;

  render(): JSX.Element {
    return (
      <Styled.Wrapper show={this.show}>
        <Styled.CameraBackDrop id={this.qrPreviewId} />
        <Styled.CloseIcon vOn:click={this.stopScan}>
          <font-icon name="remove" color="ghost" size="18" />
        </Styled.CloseIcon>
      </Styled.Wrapper>
    );
  }
}
