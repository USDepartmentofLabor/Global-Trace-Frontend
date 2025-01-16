import { auth, isSystemConfigured, isSystemConfiguring } from '../middlewares';
import { isSuperAdmin } from '../middlewares/role';

const UserManagementPage = () => import('pages/UserManagementPage');
const SettingPage = () => import('pages/SettingPage');
const ConfigurationSystemPage = () => import('pages/ConfigurationSystemPage');

export default [
  {
    path: 'configuration',
    name: 'Configuration',
    component: ConfigurationSystemPage,
    meta: {
      middleware: [auth, isSuperAdmin, isSystemConfiguring],
    },
  },
  {
    path: 'super-admin-user-management',
    name: 'SuperAdminUserManagement',
    component: UserManagementPage,
    meta: {
      middleware: [auth, isSuperAdmin, isSystemConfigured],
    },
  },
  {
    path: 'super-admin-settings',
    name: 'SuperAdminSetting',
    component: SettingPage,
    meta: {
      middleware: [auth, isSuperAdmin, isSystemConfigured],
    },
  },
];
