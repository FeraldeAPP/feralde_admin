module.exports = {
  apps: [
    {
      name: 'feralde-admin-frontend',
      script: 'pnpm',
      args: 'run preview -- --host 0.0.0.0 --port 55014',
      cwd: '/home/feralde/feralde_admin',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
