const Contatos = require('../models/ContatoModel');

exports.home = (req, res) => {
    res.render('contatos', { contato: {} });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contatos(req.body);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contatos/home'));
            return;
        }

        req.flash('success', 'Contato registrado com Sucesso!');
        req.session.save(() => res.redirect(`/contatos/home/${contato.contatos._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');

    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404');

    const contato = await Contatos.buscaId(req.params.id);
    if (!contato) return res.render('404')

    res.render('contatos', { contato });
};


exports.edit = async function (req, res) {
    try {

        if (!req.params.id) return res.render('404');

        const contato = new Contatos(req.body);
        await contato.edit(req.params.id);

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contatos/home/${req.params.id}`));
            return;
        }

        req.flash('success', 'Contato editado com Sucesso!');
        req.session.save(() => res.redirect(`/contatos/home/${contato.contatos._id}`));
        return;

    } catch (e) {
        console.log(e);
        res.render('404');
    }

};


exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404');

    const contato = await Contatos.delete(req.params.id);
    if (!contato) return res.render('404')
    
    req.flash('success', 'Contato deletado com Sucesso!');
    req.session.save(() => res.redirect('/'));
    return;
    
}
