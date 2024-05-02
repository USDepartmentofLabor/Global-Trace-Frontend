import { RoleTypeEnum } from 'enums/role';
import { UserRoleEnum } from 'enums/user';
import { isAuthenticated } from 'utils/cookie';
import { getHomeRoute } from 'utils/user';

export function isSuperAdmin(context: App.RouteContext): void {
  return redirectByRoleName({
    context,
    roleName: UserRoleEnum.SUPER_ADMIN,
  });
}

export function isAdmin(context: App.RouteContext): void {
  return redirectByRoleType({
    context,
    roleType: RoleTypeEnum.ADMINISTRATOR,
  });
}

export function isProduct(context: App.RouteContext): void {
  return redirectByRoleType({
    context,
    roleType: RoleTypeEnum.PRODUCT,
  });
}

export function isLabor(context: App.RouteContext): void {
  return redirectByRoleType({
    context,
    roleType: RoleTypeEnum.LABOR,
  });
}

export function isBrand(context: App.RouteContext): void {
  return redirectByRoleType({
    context,
    roleType: RoleTypeEnum.BRAND,
  });
}

function redirectByRoleType({
  context,
  roleType,
  validator,
}: {
  context: App.RouteContext;
  roleType: RoleTypeEnum;
  validator?: () => boolean;
}) {
  const { next, role, to } = context;
  if (!isAuthenticated()) {
    return next({ name: 'SignIn' });
  }
  const roleMatched = !role.type || role.type === roleType;
  const routeValidated = !validator || validator();
  if (roleMatched && routeValidated) {
    return next(to.params);
  }
  return next({ name: getHomeRoute() });
}

function redirectByRoleName({
  context,
  roleName,
}: {
  context: App.RouteContext;
  roleName: UserRoleEnum;
}) {
  const { next, role, to } = context;
  if (!isAuthenticated()) {
    return next({ name: 'SignIn' });
  }
  const roleMatched = !role || role.name === roleName;
  if (roleMatched) {
    return next(to.params);
  }
  return next({ name: getHomeRoute() });
}
