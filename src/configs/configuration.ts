export default () => ({
  version: process.env.package_version,
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
  jwt: {
    secret: process.env.JWT_OR_SESSION_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIREIN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIREIN,
  },
  log: process.env.LOG_DEBUG === 'true' ? true : false,
  googleApi: {
    email: process.env.GOOGLEAPI_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLEAPI_SERVICE_ACCOUNT_PRIVATE_KEY,
    spreadsheetId: process.env.GOOGLEAPI_SHEET_ID,
    range: process.env.GOOGLEAPI_SHEET_RANGE,
  },
  googleCardApi: {
    email: process.env.GOOGLEAPI_CARD_ACCOUNT_EMAIL,
    key: process.env.GOOGLEAPI_CARD_ACCOUNT_PRIVATE_KEY,
    spreadsheetId: process.env.GOOGLEAPI_CARD_SHEET_ID,
    range: process.env.GOOGLEAPI_CARD_SHEET_RANGE,
  },
  jandi: {
    webhook: process.env.JANDI_WEBHOOK_URL,
  },
  frontend: {
    uri: process.env.URL_FOR_CORS,
  },
  redirect: {
    money_guidelines: process.env.URI_MONEY_GUIDELINE,
    question: process.env.URI_QUESTION,
    usage: process.env.URI_USAGE,
    feedback: process.env.URI_FEEDBACK,
    terms: process.env.URI_TERMS,
    reissuance_guidelines: process.env.URI_REISSUANCE_GUIDELINE,
  },
});
