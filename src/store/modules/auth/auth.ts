/* eslint-disable max-lines */
import { get, noop } from 'lodash';
import {
  Action,
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from 'store/index';
import purchaseModule from 'store/modules/purchase';
import sellProductModule from 'store/modules/sell-product';
import transportModule from 'store/modules/transport';

import { SignOutTypeEnum, UserRoleEnum } from 'enums/user';
import {
  getAllPermissions,
  getPermissionActions,
  getUserRole,
  isCompletedConfiguration,
  isProductRole,
  isLaborRole,
} from 'utils/user';
import { signIn, logOut, getFacilityTypes } from 'api/auth';
import {
  revokeUser,
  setAccessToken,
  setFacilityTypes,
  setUserInfo,
  setUserPermissions,
} from 'utils/cookie';
import { PermissionActionEnum, RoleTypeEnum } from 'enums/role';
import { deleteMyAccount } from 'api/user-setting';

@Module({
  dynamic: true,
  namespaced: true,
  name: 'auth',
  store: store,
})
class Auth extends VuexModule implements AppStore.AuthState {
  public isAuthenticated: boolean = false;
  public user: Auth.User = null;
  public permissions: PermissionActionEnum[] = [];
  public facilityTypes: Auth.FacilityType[] = [];

  public get userRole(): RoleAndPermission.Role {
    return getUserRole(this.user);
  }

  public get isAdmin(): boolean {
    return this.userRole && this.userRole.type === RoleTypeEnum.ADMINISTRATOR;
  }

  public get isProduct(): boolean {
    return this.userRole && this.userRole.type === RoleTypeEnum.PRODUCT;
  }

  public get isBrand(): boolean {
    return this.userRole && this.userRole.type === RoleTypeEnum.BRAND;
  }

  public get isLabor(): boolean {
    return this.userRole && this.userRole.type === RoleTypeEnum.LABOR;
  }

  public get isSuperAdmin(): boolean {
    return this.userRole && this.userRole.name === UserRoleEnum.SUPER_ADMIN;
  }

  public get isCompletedConfiguration(): boolean {
    return isCompletedConfiguration(this.user);
  }

  public get isColumnLayout(): boolean {
    return this.isProductRole || this.isLaborRole;
  }

  public get isProductRole(): boolean {
    return isProductRole(this.user);
  }

  public get isLaborRole(): boolean {
    return isLaborRole(this.user);
  }

  public get hasProductTracingPermissions(): boolean {
    return this.permissions.some((action) =>
      [
        PermissionActionEnum.LOG_PURCHASE,
        PermissionActionEnum.LOG_SALE,
        PermissionActionEnum.LOG_TRANSPORT,
        PermissionActionEnum.LOG_TRANSFORMATIONS,
        PermissionActionEnum.LOG_BY_PRODUCT,
      ].includes(action),
    );
  }

  public get hasManagePartnerMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.INVITE_PARTNERS);
  }

  public get hasOverviewMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.VIEW_HISTORY);
  }

  public get hasViewMarginOfError(): boolean {
    return this.permissions.includes(PermissionActionEnum.VIEW_MARGIN_OF_ERROR);
  }

  public get hasUserManagementMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.USER_MANAGEMENT);
  }

  public get hasFarmManagementMenu(): boolean {
    return this.isAdmin;
  }

  public get hasReportListMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.SUBMIT_ASSESSMENTS);
  }

  public get hasReferReport(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.REFER_REPORT_FOR_FOLLOW_UP,
    );
  }

  public get hasDNA(): boolean {
    return this.permissions.includes(PermissionActionEnum.DNA);
  }

  public get hasQRCodeManagementMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.GENERATE_QR_CODES);
  }

  public get hasDNATestMenu(): boolean {
    return this.permissions.some((action) =>
      [
        PermissionActionEnum.LOG_DNA_TEST_RESULTS,
        PermissionActionEnum.VIEW_DNA_TEST_RESULTS,
      ].includes(action),
    );
  }

  public get hasLogDNA(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_DNA_TEST_RESULTS);
  }

  public get hasSiteSettings(): boolean {
    return this.isSuperAdmin;
  }

  public get hasRoleAndPermissions(): boolean {
    return this.isSuperAdmin;
  }

  public get hasAuditorRequestMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.VIEW_REPORTS);
  }

  public get hasCommunityRiskScan(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.PROACTIVE_ASSESSMENTS,
    );
  }

  public get hasRespondToRequests(): boolean {
    return this.permissions.includes(PermissionActionEnum.REACTIVE_ASSESSMENTS);
  }

  public get hasDNAInputField(): boolean {
    return this.permissions.includes(PermissionActionEnum.ASSIGN_DNA);
  }

  public get hasSuppliersMenu(): boolean {
    return this.isBrand;
  }

  public get hasRequireSAQ(): boolean {
    return this.permissions.includes(PermissionActionEnum.COMPLETE_OWN_SAQ);
  }

  public get uploadedSAQ(): boolean {
    return this.userRole && this.userRole.uploadedSAQ;
  }

  public get hasExtendedProfile(): boolean {
    return this.isBrand;
  }

  public get hasTraceProduct(): boolean {
    return this.permissions.includes(PermissionActionEnum.TRACE_PRODUCT);
  }
  public get hasViewSupplierDetail(): boolean {
    return this.permissions.some((action) =>
      [
        PermissionActionEnum.VIEW_SUPPLIER_RISK_ASSESSMENT,
        PermissionActionEnum.VIEW_SUPPLIER_RISK_ASSESSMENT_IN_SUPPLIER_MANAGEMENT,
        PermissionActionEnum.VIEW_SUPPLIER_RISK_ASSESSMENT_IN_USER_MANAGEMENT,
      ].includes(action),
    );
  }

  public get hasPurchaseMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_PURCHASE);
  }

  public get hasInputProductIdOfLogPurchase(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.INPUT_PRODUCT_ID_IN_PURCHASE,
    );
  }

  public get hasScanQRCodeOfLogPurchase(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.SCAN_QR_CODE_IN_PURCHASE,
    );
  }

  public get hasAllowPurchaseIntermediaries(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.ALLOW_PURCHASE_INTERMEDIARIES,
    );
  }

  public get hasManuallyDefineNewProduct(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.MANUALLY_DEFINE_NEW_PRODUCT,
    );
  }

  public get onlyManuallyDefineNewProduct(): boolean {
    return (
      this.permissions.includes(
        PermissionActionEnum.MANUALLY_DEFINE_NEW_PRODUCT,
      ) &&
      !this.hasInputProductIdOfLogPurchase &&
      !this.hasAllowPurchaseIntermediaries &&
      !this.hasScanQRCodeOfLogPurchase
    );
  }

  public get hasAssignProductMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_TRANSFORMATIONS);
  }

  public get hasAssignProductId(): boolean {
    return this.permissions.includes(PermissionActionEnum.ASSIGN_PRODUCT_ID);
  }

  public get hasAssignQRCode(): boolean {
    return this.permissions.includes(PermissionActionEnum.ASSIGN_QR_CODE);
  }

  public get hasRecordByProductMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_BY_PRODUCT);
  }

  public get hasSellMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_SALE);
  }

  public get hasInputProductIdOfLogSale(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.INPUT_PRODUCT_ID_IN_SALE,
    );
  }

  public get hasScanQRCodeOfLogSale(): boolean {
    return this.permissions.includes(PermissionActionEnum.SCAN_QR_CODE_IN_SALE);
  }

  public get hasTransportMenu(): boolean {
    return this.permissions.includes(PermissionActionEnum.LOG_TRANSPORT);
  }

  public get hasInputProductIdOfTransport(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.INPUT_PRODUCT_ID_IN_TRANSPORT,
    );
  }

  public get hasScanQRCodeOfTransport(): boolean {
    return this.permissions.includes(
      PermissionActionEnum.SCAN_QR_CODE_IN_TRANSPORT,
    );
  }

  @Action
  public async signIn({
    data,
    callback,
  }: {
    data: Auth.UserCertificate;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      const response = await signIn(data);
      this.SIGN_IN(response);
      if (this.hasUserManagementMenu && this.isAdmin) {
        const facilityTypesData = await getFacilityTypes();
        setFacilityTypes(
          facilityTypesData.map(({ id, name }) => ({ id, name })),
          response.expireAt,
        );
      }
      onSuccess(response);
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public async signOut({
    type,
    callback,
  }: {
    type: SignOutTypeEnum;
    callback: App.Callback;
  }): Promise<void> {
    const onSuccess = get(callback, 'onSuccess', noop);
    const onFailure = get(callback, 'onFailure', noop);
    const onFinish = get(callback, 'onFinish', noop);

    try {
      switch (type) {
        case SignOutTypeEnum.DELETE_MY_ACCOUNT:
          await deleteMyAccount();
          break;
        default:
          await logOut();
          break;
      }
      purchaseModule.resetPartnerSellers();
      sellProductModule.resetPartnerPurchasers();
      transportModule.resetPartnerTransporters();
      this.SIGN_OUT();
      onSuccess();
    } catch (error) {
      onFailure(error);
    } finally {
      onFinish();
    }
  }

  @Action
  public setUser(data: Auth.User): void {
    this.SET_USER(data);
  }

  @Action
  public setPermissions(permissions: PermissionActionEnum[]): void {
    this.SET_PERMISSIONS(permissions);
  }

  @Action
  public setFacilityTypes(facilityTypes: Auth.FacilityType[]): void {
    this.SET_FACILITY_TYPES(facilityTypes);
  }

  @Mutation
  private SIGN_IN(data: Auth.UserAuthentication): void {
    const { token, expireAt, user } = data;
    this.isAuthenticated = true;
    this.user = user;
    this.permissions = getPermissionActions(
      getAllPermissions(getUserRole(user)),
    );
    setAccessToken({ token, expireAt });
    setUserInfo(user, expireAt);
    setUserPermissions(getAllPermissions(getUserRole(user)), expireAt);
  }

  @Mutation
  private SIGN_OUT(): void {
    this.isAuthenticated = false;
    this.user = null;
    revokeUser();
  }

  @Mutation
  private SET_USER(data: Auth.User): void {
    this.user = data;
  }

  @Mutation
  private SET_PERMISSIONS(permissions: PermissionActionEnum[]): void {
    this.permissions = permissions;
  }

  @Mutation
  private SET_FACILITY_TYPES(facilityTypes: Auth.FacilityType[]): void {
    this.facilityTypes = facilityTypes;
  }
}

export default getModule(Auth);
