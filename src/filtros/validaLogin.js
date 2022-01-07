const conexao = require("../conexao");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt_secret.js");

const validaLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization==="Bearer") {
    return res.status(404).json({ mensagem: "O token não foi informado." });
  }
  try {
    const token = authorization.replace("Bearer", "").trim();
    const usuario = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({mensagem:"Para acessar este recurso um token de autenticação válido deve ser enviado."});
  }
  try {
    const token = authorization.replace("Bearer", "").trim();
    const { id } = jwt.verify(token, jwtSecret);
    const query = "select * from usuarios where id= $1";
    const { rows, rowCount } = await conexao.query(query, [id]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: "Usuário não encontrado.",
      });
    }
    const {senha,...usuario} = rows[0];
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};
module.exports = validaLogin;
