const { response } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


// TODO: Obtener usuarios
const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0; // constante de paginacion

    const [usuarios, total] = await Promise.all([
        Usuario.find({eliminado:'NO'}, 'nombre apellidos username email inss eliminado role')
            .skip(desde) // salta los primeros 5
            .limit(5), // muestra los primeros 5

        Usuario.countDocuments()
    ])

    res.status(200).json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });
}

// TODO: Crear un nuevo usuario
const crearUsuario = async (req, res = response) => {
    const { nombre, apellidos, username, password, inss, eliminado, email, role } = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email });
        const existeUserName = await Usuario.findOne({ username });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        if (existeUserName) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        // TODO: Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);


        // TODO: Guarda USUARIO
        await usuario.save();

        // TODO: Generar token de jwt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

// TODO: Actualizar un Usuario
const actualizarUsuario = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario es correcto
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario not found'
            });
        }

        // Actualización
        const { password, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existemail = await Usuario.findOne({ email });

            if (existemail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado,
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

// TODO: Eliminar un usuario
const borrarUsuario = async (req, res) => {

    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario not found'
            });
        }

        await Usuario.findByIdAndUpdate(uid, { eliminado: 'SI' });

        res.status(200).json({
            ok: true,
            msg: 'Se elimino el usuario'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error'
        });
    }
}

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario }