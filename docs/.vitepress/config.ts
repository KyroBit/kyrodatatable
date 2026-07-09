import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KyroDataTable',
  description:
    'KyroDataTable — data-table state for React, decoupled from rendering. Search, sort, pagination, filters and grouping — client-side or server-side — in one hook; render it with MUI, Bootstrap, or your own markup.',

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  themeConfig: {
    search: { provider: 'local' },

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Reference', link: '/reference/core-api' },
      { text: 'GitHub', link: 'https://github.com/KyroBit/kyro-datatable' },
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Quick start', link: '/guide/quick-start' },
          { text: 'Installation', link: '/guide/installation' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Grouping', link: '/guide/grouping' },
          { text: 'Favorites (saved filter sets)', link: '/guide/favorites' },
          { text: 'MUI renderer', link: '/guide/mui' },
          { text: 'Bootstrap renderer', link: '/guide/bootstrap' },
          { text: 'Writing your own renderer', link: '/guide/custom-renderer' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Core API', link: '/reference/core-api' },
          { text: 'MUI', link: '/reference/mui' },
          { text: 'Bootstrap', link: '/reference/bootstrap' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/KyroBit/kyro-datatable' }],

    outline: { level: [2, 3] },
  },
})
