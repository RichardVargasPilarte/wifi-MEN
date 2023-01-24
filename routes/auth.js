/*
    Ruta del Login: /api/login
*/

const { Router } = require('express'); // import Router from express
const { login, renewToken } = require('../controllers/auth');

const { body } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = new Router();


router.post('/', [
        body('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
        body('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

router.get('/renew', 
    validarJWT,
    renewToken
);

module.exports = router;