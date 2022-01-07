const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret.js");
const schemaLoginUsuario = require("../validacoes/schemaLoginUsuario");

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    await schemaLoginUsuario.validate(req.body);
    const queryConsultaEmail = "select * from usuarios where email= $1";
    const { rows, rowCount } = await conexao.query(queryConsultaEmail, [email]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: " Não existe um usuário cadastrado com o e-mail informado.",
      });
    }
    const usuario = rows[0];
    const senhaComparar = await bcrypt.compare(senha, usuario.senha);
    if (!senhaComparar) {
      return res.status(400).json({
        mensagem: "Usuário e/ou senha incorreto(s).",
      });
    }
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      jwtSecret,
      { expiresIn: "10d" }
    );
    res.status(200).send({ token: token });
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};
module.exports = {
  login,
};
