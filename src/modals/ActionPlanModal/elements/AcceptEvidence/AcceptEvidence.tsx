/* eslint-disable max-lines-per-function */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get, head } from 'lodash';
import { getCategoryName } from 'utils/translation';
import Button from 'components/FormUI/Button';
import RadioGroup from 'components/FormUI/Radio/RadioGroup';
import { LevelRiskCategoryEnum } from 'enums/saq';
import * as Styled from './styled';

@Component
export default class AcceptEvidence extends Vue {
  @Prop({ required: true })
  readonly facility: Auth.Facility;
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({
    default: () => {
      //TODO
    },
  })
  cancel: () => void;
  @Prop({
    default: () => {
      //TODO
    },
  })
  submit: (value: string) => void;

  private categoryName: string = '';
  private indicatorName: string = '';
  private subIndicatorName: string = '';
  private value = '';
  private options: App.Radio[] = [
    {
      label: this.$t('extreme'),
      value: LevelRiskCategoryEnum.EXTREME,
    },
    {
      label: this.$t('high'),
      value: LevelRiskCategoryEnum.HIGH,
    },
    {
      label: this.$t('medium'),
      value: LevelRiskCategoryEnum.MEDIUM,
    },
    {
      label: this.$t('low'),
      value: LevelRiskCategoryEnum.LOW,
    },
  ];

  created() {
    const indicatorRiskData = head(this.indicatorRiskData);
    this.categoryName = getCategoryName(
      get(indicatorRiskData, 'indicator.category.name', ''),
      get(indicatorRiskData, 'indicator.category.translation'),
    );

    this.indicatorName = getCategoryName(
      get(indicatorRiskData, 'indicator.name', ''),
      get(indicatorRiskData, 'indicator.translation'),
    );

    const subIndicatorRiskData = head(
      get(indicatorRiskData, 'subIndicatorRiskData', []),
    );
    this.subIndicatorName = getCategoryName(
      get(subIndicatorRiskData, 'subIndicator.name', ''),
      get(subIndicatorRiskData, 'subIndicator.translation'),
    );
  }

  change(value: string): void {
    this.value = value;
  }

  save() {
    this.submit(this.value);
  }

  render(): JSX.Element {
    return (
      <Styled.Wrapper>
        <perfect-scrollbar>
          <Styled.Container>
            <Styled.Text>
              {this.$t('accept_evidence_title', {
                name: get(this.facility, 'name'),
              })}
            </Styled.Text>
            <Styled.Text
              domProps={{
                innerHTML: this.$t('category_value', {
                  value: this.categoryName,
                }),
              }}
            />
            <Styled.Text
              domProps={{
                innerHTML: this.$t('indicator_value', {
                  value: this.indicatorName,
                }),
              }}
            />
            <Styled.Text
              domProps={{
                innerHTML: this.$t('sub_indicator_value', {
                  value: this.subIndicatorName,
                }),
              }}
            />
            <RadioGroup
              value={this.value}
              name="methodology"
              options={this.options}
              changeValue={this.change}
            />
            <Styled.Actions>
              <Styled.ButtonGroupEnd>
                <Button
                  label={this.$t('common.action.cancel')}
                  variant="transparentPrimary"
                  click={this.cancel}
                />
                <Button
                  width="100%"
                  label={this.$t('common.action.save')}
                  click={this.save}
                />
              </Styled.ButtonGroupEnd>
            </Styled.Actions>
          </Styled.Container>
        </perfect-scrollbar>
      </Styled.Wrapper>
    );
  }
}
