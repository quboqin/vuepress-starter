module.exports = {
  title: 'Hello Qubo',
  description: 'Just playing around',
  head: ['link', { rel: 'icon', href: '/avatar.png' }],
  base: '/homepage/',
  themeConfig: {
    logo: '/avatar.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://google.com' }
    ],
  }
}