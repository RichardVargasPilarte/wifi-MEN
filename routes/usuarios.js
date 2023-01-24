/*
    Ruta: /api/usuarios
*/

const { Router } = require('express'); // import Router from express
const { body } = require('express-validator');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuario');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole, validarAdminRole_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router(); // create an instance of Router

router.get( '/', validarJWT , getUsuarios );

router.post('/',
    [
        validarJWT,
        body('nombre', 'El nombre es obligatorio').not().isEmpty(),
        body('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        body('username', 'El nombre de usuario obligatorio').not().isEmpty(),
        body('password', 'La contraseña es obligatoria').not().isEmpty(),
        body('inss', 'El número de inss es obligatorio').not().isEmpty(),
        body('email', 'El correo institucional es obligatorio').isEmail(),
        body('role', 'El rol de usuario es obligatorio').not().isEmpty(),
        validarCampos
    ], crearUsuario
);

router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    body('username', 'El nombre de usuario obligatorio').not().isEmpty(),
    body('inss', 'El número de inss es obligatorio').not().isEmpty(),
    body('email', 'El correo institucional es obligatorio').isEmail(),
    body('role', 'El rol de usuario es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);



module.exports = router;