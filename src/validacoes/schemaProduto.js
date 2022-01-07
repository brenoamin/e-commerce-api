const yup = require("./configuracoes");

const schemaProduto = yup.object().shape({
  nome: yup.string().required(),
  quantidade: yup.number().required().min(1),
  preco: yup.number().strict().required(),
  descricao: yup.string().required()
});

module.exports = schemaProduto;
