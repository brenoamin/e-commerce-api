const express = require("express");
const usuarios = require('./controladores/usuarios')
const login = require('./controladores/login')
const produtos = require('./controladores/produtos')
const validaLogin = require('./filtros/validaLogin')
const rotas = express();
//Cadastrar Usuário
rotas.post('/usuario', usuarios.cadastrarUsuario)
//Login de Usuário
rotas.post('/login', login.login)

rotas.use(validaLogin);

//Menu Usuário
rotas.get('/usuario', usuarios.obterUsuario)
rotas.put('/usuario', usuarios.atualizarUsuario)

//Produtos
rotas.get('/produtos', produtos.listarProdutos)
rotas.get('/produtos/:id', produtos.detalharProduto)
rotas.post('/produtos', produtos.cadastrarProdutos)
rotas.put('/produtos/:id', produtos.atualizarProduto)
rotas.delete('/produtos/:id', produtos.excluirProduto)
module.exports=rotas;