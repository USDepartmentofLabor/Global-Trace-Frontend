import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import flags from 'assets/data/flags.json';
import Flag from './styled';

@Component
export default class FlagIcon extends Vue {
  @Prop({ required: true }) readonly name: string;

  get position(): string {
    return get(flags, [this.name], '');
  }

  render(): JSX.Element {
    return <Flag position={this.position} />;
  }
}
