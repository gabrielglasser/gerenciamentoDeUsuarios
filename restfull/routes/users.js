const { check, validationResult } = require('express-validator');
let NeDB = require('nedb');
let db = new NeDB({
  filename: 'users.db',
  autoload: true
});

module.exports = (app) => {

  let route = app.route('/users'); // criando a rota

  // Listar todos os usuários
  route.get((req, res) => {
    db.find({}).sort({ name: 1 }).exec((err, users) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.status(200).json({ users });
      }
    });
  });

  // Inserir um novo usuário com validação
  route.post([
    check('name').notEmpty().withMessage('O nome é obrigatório.'),
    check('email').isEmail().withMessage('O email está inválido')
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    db.insert(req.body, (err, user) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.status(200).json(user);
      }
    });
  });

  let routeId = app.route('/users/:id');

  // Listar um usuário por ID
  routeId.get((req, res) => {
    db.findOne({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.status(200).json(user);
      }
    });
  });

  // Editar um usuário com validação
  routeId.put([
    check('name').optional().notEmpty().withMessage('O nome é obrigatório.'),
    check('email').optional().isEmail().withMessage('O email está inválido')
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    db.update({ _id: req.params.id }, req.body, {}, (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.status(200).json(Object.assign(req.params, req.body));
      }
    });
  });

  // Excluir um usuário
  routeId.delete((req, res) => {
    db.remove({ _id: req.params.id }, {}, (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.status(200).json({ message: 'Usuário removido com sucesso!', id: req.params.id });
      }
    });
  });
};
