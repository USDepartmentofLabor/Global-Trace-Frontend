import { auth, auditorOnboard, auditorRequest } from '../middlewares';
import { isLabor } from '../middlewares/role';

const OnboardPage = () => import('pages/OnboardPage');
const RequestPage = () => import('pages/RequestPage');
const AuditorProfilePage = () => import('pages/AuditorProfilePage');

export default [
  {
    path: 'auditor-onboard',
    name: 'AuditorOnboard',
    component: OnboardPage,
    meta: {
      middleware: [auth, auditorOnboard, isLabor],
    },
  },
  {
    path: 'requests',
    name: 'Request',
    component: RequestPage,
    meta: {
      middleware: [auth, auditorRequest, isLabor],
    },
  },
  {
    path: 'auditor-profile',
    name: 'AuditorProfile',
    component: AuditorProfilePage,
    meta: {
      middleware: [auth, isLabor],
    },
  },
];
