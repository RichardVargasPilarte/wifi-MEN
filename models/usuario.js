const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    inss: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eliminado: {
        type: String,
        required: true,
        default: 'NO'
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        required: true,
    }
});


UsuarioSchema.methods.toJSON = function() {
    const {__v, _id, password, ...object} = this.toObject();

    object.uid = _id;
    return object;
}

module.exports = model('Usuario', UsuarioSchema);