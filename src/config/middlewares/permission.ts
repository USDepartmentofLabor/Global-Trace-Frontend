import { PermissionActionEnum } from 'enums/role';
import { isAuthenticated } from 'utils/cookie';
import {
  getHomeRoute,
  profileUpdated,
  transformationPartnerRegistered,
} from 'utils/user';

export function guest(context: App.RouteContext): void {
  const { next, isLoggedIn } = context;
  if (isLoggedIn) {
    return next({ name: getHomeRoute() });
  }

  return next();
}

export function auth(context: App.RouteContext): void {
  const { next, isLoggedIn } = context;
  if (isLoggedIn) {
    return next();
  }

  return next({ name: 'SignIn' });
}

export function supplierOnboard(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: null,
    validator: (): boolean => !transformationPartnerRegistered(context.user),
  });
}

export function supplierRegistered(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: null,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasLogPurchase(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.LOG_PURCHASE,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasLogSale(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.LOG_SALE,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasLogByProduct(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.LOG_BY_PRODUCT,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasLogTransport(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.LOG_TRANSPORT,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasLogTransformation(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.LOG_TRANSFORMATIONS,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasViewHistory(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.VIEW_HISTORY,
    validator: (): boolean => transformationPartnerRegistered(context.user),
  });
}

export function hasAdministerUser(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.USER_MANAGEMENT,
  });
}

export function hasViewAllReports(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.VIEW_ALL_REPORTS,
  });
}

export function hasManageQRCodes(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.GENERATE_QR_CODES,
  });
}

export function hasDNATestResult(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: null,
  });
}

export function auditorOnboard(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.ONBOARDING,
    validator: (): boolean => !profileUpdated(context.user),
  });
}

export function auditorRequest(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.VIEW_ALL_REPORTS,
    validator: (): boolean => profileUpdated(context.user),
  });
}

export function brandOnboard(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.ONBOARDING,
    validator: (): boolean => !profileUpdated(context.user),
  });
}

export function brandRegistered(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.ONBOARDING,
    validator: (): boolean => profileUpdated(context.user),
  });
}

export function hasViewSupplierDatabase(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.VIEW_SUPPLIER_RISK_ASSESSMENT,
    validator: (): boolean => profileUpdated(context.user),
  });
}

export function hasTraceProduct(context: App.RouteContext): void {
  return redirectByPermission({
    context,
    permission: PermissionActionEnum.TRACE_PRODUCT,
    validator: (): boolean => profileUpdated(context.user),
  });
}

function redirectByPermission({
  context,
  permission,
  validator,
}: {
  context: App.RouteContext;
  permission: PermissionActionEnum;
  validator?: () => boolean;
}) {
  const { next, permissions, to } = context;
  if (!isAuthenticated()) {
    return next({ name: 'SignIn' });
  }
  const permissionMatched = !permission || permissions.includes(permission);
  const routeValidated = !validator || validator();
  if (permissionMatched && routeValidated) {
    return next(to.params);
  }
  return next({ name: getHomeRoute() });
}
