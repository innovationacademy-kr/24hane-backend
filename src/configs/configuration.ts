export default () => ({
  port: parseInt(process.env.PORT, 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  ftAuth: {
    clientid: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callbackuri: process.env.CLIENT_CALLBACK,
  },
  authkey: process.env.JWT_OR_SESSION_SECRET,
  log: process.env.LOG_DEBUG === 'true' ? true : false,
  url: {
    client: process.env.URL_CLIENT,
    client_old: process.env.URL_CLIENT_OLD,
    admin: process.env.URL_ADMIN,
    root_host: process.env.URL_ROOTHOST,
  },
  cookie: {
    auth: process.env.COOKIE_AUTH,
  },
  WebhookIpFilter: process.env.WEBHOOK_IP_FILTER,
});
