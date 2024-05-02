import { Vue, Component } from 'vue-property-decorator';
import frag from 'vue-frag';

@Component({
  directives: {
    frag,
  },
})
export default class Fragment extends Vue {
  render(): JSX.Element {
    return <div v-frag>{this.$slots.default}</div>;
  }
}
