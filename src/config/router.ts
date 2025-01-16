import Router, { Route, NavigationGuardNext } from 'vue-router';
import {
  isAuthenticated,
  getUserInfo,
  revokeUser,
  getUserPermissions,
  getFacilityTypes,
} from 'utils/cookie';
import authModule from 'store/modules/auth';
import { getUserRole } from 'utils/user';
import { middlewarePipeline, guest, auth } from './middlewares';
import superAdminRouter from './routers/super-admin-router';
import adminRouter from './routers/admin-router';
import brandRouter from './routers/brand-router';
import productRouter from './routers/supplier-router';
import laborRouter from './routers/labor-router';

const SignInPage = () => import('pages/SignInPage');
const SignUpPage = () => import('pages/SignUpPage');
const DashboardPage = () => import('pages/DashboardPage');
const PageNotFound = () => import('pages/PageNotFound');
const ForgotPasswordPage = () => import('pages/ForgotPasswordPage');
const ResetPasswordPage = () => import('pages/ResetPasswordPage');
const TermConditionPage = () => import('pages/TermConditionPage');
const PrivacyPolicyPage = () => import('pages/PrivacyPolicyPage');

const PDFOrderPreviewPage = () => import('pages/PDFOrderPreviewPage');
const PDFSupplierDetailsPreviewPage = () =>
  import('pages/PDFSupplierDetailsPreviewPage');

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: DashboardPage,
      meta: {
        middleware: [auth],
      },
      children: [
        ...superAdminRouter,
        ...productRouter,
        ...brandRouter,
        ...adminRouter,
        ...laborRouter,
      ],
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignInPage,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUpPage,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordPage,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/term-conditions',
      name: 'TermCondition',
      component: TermConditionPage,
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicyPage,
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPasswordPage,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/pdf-preview',
      name: 'PDFPreview',
      component: PDFOrderPreviewPage,
    },
    {
      path: '/supplier-detail-pdf-preview',
      name: 'PDFSupplierDetailPreview',
      component: PDFSupplierDetailsPreviewPage,
    },
    { path: '/404', name: '404', component: PageNotFound },
    { path: '*', name: 'PageNotFound', component: PageNotFound },
  ],
});

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.name === 'SignUp') {
    revokeUser();
  }

  const user = getUserInfo();
  const role = getUserRole(user);
  const permissions = getUserPermissions();
  const facilityTypes = getFacilityTypes();
  const isLoggedIn = isAuthenticated();
  const { middleware } = to.meta;
  const context: App.RouteContext = {
    to,
    from,
    next,
    user,
    role,
    permissions,
    facilityTypes,
    isLoggedIn,
  };

  if (user) {
    authModule.setUser(user);
  }
  if (permissions) {
    authModule.setPermissions(permissions);
  }
  if (facilityTypes) {
    authModule.setFacilityTypes(facilityTypes);
  }

  if (!to.meta.middleware) {
    return next();
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
