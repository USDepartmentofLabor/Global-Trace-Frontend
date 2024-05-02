import { Vue, Component, Prop } from 'vue-property-decorator';
import { BaseType, Selection, select, pie, arc } from 'd3';
import theme from 'styles/theme';
import * as Styled from './styled';

@Component
export default class PieChart extends Vue {
  @Prop({ required: true }) chartData: PDFPreview.ChartData;
  @Prop({ default: 110 }) size: number;
  @Prop({ default: false }) showLegend: boolean;
  @Prop({ default: 'pieChart' }) id: string;

  private colors: string[] = [
    'highland',
    'envy',
    'surfCrest',
    'rawSienna',
    'sandyBrown',
    'sideCar',
    'spunPearl',
    'ghost',
    'wildSand',
    'sunglo',
    'vividTangerine',
    'sundown',
    'dodgerBlue',
    'malibu',
    'periwinkle',
    'cuttySark',
    'jupiter',
    'tiara',
    'steelBlue',
  ];
  private svg: Selection<BaseType, unknown, HTMLElement, App.Any>;
  private group: Selection<SVGGElement, unknown, HTMLElement, App.Any>;
  private groupDefault: Selection<SVGGElement, unknown, HTMLElement, App.Any>;
  private pieData: App.PieData[] = [];

  get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  get radius(): number {
    return this.size / 2;
  }

  mounted(): void {
    this.initSvg();
    this.appendCircle();
    this.pieData = this.getPieChartData(this.chartData.data);
    this.draw();
  }

  getPercent(value: number, total: number): number {
    return (value / total) * 100;
  }

  getPieChartData(data: PDFPreview.Data[]): App.PieData[] {
    const totalValue = data.reduce((total, { value }) => total + value, 0);
    return data.map(({ value, name }, index: number) => {
      return {
        value: this.getPercent(value, totalValue),
        label: name ?? null,
        color: this.colors[index],
      };
    });
  }

  getColor(data: App.PieData): string {
    return theme.colors[data.color];
  }

  initSvg(): void {
    this.svg = select(`#${this.id}`);
    this.group = this.svg.append('g').attr('transform', `translate(0 0)`);
    this.groupDefault = this.svg
      .append('g')
      .attr('transform', `translate(${this.radius} ${this.radius})`);
  }

  appendCircle(): void {
    this.groupDefault
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'none');
  }

  draw(): void {
    const pieData = pie()
      .sort(null)
      .padAngle(0)
      .value((d: App.Any) => d.value);
    const arcData = arc().innerRadius(0).outerRadius(this.radius);
    const groupArcs = this.group
      .append('g')
      .attr('transform', `translate(${this.radius} ${this.radius})`);
    const groupsArcs = groupArcs
      .selectAll('g')
      .data(pieData(this.pieData as App.Any))
      .enter()
      .append('g');
    groupsArcs
      .append('path')
      .attr('d', arcData as App.Any)
      .attr('fill', (d: App.Any) => this.getColor(d.data));
  }

  renderLegend(data: App.PieData): JSX.Element {
    return (
      <Styled.Row>
        <Styled.Color color={this.getColor(data)} />
        <Styled.Legend>{data.label}</Styled.Legend>
      </Styled.Row>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <Styled.Row>
          <svg width={this.size} viewBox={this.viewBox} id={this.id} />
          {this.showLegend && (
            <Styled.Col>
              {this.pieData.map((data) => this.renderLegend(data))}
            </Styled.Col>
          )}
        </Styled.Row>
        <Styled.ChartInfo>
          <Styled.Label>{this.chartData.chartInfo}</Styled.Label>
        </Styled.ChartInfo>
      </Styled.Wrapper>
    );
  }
}
