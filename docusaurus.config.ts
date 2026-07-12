import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Enkinex',
  tagline: 'Semantic & Governance as Code',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: true,
  },

  // Set the production url of your site here
  url: 'https://enkinex.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'enkinex', // Usually your GitHub org/user name.
  projectName: 'enkinex-website', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-3E11JZ1LEW',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social share card (1200x630).
    image: 'img/enkinex-social.png',
    colorMode: {
      // First iteration ships the dark theme only; the light iteration
      // will re-enable the switch.
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: 'Enkinex',
        src: 'img/enkinex-logo.svg',
      },
      items: [
        {to: '/', label: 'Home', position: 'right', activeBaseRegex: '^/$'},
        {to: '/docs/architecture', label: 'Architecture', position: 'right'},
        {to: '/docs/why-enkinex', label: 'Docs', position: 'right'},
        {
          href: 'https://github.com/enkinex',
          label: 'GitHub',
          position: 'right',
          className: 'header-github-btn',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          html: `<a class="footer-icon-link" href="https://github.com/enkinex" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"/></svg></a>`,
        },
        {
          html: `<a class="footer-icon-link" href="https://www.linkedin.com/company/enkinex" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 11v5m0-8v.01M12 16v-5m4 5v-3a2 2 0 1 0-4 0"/><path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/></g></svg></a>`,
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Enkinex Data Ltda`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      // `kcl` is registered separately in src/theme/prism-include-languages.js
      additionalLanguages: ['toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
