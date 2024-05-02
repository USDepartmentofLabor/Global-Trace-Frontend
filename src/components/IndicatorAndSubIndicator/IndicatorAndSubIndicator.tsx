import { Vue, Component, Prop } from 'vue-property-decorator';
import { get } from 'lodash';
import AppModule from 'store/modules/app';
import Accordion from 'components/Accordion';
import RiskLabel from 'components/RiskLabel';
import { formatDate } from 'utils/date';
import { DATE_TIME_FORMAT, DEFAULT_LANGUAGE } from 'config/constants';
import * as Styled from './styled';

@Component
export default class IndicatorAndSubIndicator extends Vue {
  @Prop({ required: true })
  readonly indicatorRiskData: Auth.IndicatorRiskData[];
  @Prop({ default: false }) readonly isExpanded: boolean;

  get currentLocale(): string {
    return AppModule.locale;
  }

  getName(
    name: string,
    translation: {
      [x: string]: string;
    },
  ): string {
    return this.currentLocale === DEFAULT_LANGUAGE
      ? name
      : translation?.[this.currentLocale] || name;
  }

  renderRiskItem(
    item: Auth.IndicatorRiskData | Auth.SubIndicatorRiskData,
    isIndicatorStyle: boolean,
  ): JSX.Element {
    return (
      <Styled.RiskItem
        hasBorder={isIndicatorStyle}
        isExpanded={this.isExpanded}
      >
        <Styled.RiskLabel
          isBold={isIndicatorStyle}
          isExpanded={this.isExpanded}
        >
          {isIndicatorStyle
            ? this.getName(
                get(item, 'indicator.name', ''),
                get(item, 'indicator.translation'),
              )
            : this.getName(
                get(item, 'subIndicator.name', ''),
                get(item, 'subIndicator.translation'),
              )}
        </Styled.RiskLabel>
        <RiskLabel
          level={get(item, 'risk.level', '')}
          text={get(item, 'risk.level', '')}
        />
        {!this.isExpanded && (
          <Styled.Arrow class="arrow">
            <font-icon name="chevron_right" color="black" size="20" />
          </Styled.Arrow>
        )}
      </Styled.RiskItem>
    );
  }

  renderContent(content: Auth.SubIndicatorData, index: number): JSX.Element {
    return (
      <Styled.SubIndicator key={index} isExpanded={this.isExpanded}>
        <Styled.RickItem isExpanded={this.isExpanded}>
          <Styled.RickDate>
            {formatDate(
              get(content, 'createdAt', '') as number,
              DATE_TIME_FORMAT,
            )}
          </Styled.RickDate>
          <Styled.Risk>
            <RiskLabel
              width="130px"
              level={get(content, 'risk.level', '')}
              text={get(content, 'source', '')}
            />
          </Styled.Risk>
          <Styled.RickTitle>{get(content, 'note', '')}</Styled.RickTitle>
          {content.isIndirect && <Styled.Tag>{this.$t('indirect')}</Styled.Tag>}
        </Styled.RickItem>
      </Styled.SubIndicator>
    );
  }

  renderAccordion(): JSX.Element {
    return (
      <fragment>
        {this.indicatorRiskData.map((item, index) => (
          <Accordion key={index} maxHeight="100%">
            <fragment slot="title">{this.renderRiskItem(item, true)}</fragment>
            <fragment slot="content">
              {item.subIndicatorRiskData.map((subIndicator, index) => (
                <Styled.Group>
                  <Accordion key={index}>
                    <Styled.SubIndicator slot="title">
                      {this.renderRiskItem(subIndicator, false)}
                    </Styled.SubIndicator>
                    <Styled.Content slot="content">
                      {subIndicator.data.map((content, index) =>
                        this.renderContent(content, index),
                      )}
                    </Styled.Content>
                  </Accordion>
                </Styled.Group>
              ))}
            </fragment>
          </Accordion>
        ))}
      </fragment>
    );
  }

  renderExpanded(): JSX.Element {
    return (
      <fragment>
        {this.indicatorRiskData.map((item, index) => (
          <Styled.IndicatorGroup key={index}>
            <Styled.IndicatorTitle>
              {this.renderRiskItem(item, true)}
            </Styled.IndicatorTitle>
            {item.subIndicatorRiskData.map((subIndicator, index) => (
              <Styled.SubIndicatorGroup key={index}>
                <Styled.SubIndicator isExpanded={this.isExpanded}>
                  {this.renderRiskItem(subIndicator, false)}
                </Styled.SubIndicator>
                {subIndicator.data.map((content, index) =>
                  this.renderContent(content, index),
                )}
              </Styled.SubIndicatorGroup>
            ))}
          </Styled.IndicatorGroup>
        ))}
      </fragment>
    );
  }

  render(): JSX.Element {
    return (
      <Styled.IndicatorList isExpanded={this.isExpanded}>
        {this.isExpanded && this.renderExpanded()}
        {!this.isExpanded && this.renderAccordion()}
      </Styled.IndicatorList>
    );
  }
}
