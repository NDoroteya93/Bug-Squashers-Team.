const { Router } = require('express');

const initRouter = (controllerFactory) => {
    const router = new Router();
    const controller = controllerFactory.getUserController();

    router
        .get('/', (req, res) => {
            return controller.getUserAllProperty(req, res);
        })
        .get('/agents', (req, res) => {
            return controller.getAllUsers(req, res);
        });
    return router;
};

module.exports = { initRouter };
