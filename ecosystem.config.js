module.exports = {
  apps: [
    {
      name: 'rumors',
      cwd: '/root/rumors', // Change this to your Strapi app's directory
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
    },

  ],
};