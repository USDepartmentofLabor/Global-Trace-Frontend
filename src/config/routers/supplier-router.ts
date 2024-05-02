import {
  auth,
  hasLogByProduct,
  hasLogPurchase,
  hasLogSale,
  hasLogTransformation,
  hasLogTransport,
  hasTraceProduct,
  hasViewHistory,
  supplierOnboard,
  supplierRegistered,
} from '../middlewares';
import { isProduct } from '../middlewares/role';

const OnboardPage = () => import('pages/OnboardPage');
const HomePage = () => import('pages/HomePage');
const PurchasePage = () => import('pages/PurchasePage');
const AssignProductPage = () => import('pages/AssignProductPage');
const RecordByProductPage = () => import('pages/RecordByProductPage');
const SellPage = () => import('pages/SellPage');
const TransportPage = () => import('pages/TransportPage');
const MyProfilePage = () => import('pages/MyProfilePage');
const ManagePartnerPage = () => import('pages/ManagePartnerPage');
const OverviewPage = () => import('pages/OverviewPage');
const BrandProductOrderPage = () => import('pages/BrandProductOrderPage');

export default [
  {
    path: 'onboard',
    name: 'Onboard',
    component: OnboardPage,
    meta: {
      middleware: [auth, supplierOnboard, isProduct],
    },
  },
  {
    path: 'homepage',
    name: 'Homepage',
    component: HomePage,
    meta: {
      middleware: [auth, supplierRegistered, isProduct],
    },
    children: [
      {
        path: 'purchase',
        name: 'Purchase',
        component: PurchasePage,
        meta: {
          middleware: [auth, hasLogPurchase],
        },
      },
      {
        path: 'assign-product-id',
        name: 'AssignProduct',
        component: AssignProductPage,
        meta: {
          middleware: [auth, hasLogTransformation],
        },
      },
      {
        path: 'record-by-product',
        name: 'RecordByProduct',
        component: RecordByProductPage,
        meta: {
          middleware: [auth, hasLogByProduct],
        },
      },
      {
        path: 'sell',
        name: 'Sell',
        component: SellPage,
        meta: {
          middleware: [auth, hasLogSale],
        },
      },
      {
        path: 'transport',
        name: 'Transport',
        component: TransportPage,
        meta: {
          middleware: [auth, hasLogTransport],
        },
      },
    ],
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
    path: 'my-profile',
    name: 'MyProfile',
    component: MyProfilePage,
    meta: {
      middleware: [auth, supplierRegistered, isProduct],
    },
  },
  {
    path: 'manage-partners',
    name: 'ManagePartner',
    component: ManagePartnerPage,
    meta: {
      middleware: [auth, supplierRegistered, isProduct],
    },
  },
  {
    path: 'overview',
    name: 'Overview',
    component: OverviewPage,
    meta: {
      middleware: [auth, hasViewHistory, isProduct],
    },
  },
];
