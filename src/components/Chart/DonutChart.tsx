/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  BaseType,
  Selection,
  select,
  selectAll,
  pie,
  arc,
  easeExp,
  easeLinear,
} from 'd3';
import theme from 'styles/theme';

@Component
export default class DonutChart extends Vue {
  @Prop({ required: true }) data: App.DonutData[];
  @Prop({ default: 100 }) size: number;
  @Prop({ default: 30 }) strokeWidth: number;
  @Prop({ default: 'donutChart' }) id: string;

  private svg: Selection<BaseType, unknown, HTMLElement, any>;
  private group: Selection<SVGGElement, unknown, HTMLElement, any>;
  private groupDefault: Selection<SVGGElement, unknown, HTMLElement, any>;
  private margin: number = 10;

  get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  get radius(): number {
    return this.innerSize / 2;
  }

  get innerSize(): number {
    return this.size - this.margin;
  }

  mounted(): void {
    this.initSvg();
    this.appendCircle();
    this.draw();
    this.addTransition();
  }

  initSvg(): void {
    this.svg = select('svg');
    this.group = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin / 2} ${this.margin / 2})`);
    this.groupDefault = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.innerSize / 2} ${this.innerSize / 2})`,
      );
  }

  appendCircle(): void {
    this.groupDefault
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'none')
      .attr('stroke-width', this.strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', this.radius * 3.14 * 2)
      .attr('stroke-dashoffset', this.radius * 3.14 * 2);
  }

  draw(): void {
    const pieData = pie()
      .sort(null)
      .padAngle(0.2)
      .value((d: any) => d.value);
    const arcData = arc().innerRadius(this.radius).outerRadius(this.radius);
    const groupArcs = this.group
      .append('g')
      .attr(
        'transform',
        `translate(${this.innerSize / 2} ${this.innerSize / 2})`,
      );
    const groupsArcs = groupArcs
      .selectAll('g')
      .data(pieData(this.data as any))
      .enter()
      .append('g');
    groupsArcs
      .append('path')
      .attr('d', arcData as any)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => theme.colors[d.data.color])
      .attr('stroke-width', this.strokeWidth * 0.3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-dasharray', this.radius * 3.14 * 2)
      .attr('stroke-dashoffset', this.radius * 3.14 * 2);
  }

  addTransition(): void {
    this.groupDefault
      .select('circle')
      .transition()
      .ease(easeExp)
      .delay(0)
      .duration(0)
      .attr('stroke-dashoffset', '0')
      .on('end', () => {
        const paths = document.querySelectorAll(`#${this.id} g g path`);
        paths.forEach((path: Element) => {
          const length = (path as SVGPathElement).getTotalLength();
          path.setAttribute('stroke-dasharray', length.toString());
          path.setAttribute('stroke-dashoffset', length.toString());
        });
        selectAll(`#${this.id} g g path`)
          .transition()
          .ease(easeLinear)
          .delay((d, i) => i * 100)
          .duration(500)
          .attr('stroke-dashoffset', 0);
      });
  }

  render(): JSX.Element {
    return <svg width={this.size} viewBox={this.viewBox} id={this.id}></svg>;
  }
}
