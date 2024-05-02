import UniversalCookie from 'universal-cookie';
import { pick } from 'lodash';
import { convertTimestampToDate } from 'utils/date';
import { PermissionActionEnum } from 'enums/role';

const cookie = new UniversalCookie();

const userInfoCookieValue = (user: Auth.User): Auth.User => {
  const role = pick(user.role, ['id', 'name', 'type', 'uploadedSAQ']);
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    status,
    updatedProfileAt,
    answeredSaqAt,
    addedPartnerAt,
    completedConfiguringSystemAt,
  } = user;
  return {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    status,
    updatedProfileAt,
    answeredSaqAt,
    addedPartnerAt,
    completedConfiguringSystemAt,
  };
};

export function setUserInfo(userInfo: Auth.User, expireAt?: number): void {
  cookie.set(
    'userInfo',
    userInfoCookieValue(userInfo),
    expireAt && {
      path: '/',
      expires: convertTimestampToDate(expireAt),
    },
  );
}

export function getUserPermissions(): PermissionActionEnum[] {
  return cookie.get('userPermissions');
}

export function setUserPermissions(
  permissions: RoleAndPermission.Permission[],
  expireAt?: number,
): void {
  cookie.set(
    'userPermissions',
    userPermissionsValue(permissions),
    expireAt && {
      path: '/',
      expires: convertTimestampToDate(expireAt),
    },
  );
}

export function getFacilityTypes(): Auth.FacilityType[] {
  return cookie.get('facilityTypes') || [];
}

export function setFacilityTypes(
  facilityTypes: Auth.FacilityType[],
  expireAt?: number,
): void {
  cookie.set(
    'facilityTypes',
    facilityTypes,
    expireAt && {
      path: '/',
      expires: convertTimestampToDate(expireAt),
    },
  );
}

export function userPermissionsValue(
  permissions: RoleAndPermission.Permission[],
): PermissionActionEnum[] {
  return permissions.map(({ action }) => action);
}

export function getUserInfo() {
  return cookie.get('userInfo');
}

export function setAccessToken({
  token,
  expireAt,
}: {
  token: string;
  expireAt: number;
}): void {
  cookie.set('token', token, {
    path: '/',
    expires: convertTimestampToDate(expireAt),
  });
}

export function getAccessToken(): string {
  return cookie.get('token');
}

export function setRefreshToken({
  refreshToken,
  expireAt,
}: {
  refreshToken: string;
  expireAt: number;
}) {
  cookie.set('refreshToken', refreshToken, {
    path: '/',
    expires: convertTimestampToDate(expireAt),
  });
}

export function getRefreshToken() {
  return cookie.get('refreshToken');
}

export function isAuthenticated(): boolean {
  const userInfo = getUserInfo();
  const token = getAccessToken();
  const permissions = getUserPermissions();
  return !!userInfo && !!token && !!permissions;
}

export function revokeUser(): void {
  const options = {
    path: '/',
  };
  cookie.remove('userInfo', options);
  cookie.remove('userPermissions', options);
  cookie.remove('token', options);
  cookie.remove('facilityTypes', options);
}
