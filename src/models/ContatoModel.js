const mongoose = require('mongoose');
const validator = require('validator')

const ContatosSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    datacriada: { type: Date, default: Date.now }
});

const ContatosModel = mongoose.model('Contatos', ContatosSchema);

function Contatos(body) {
    this.body = body;
    this.errors = [];
    this.contatos = null;
};


Contatos.prototype.register = async function () {
    this.valida();

    if (this.errors.length > 0) return;

    this.contatos = await ContatosModel.create(this.body);

};

Contatos.prototype.valida = function () {
    this.clearUp();
    //Validação
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email invalido');
    if (!this.body.nome) this.errors.push('O campo nome não pode estar vazio!');
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato deve ser enviado: Email ou Telefone')
    };
};


Contatos.prototype.clearUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };
};


Contatos.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contatos = await ContatosModel.findByIdAndUpdate(id, this.body, { new: true });
};


Contatos.buscaId = async function (id) {
    if (typeof id !== 'string') return;

    const contato = await ContatosModel.findById(id);
    return contato;
};

Contatos.buscaContatos = async function () {

    const contatos = await ContatosModel.find().sort({ datacriada: -1 });
    return contatos;
};

Contatos.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatosModel.findOneAndDelete({ _id: id });
    return contato
};



module.exports = Contatos;