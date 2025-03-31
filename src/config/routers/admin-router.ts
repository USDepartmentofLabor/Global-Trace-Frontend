import { getFacilityMenu } from 'utils/menu';
import {
  auth,
  hasAdministerUser,
  hasViewAllReports,
  hasManageQRCodes,
  hasDNATestResult,
  hasTraceProduct,
} from '../middlewares';
import { isAdmin } from '../middlewares/role';

const UserManagementPage = () => import('pages/UserManagementPage');
const FacilityManagementPage = () => import('pages/FacilityManagementPage');
const GrievanceReportPage = () => import('pages/GrievanceReportPage');
const QRCodeManagementPage = () => import('pages/QRCodeManagementPage');
const QRCodeHistoryPage = () => import('pages/QRCodeHistoryPage');
const DNAManagementPage = () => import('pages/DNAManagementPage');
const SettingPage = () => import('pages/SettingPage');
const BrandProductOrderPage = () => import('pages/BrandProductOrderPage');

export const getFacilityRouters = () => {
  const menus = getFacilityMenu();
  return menus.map(({ params, name }) => {
    return {
      path: `/facility-management/${params.id}`,
      name,
      component: FacilityManagementPage,
      meta: {
        middleware: [auth, hasAdministerUser, isAdmin],
        params,
      },
    };
  });
};

export default [
  {
    path: 'user-management',
    name: 'UserManagement',
    component: UserManagementPage,
    meta: {
      middleware: [auth, hasAdministerUser, isAdmin],
    },
  },
  ...getFacilityRouters(),
  {
    path: 'grievance-reports',
    name: 'GrievanceReport',
    component: GrievanceReportPage,
    meta: {
      middleware: [auth, hasViewAllReports, isAdmin],
    },
  },
  {
    path: 'qr-code-management',
    name: 'QRCodeManagement',
    component: QRCodeManagementPage,
    meta: {
      middleware: [auth, hasManageQRCodes, isAdmin],
    },
  },
  {
    path: 'qr-code-history',
    name: 'QRCodeHistory',
    component: QRCodeHistoryPage,
    meta: {
      middleware: [auth, hasManageQRCodes, isAdmin],
    },
  },
  {
    path: 'dna-management',
    name: 'DNAManagement',
    component: DNAManagementPage,
    meta: {
      middleware: [auth, hasDNATestResult, isAdmin],
    },
  },
  {
    path: 'brand-product-order',
    name: 'BrandProductOrder',
    component: BrandProductOrderPage,
    meta: {
      middleware: [auth, hasTraceProduct],
    },
  },
  {
    path: 'settings',
    name: 'Setting',
    component: SettingPage,
    meta: {
      middleware: [auth, isAdmin],
    },
  },
];
