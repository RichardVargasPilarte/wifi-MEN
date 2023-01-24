const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    const { username, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ username });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario incorrecto'
            });
        }

        // Verificar password
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar token de jwt
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token,
            // menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar token de jwt
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    const usuario = await Usuario.findById(uid);

    res.status(200).json({
        ok: true,
        token,
        usuario,
        // menu: getMenuFrontEnd(usuario.role)
    })
}


module.exports = {
    login,
    renewToken
};