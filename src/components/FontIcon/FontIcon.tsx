import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import theme from 'styles/theme';
import icons from 'assets/data/icons.json';
import Icon from './styled';

@Component
export default class FontIcon extends Vue {
  @Prop({ required: true }) readonly name: string;
  @Prop({ default: '' }) readonly className: string;
  @Prop({ default: '24' }) readonly size: string;
  @Prop({ default: 'inherit' }) readonly color: string;
  @Prop({ default: false }) readonly cursor: boolean;

  get iconName(): string {
    return get(icons, [this.name], '');
  }

  render(): JSX.Element {
    return (
      <Icon
        class={`usdol-icon ${this.className}`}
        content={this.iconName}
        size={this.size}
        color={() => theme.colors[this.color]}
        cursor={this.cursor}
      />
    );
  }
}
