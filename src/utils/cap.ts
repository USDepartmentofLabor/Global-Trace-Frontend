import { TimePeriodEnum } from 'src/enums/brand';
import { translate } from './helpers';

export function getTimePeriodOptions(): App.DropdownOption[] {
  return [
    {
      id: TimePeriodEnum.ONE_WEEK,
      name: translate('value_week', { value: 1 }),
    },
    {
      id: TimePeriodEnum.TWO_WEEKS,
      name: translate('value_weeks', { value: 2 }),
    },
    {
      id: TimePeriodEnum.ONE_MONTH,
      name: translate('value_month', { value: 1 }),
    },
    {
      id: TimePeriodEnum.TWO_MONTHS,
      name: translate('value_months', { value: 2 }),
    },
    {
      id: TimePeriodEnum.SIX_MONTHS,
      name: translate('value_months', { value: 6 }),
    },
    {
      id: TimePeriodEnum.TWELVE_MONTHS,
      name: translate('value_months', { value: 12 }),
    },
  ];
}
