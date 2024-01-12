import { DB, USER, PASSWORD, HOST, dialect as _dialect, pool as _pool } from '../config/databaseConfig.js';

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
    DB,
    USER,
    PASSWORD, {
        host: HOST,
        dialect: _dialect,
        // operatorsAliases: false,
        pool: {
            max: _pool.max,
            min: _pool.min,
            acquire: _pool.acquire,
            idle: _pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..v')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./app_users_data.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false }).then(() => {
    console.log('Yes re-sync Done!');
}).catch(error => {
    console.error('An error occurred during sync:', error);
});

export default db