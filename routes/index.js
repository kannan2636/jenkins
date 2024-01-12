const apiRoute = require('./modules/index.route');

const init = (app) => {
    app.get('*', function (req, res, next) {
        return next();
    });
    
    app.use('/api', apiRoute);
}
module.exports = {
    init: init
};