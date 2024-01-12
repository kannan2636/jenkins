let dev = {
    HOST: process.env.DEV_HOST,
    USER: process.env.DEV_USER,
    PASSWORD: process.env.DEV_PASSWORD,
    DB: process.env.DEV_DB,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    RUN_env : process.env.DEV_RUN_ENV,
    RUN_hostname: process.env.DEV_RUN_HOST_NAME,
    RUN_port: process.env.DEV_RUN_PORT
}

let prod = {
    HOST: process.env.PROD_HOST,
    USER: process.env.PROD_USER,
    PASSWORD: process.env.PROD_PASSWORD,
    DB: process.env.PROD_DB,
    dialect: 'mysql',
    pool: {
      max: 30,
      min: 0,
      acquire: 500000,
      idle: 10000
    },
    RUN_env : process.env.PROD_RUN_ENV,
    RUN_hostname: process.env.PROD_RUN_HOST_NAME,
    RUN_port: process.env.PROD_RUN_PORT

  };

module.exports = process.env.NODE_ENV == 'dev' ? dev : prod;