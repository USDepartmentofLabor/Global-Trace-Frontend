import {
  auth,
  brandOnboard,
  brandRegistered,
  hasTraceProduct,
  hasViewSupplierDatabase,
} from '../middlewares';
import { isBrand } from '../middlewares/role';

const BrandOnboardPage = () => import('pages/BrandOnboardPage');
const BrandProfilePage = () => import('pages/BrandProfilePage');
const BrandProductOrderPage = () => import('pages/BrandProductOrderPage');
const BrandProductTracePage = () => import('pages/BrandProductTracePage');
const BrandSuppliersPage = () => import('pages/BrandSuppliersPage');
const ProducerManagementPage = () => import('pages/ProducerManagementPage');
const CAPManagementPage = () => import('pages/CAPManagementPage');

export default [
  {
    path: '/brand-onboard',
    name: 'BrandOnboard',
    component: BrandOnboardPage,
    meta: {
      middleware: [auth, brandOnboard, isBrand],
    },
  },
  {
    path: '/brand-profile',
    name: 'BrandProfile',
    component: BrandProfilePage,
    meta: {
      middleware: [auth, brandRegistered, isBrand],
    },
  },
  {
    path: '/brand-product-order',
    name: 'BrandProductOrder',
    component: BrandProductOrderPage,
    meta: {
      middleware: [auth, hasTraceProduct],
    },
  },
  {
    path: '/brand-product-trace/:id',
    name: 'BrandProductTrace',
    component: BrandProductTracePage,
    meta: {
      middleware: [auth, hasTraceProduct],
    },
  },
  {
    path: '/brand-suppliers',
    name: 'BrandSuppliers',
    component: BrandSuppliersPage,
    meta: {
      middleware: [auth, hasViewSupplierDatabase, isBrand],
    },
  },
  {
    path: 'brand-management',
    name: 'BrandUserManagement',
    component: ProducerManagementPage,
    meta: {
      middleware: [auth, brandRegistered, isBrand],
    },
  },
  {
    path: 'brand-cap',
    name: 'BrandCAP',
    component: CAPManagementPage,
    meta: {
      middleware: [auth, brandRegistered, isBrand],
    },
  },
];
