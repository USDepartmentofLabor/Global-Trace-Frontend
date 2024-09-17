import { get } from 'lodash';
import app from 'store/modules/app';
import { translate } from './helpers';

export function getHead(name: string = '') {
  return {
    title() {
      return {
        inner: name ? translate(name) : '',
      };
    },
    link() {
      return getIcons();
    },
  };
}

export function getIcons() {
  return [
    {
      r: 'icon',
      href: get(app, 'logoUrl', ''),
      sizes: '16x16',
      type: 'image/png',
    },
  ];
}
