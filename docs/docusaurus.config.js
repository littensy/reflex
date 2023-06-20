// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('./themes/light');
const darkCodeTheme = require('./themes/dark');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Reflex',
  tagline: 'An immutable state container for Roblox',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://littensy.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/reflex/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'littensy', // Usually your GitHub org/user name.
  projectName: 'reflex', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social_card.png',
      navbar: {
        title: 'Reflex',
        logo: {
          alt: 'Reflex Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorials',
          },
          {
            type: 'docSidebar',
            sidebarId: 'referenceSidebar',
            position: 'left',
            label: 'Reference',
          },
          {
            href: 'https://github.com/littensy/reflex',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/tutorials/intro',
              },
              {
                label: 'API Reference',
                to: '/docs/reference/reflex',
              },
            ],
          },
          {
            title: 'Discord',
            items: [
              {
                label: 'Roblox-TS',
                href: 'https://discord.roblox-ts.com/',
              },
              {
                label: 'Roblox OSS Community',
                href: 'https://discord.gg/Bcyh8kmRYe',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/littensy/reflex',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Richard L`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['typescript', 'lua', 'powershell'],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: {start: 'highlight-start', end: 'highlight-end'},
          },
          {
            className: 'code-block-error-line',
            line: 'error-next-line',
          },
        ],
      },
    }),
};

module.exports = config;
