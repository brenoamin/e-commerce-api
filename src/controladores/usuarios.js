const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario')
const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;
  try {
    await schemaCadastroUsuario.validate(req.body)
    const queryConsultaEmail = "select * from usuarios where email= $1";
    const { rowCount: quantidadeUsuario } = await conexao.query(
      queryConsultaEmail,
      [email]
    );
    if (quantidadeUsuario > 0) {
      return res.status(400).json({
        mensagem: " Já existe um usuário cadastrado com o e-mail informado.",
      });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const query = `insert into usuarios (nome, email, senha, nome_loja)
    values
    ($1,$2,$3,$4)`;
    const usuarioCadastrado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
    ]);
    if (usuarioCadastrado.rowCount === 0) {
      return res.status(400).res.json({
        mensagem: "Não foi possível cadastrar o usuário.",
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const obterUsuario = (req, res) => {
  const { usuario } = req;
  try {
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};
const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha, nome_loja } = req.body;
  await schemaCadastroUsuario.validate(req.body)
  try {
    const queryConsultaEmail = "select * from usuarios where email= $1";
    const { rowCount: quantidadeUsuario } = await conexao.query(
      queryConsultaEmail,
      [email]
    );
    if (quantidadeUsuario > 0) {
      return res.status(400).json({
        mensagem: " Já existe um usuário cadastrado com o e-mail informado.",
      });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const query =
      "update usuarios set nome=$1, email=$2, senha=$3, nome_loja=$4 where id=$5";
    const usuarioAtualizado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
      usuario.id,
    ]);
    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).res.json({
        mensagem: "Não foi possível atualizar o usuário.",
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  obterUsuario,
  atualizarUsuario,
};
