import { find, get } from 'lodash';
import { YES_NO_COLOR } from 'config/constants';
import { TrashContentEnum } from 'enums/app';
import { YesNoEnum } from 'enums/brand';
import { UserRoleEnum } from 'enums/user';
import { translate } from './helpers';

export function getRiskAssessmentStatus(
  riskLevel: Auth.RiskData,
): TrashContentEnum | string {
  return get(riskLevel, 'overallRisk.level', '');
}

export function hasSupplierDetail(
  isOrder: boolean,
  isCompletedSAQ: boolean,
  facilityType: UserRoleEnum,
): boolean {
  const farmGroupTypes = [UserRoleEnum.FARM, UserRoleEnum.FARM_GROUP];
  const isFarmGroupType = farmGroupTypes.some((type) => type === facilityType);
  if (isFarmGroupType) {
    return true;
  }
  const transformationTypes = [
    UserRoleEnum.SPINNER,
    UserRoleEnum.MILL,
    UserRoleEnum.GINNER,
  ];
  const isTransformationType = transformationTypes.some(
    (type) => type === facilityType,
  );
  const notCompletedSAQOnOrder = isOrder && !isCompletedSAQ;
  if (!isTransformationType || notCompletedSAQOnOrder) {
    return false;
  }
  return true;
}

export function getDocumentLabel(document: BrandSupplier.Document) {
  if (document) {
    const { hasInvoice, hasPackingList, hasProof } = document;
    const label: string[] = [];
    if (hasPackingList) {
      label.push(translate('packing_list'));
    }
    if (hasInvoice) {
      label.push(translate('invoice'));
    }
    if (hasProof) {
      label.push(translate('purchase_proofs'));
    }
    return label.join(', ');
  }
  return '';
}

export function getNormalStatus(status: YesNoEnum): string {
  switch (status) {
    case YesNoEnum.YES:
      return YES_NO_COLOR.YES;
    default:
      return YES_NO_COLOR.NO;
  }
}

export function getCheckColor(group: Auth.ScoreGroup, type: string): string {
  const status = get(
    find(group.groups, (g) => g.type === type),
    'status',
    '',
  ) as YesNoEnum;
  return getNormalStatus(status);
}
