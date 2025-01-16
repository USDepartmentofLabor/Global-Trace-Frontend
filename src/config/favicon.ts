import appleFavicon from 'assets/icons/apple-icon.png';
import appleFaviconPrecomposed from 'assets/icons/apple-icon-precomposed.png';
import appleFavicon57 from 'assets/icons/apple-icon-57x57.png';
import appleFavicon60 from 'assets/icons/apple-icon-60x60.png';
import appleFavicon72 from 'assets/icons/apple-icon-72x72.png';
import appleFavicon76 from 'assets/icons/apple-icon-76x76.png';
import appleFavicon114 from 'assets/icons/apple-icon-114x114.png';
import appleFavicon120 from 'assets/icons/apple-icon-120x120.png';
import appleFavicon144 from 'assets/icons/apple-icon-144x144.png';
import appleFavicon152 from 'assets/icons/apple-icon-152x152.png';
import appleFavicon180 from 'assets/icons/apple-icon-180x180.png';
import favicon16 from 'assets/icons/favicon-16x16.png';
import favicon32 from 'assets/icons/favicon-32x32.png';
import favicon96 from 'assets/icons/favicon-96x96.png';
import androidFavicon192 from 'assets/icons/android-icon-192x192.png';
// import msIcon144 from 'assets/icons/ms-icon-144x144.png';
// import manifest from 'assets/icons/manifest.json';
import favicon from 'assets/icons/favicon.ico';

const androidIcons = [
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: androidFavicon192,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: favicon16,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: favicon32,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: favicon96,
  },
];

const appleIcons = [
  {
    rel: 'shortcut icon',
    href: favicon,
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon,
  },
  {
    rel: 'apple-touch-icon',
    href: appleFaviconPrecomposed,
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon57,
    sizes: '57x57',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon60,
    sizes: '60x60',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon72,
    sizes: '72x72',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon76,
    sizes: '76x76',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon114,
    sizes: '114x114',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon120,
    sizes: '120x120',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon144,
    sizes: '144x144',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon152,
    sizes: '152x152',
  },
  {
    rel: 'apple-touch-icon',
    href: appleFavicon180,
    sizes: '180x180',
  },
];

export default [...appleIcons, ...androidIcons];
