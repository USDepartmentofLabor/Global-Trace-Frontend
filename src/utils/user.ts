import {
  compact,
  difference,
  flatMap,
  get,
  head,
  isNull,
  join,
  uniq,
} from 'lodash';
import { PartnerTypeEnum } from 'enums/onboard';
import {
  TransformPartnerTypeEnum,
  FacilityTypeEnum,
  ProducerTypeEnum,
} from 'enums/user';
import { PermissionActionEnum, RoleTypeEnum } from 'enums/role';
import { getUserPermissions } from './cookie';
import { menuList } from './menu';

export function getHomeRoute(): string {
  const firstMenu = head(menuList());
  return get(firstMenu, 'name', 'SignIn');
}

export function hasPermission(
  permissions: RoleAndPermission.Permission[],
  actionValue: PermissionActionEnum,
): boolean {
  let hasPermission = false;
  permissions.forEach(({ action, subPermissions }) => {
    const hasAction = action === actionValue;
    const subActions = flatMap(subPermissions, 'action');
    const hasSubAction = subActions.some((value) => value === actionValue);
    if (!hasPermission && (hasAction || hasSubAction)) {
      hasPermission = true;
    }
  });
  return hasPermission;
}

export function profileUpdated(user: Auth.User): boolean {
  return !isNull(user.updatedProfileAt);
}

export function producerRegistered(user: Auth.User): boolean {
  const permissionActions = getUserPermissions();
  const hasInvitePartner = permissionActions.includes(
    PermissionActionEnum.INVITE_PARTNERS,
  );
  const userRole = getUserRole(user);
  const uploadedSAQ = get(userRole, 'uploadedSAQ');
  const hasSaq = !permissionActions.includes(PermissionActionEnum.NO_SAQ);
  const addedPartnerAt = get(user, 'currentFacility.addedPartnerAt', null);
  const answeredSaqAt = get(user, 'currentFacility.answeredSaqAt', null);

  return (
    profileUpdated(user) &&
    !(isNull(addedPartnerAt) && hasInvitePartner) &&
    !(hasSaq && isNull(answeredSaqAt) && uploadedSAQ)
  );
}

export function isCompletedConfiguration(user: Auth.User): boolean {
  return !isNull(user.completedConfiguringSystemAt);
}

export function getUserRole(user: Auth.User): RoleAndPermission.Role {
  return get(user, 'role');
}

export function getUserFacility(user: Auth.User): Auth.Facility {
  return get(user, 'currentFacility');
}

export function getUserRoleAttributes(user: Auth.User): Auth.RoleAttributes {
  return get(user, 'roleAttributes');
}

export function getFirstAdmin(user: Auth.User): Auth.User {
  return get(user, 'currentFacility.firstAdmin', null);
}

export function isAdminUser(user: Auth.User): boolean {
  return get(user, 'userType') === ProducerTypeEnum.ADMIN;
}

export function isStandardUser(user: Auth.User): boolean {
  return get(user, 'userType') === ProducerTypeEnum.STANDARD;
}

export function isProductRole(user: Auth.User): boolean {
  const userRole = getUserRole(user);
  return userRole && userRole.type === RoleTypeEnum.PRODUCT;
}

export function isLaborRole(user: Auth.User): boolean {
  const userRole = getUserRole(user);
  return userRole && userRole.type === RoleTypeEnum.LABOR;
}

export function isAPIRole(user: Auth.User): boolean {
  const userRole = getUserRole(user);
  return userRole && userRole.type === RoleTypeEnum.API_USER;
}

export function getPartnerTypeShortName(type: PartnerTypeEnum): string {
  switch (type) {
    case PartnerTypeEnum.BROKER:
      return 'broker';
    case PartnerTypeEnum.PROCESSING_FACILITY:
      return 'facility';
    case PartnerTypeEnum.TRANSPORTER:
      return 'transporter';
    case PartnerTypeEnum.TRANSFORMATION_PARTNER:
      return 'business_partner';
    default:
      break;
  }
}

export function getPartnerTypeFromFacilityType(
  facilityType: FacilityTypeEnum,
): TransformPartnerTypeEnum {
  switch (facilityType) {
    case FacilityTypeEnum.GINNER:
      return TransformPartnerTypeEnum.GINNER;
    case FacilityTypeEnum.SPINNER:
      return TransformPartnerTypeEnum.SPINNER;
    case FacilityTypeEnum.MILL:
      return TransformPartnerTypeEnum.MILL;
    case FacilityTypeEnum.FARM:
      return TransformPartnerTypeEnum.FARM;
    default:
      break;
  }
}

export function getLastTiers(
  supplierGroups: BrandSupplier.TraceSupplierMapGroup[],
): string[] {
  const orderSupplierIds = supplierGroups.map(
    ({ orderSupplierId }) => orderSupplierId,
  );
  const targets = supplierGroups.reduce(
    (total, supplier) => [...total, ...flatMap(supplier.targets, 'targetId')],
    [],
  );
  const notInTargetIds = difference(orderSupplierIds, targets);
  const lastTiers = notInTargetIds.map(
    (id) =>
      supplierGroups.find(({ orderSupplierId }) => orderSupplierId === id).type
        .name,
  );
  return uniq(lastTiers);
}

export function getRoleName(user: Auth.User): string {
  return get(user, 'role.name');
}

export function isLogGroup(action: PermissionActionEnum): boolean {
  return [
    PermissionActionEnum.LOG_PURCHASE,
    PermissionActionEnum.LOG_SALE,
  ].includes(action);
}

export function getAllPermissions(
  role: RoleAndPermission.Role,
): RoleAndPermission.Permission[] {
  const { permissions } = role;
  return permissions;
}

export function getPermissionActions(
  permissions: RoleAndPermission.Permission[],
): PermissionActionEnum[] {
  return permissions.map(({ action }) => action);
}

export function isSupplier(roleType: RoleTypeEnum): boolean {
  return roleType === RoleTypeEnum.PRODUCT;
}

export function getUserAvatarByName(
  firstName: string,
  lastName: string,
): string {
  const avatarString = `${head(firstName)}${head(lastName)}`;
  return join(compact(avatarString), '').toUpperCase();
}
