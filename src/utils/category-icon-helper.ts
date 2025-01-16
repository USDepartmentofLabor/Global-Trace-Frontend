import { CATEGORY_ICONS } from 'config/constants';
import { convertEnumToTranslation } from './translation';

export function getCategoryIcons(): App.DropdownOption[] {
  return CATEGORY_ICONS.map((value) => ({
    id: value,
    icon: convertEnumToTranslation(value).toUpperCase(),
  }));
}
