const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController.js');
const loginController = require('./src/controllers/loginController.js');
const contatoController = require('./src/controllers/contatoController.js');

const { loginrequire } = require('./src/middlewares/middleware.js')

//rotas da home
route.get('/', homeController.index);

// rotas de login

route.get('/login/index', loginController.index);
route.get('/login/logout', loginController.logout);

route.post('/login/register', loginController.register);
route.post('/login/home', loginController.login);

//rotas de contatos

route.get('/contatos/home', loginrequire, contatoController.home);
route.post('/contatos/register', loginrequire, contatoController.register);
route.get('/contatos/home/:id', loginrequire, contatoController.editIndex);
route.post('/contatos/edit/:id', loginrequire, contatoController.edit);
route.get('/contatos/delete/:id', loginrequire, contatoController.delete);


module.exports = route;