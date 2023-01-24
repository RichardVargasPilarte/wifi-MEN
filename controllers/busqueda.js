const { response } = require('express');

const Usuario = require('../models/usuario');

const getBusquedas = async (req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios] = await Promise.all([
        Usuario.find({ nombre: regex })
    ]);

    res.json({
        ok: true,
        usuarios,
        busqueda,
        msg: 'Todo esta bien'
    });
}

const getDocumentosColeccions = async (req, res = response) => {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene ser usuarios'
            });
    }

    res.status(200).json({
        ok: true,
        resultados: data,
        busqueda,
        tabla
    });
}

module.exports = {
    getBusquedas,
    getDocumentosColeccions
}