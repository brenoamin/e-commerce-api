const conexao = require("../conexao");
const schemaProduto = require("../validacoes/schemaProduto")
const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const produtoCategoria = req.query.categoria;
  try {
    if (!produtoCategoria) {
      const query = "select * from produtos where usuario_id=$1";
      const { rows: produtos } = await conexao.query(query, [usuario.id]);
      res.status(200).json(produtos);
    }
    else{
      const query = `select * from produtos where usuario_id=$1 and categoria=$2`;
      const { rows: produtos } = await conexao.query(query, [usuario.id,produtoCategoria]);
      res.status(200).json(produtos);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cadastrarProdutos = async (req, res) => {
  const { usuario } = req;
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  try {
    await schemaProduto.validate(req.body)
    const query = `insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem)
    values ($1,$2,$3,$4,$5,$6,$7)`;
    const produto = await conexao.query(query, [
      usuario.id,
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
    ]);
    if (produto.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possível cadastrar os produtos" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const detalharProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const query = "select * from produtos where id=$1 and usuario_id=$2";
    const produto = await conexao.query(query, [id, usuario.id]);
    if (produto.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não existe produto cadastrado com esse ID." });
    }
    res.status(200).json(produto.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const atualizarProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, quantidade, preco, categoria, imagem, descricao } = req.body;
  try {
    await schemaProduto.validate(req.body)
    const queryProcurar =
      "select * from produtos where id=$1 and usuario_id=$2";
    const produto = await conexao.query(queryProcurar, [id, usuario.id]);
    if (produto.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não existe produto cadastrado com esse ID." });
    }
    const query =
      "update produtos set nome=$1, quantidade=$2, categoria=$3, preco=$4, descricao=$5, imagem=$6 where id=$7 and usuario_id=$8";
    const produtoAtualizado = await conexao.query(query, [
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
      id,
      usuario.id,
    ]);
    if (produtoAtualizado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o produto." });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const queryProcurar =
      "select * from produtos where id=$1 and usuario_id=$2";
    const produto = await conexao.query(queryProcurar, [id, usuario.id]);
    if (produto.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não existe produto cadastrado com esse ID." });
    }
    const query = `delete from produtos where id=$1`;
    const produtoExcluido = await conexao.query(query, [id]);
    if (produtoExcluido.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o produto." });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
module.exports = {
  listarProdutos,
  detalharProduto,
  cadastrarProdutos,
  atualizarProduto,
  excluirProduto,
};
