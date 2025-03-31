import { isNull } from 'lodash';
import auth from 'store/modules/auth';
import { RoleTypeEnum } from 'enums/role';
import { profileUpdated, producerRegistered } from './user';
import { getFacilityTypes, isAuthenticated } from './cookie';

export function menuList(): App.Menu[] {
  if (!isAuthenticated()) {
    return [];
  }
  if (auth.isSuperAdmin) {
    return getSuperAdminMenus();
  }
  switch (auth.userRole.type) {
    case RoleTypeEnum.ADMINISTRATOR:
      return getAdminMenus();
    case RoleTypeEnum.PRODUCT:
      return getSupplierMenus();
    case RoleTypeEnum.LABOR:
      return getLaborMenus();
    case RoleTypeEnum.BRAND:
      return getBrandMenus();
    default:
      return [];
  }
}

function getSuperAdminMenus(): App.Menu[] {
  if (auth.isCompletedConfiguration) {
    return [
      {
        label: 'sidebar.user_management',
        icon: '',
        name: 'SuperAdminUserManagement',
        active: ['SuperAdminUserManagement'],
      },
      {
        label: 'sidebar.settings',
        icon: '',
        name: 'SuperAdminSetting',
        active: [],
      },
    ];
  }
  return [
    {
      label: 'sidebar.settings',
      icon: 'home',
      name: 'Configuration',
      active: [],
    },
  ];
}

/* eslint-disable max-lines-per-function */
function getSupplierMenus(): App.Menu[] {
  const isProfileUpdated = producerRegistered(auth.user);
  if (!isProfileUpdated && auth.isProduct) {
    return [
      {
        label: 'sidebar.onboard',
        icon: '',
        name: 'Onboard',
        active: [],
      },
    ];
  }
  return [
    isProfileUpdated && auth.hasProductTracingPermissions
      ? {
          label: 'sidebar.product_activities',
          icon: '',
          name: 'Homepage',
          active: [
            'Homepage',
            'Purchase',
            'AssignProduct',
            'RecordByProduct',
            'Sell',
            'Transport',
          ],
        }
      : null,
    isProfileUpdated && auth.hasTraceProduct
      ? {
          label: 'navbar.trace_product',
          icon: '',
          name: 'BrandProductOrder',
          active: ['BrandProductTrace'],
        }
      : null,
    isProfileUpdated && auth.hasOverviewMenu
      ? {
          label: 'sidebar.overview',
          icon: '',
          name: 'Overview',
          active: ['Overview'],
        }
      : null,
    isProfileUpdated && auth.hasManagePartnerMenu
      ? {
          label: 'sidebar.manage_partners',
          icon: '',
          name: 'ManagePartner',
          active: ['ManagePartner'],
        }
      : null,
    isProfileUpdated && auth.hasViewCAP
      ? {
          label: 'improvement_plans',
          icon: '',
          name: 'ProducerCAP',
          active: ['ProducerCAP'],
        }
      : null,
    isProfileUpdated
      ? {
          label: 'sidebar.my_profile',
          icon: '',
          name: 'MyProfile',
          active: ['MyProfile', 'ProducerUserManagement'],
        }
      : null,
  ].filter((menu) => !isNull(menu));
}

function getLaborMenus(): App.Menu[] {
  const isProfileUpdated = profileUpdated(auth.user);
  if (!isProfileUpdated && auth.hasAuditorRequestMenu) {
    return [
      {
        label: 'sidebar.onboard',
        icon: 'home',
        name: 'AuditorOnboard',
        active: [],
      },
    ];
  }
  return [
    auth.hasAuditorRequestMenu
      ? {
          label: 'sidebar.incident_reports',
          icon: 'home',
          name: 'Request',
          active: ['Request'],
        }
      : null,
    auth.isLabor
      ? {
          label: 'sidebar.my_profile',
          icon: 'people',
          name: 'AuditorProfile',
          active: [
            'AuditorProfile',
            'ShowAuditorProfile',
            'LaborUserManagement',
          ],
        }
      : null,
  ].filter((menu) => !isNull(menu));
}

export function getFacilityMenu(): App.Menu[] {
  auth.setFacilityTypes(getFacilityTypes());
  return auth.facilityTypes.map(({ id, name }) => ({
    label: 'sidebar.facility_management',
    params: {
      id,
      name,
    },
    icon: '',
    name: `FacilityManagement_${id}`,
    active: [`FacilityManagement_${id}`],
  }));
}

function getAdminMenus(): App.Menu[] {
  return [
    auth.hasUserManagementMenu
      ? {
          label: 'sidebar.user_management',
          icon: '',
          name: 'UserManagement',
          active: ['UserManagement'],
        }
      : null,
    ...getFacilityMenu(),
    auth.hasReportListMenu
      ? {
          label: 'sidebar.incident_reports',
          icon: '',
          name: 'GrievanceReport',
          active: ['GrievanceReport'],
        }
      : null,
    auth.hasQRCodeManagementMenu
      ? {
          label: 'sidebar.qr_code_management',
          icon: '',
          name: 'QRCodeManagement',
          active: ['QRCodeManagement', 'QRCodeHistory'],
        }
      : null,
    auth.hasDNA
      ? {
          label: 'dna_test',
          icon: '',
          name: 'DNAManagement',
          active: ['DNAManagement'],
        }
      : null,
    auth.hasTraceProduct
      ? {
          label: 'navbar.trace_product',
          icon: '',
          name: 'BrandProductOrder',
          active: ['BrandProductTrace'],
        }
      : null,
    {
      label: 'sidebar.settings',
      icon: '',
      name: 'Setting',
      active: [],
    },
  ].filter((menu) => !isNull(menu));
}

function getBrandMenus(): App.Menu[] {
  if (
    !profileUpdated(auth.user) &&
    auth.hasExtendedProfile &&
    auth.isFirstUser
  ) {
    return [
      {
        label: 'sidebar.my_profile',
        icon: '',
        name: 'BrandOnboard',
        active: ['BrandOnboard'],
      },
    ];
  }
  return [
    {
      label: 'suppliers',
      icon: '',
      name: 'BrandSuppliers',
      active: [],
    },
    auth.hasTraceProduct
      ? {
          label: 'navbar.trace_product',
          icon: '',
          name: 'BrandProductOrder',
          active: ['BrandProductTrace'],
        }
      : null,
    auth.hasViewCAP
      ? {
          label: 'improvement_plans',
          icon: '',
          name: 'BrandCAP',
          active: ['BrandCAP'],
        }
      : null,
    auth.hasExtendedProfile
      ? {
          label: 'sidebar.my_profile',
          icon: '',
          name: 'BrandProfile',
          active: ['BrandProfile', 'BrandUserManagement'],
        }
      : null,
  ].filter((menu) => !isNull(menu));
}
