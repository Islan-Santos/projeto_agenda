const Contatos = require('../models/ContatoModel');


exports.index = async (req, res) => {
    const contatos = await Contatos.buscaContatos();

    res.render('index', { contatos });
    return;
}
