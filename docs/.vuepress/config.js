module.exports = {
  title: 'Hello Qubo',
  description: 'Just playing around',
  base: '/homepage/',
  head: [
    ['link', { rel: 'icon', href: '/avatar.png' }],
  ],
  themeConfig: {
    logo: '/avatar.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://google.com' }
    ],
  }
}