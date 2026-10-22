import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';

dotenv.config();//recupera as variáveis de ambiente do arquivo .env
const app = express();//cria o servidor 
app.use(express.json());//permitir json no corpo da requisição
app.use(express.static('./public'));//definir a pasta de arquivos estáticos (frontend)
const PORTA = process.env.PORTA;//define a porta do servidor
const conexao = conectarBanco();//variável de conexão

app.get("/", (req, res)=>{
    res.sendFile("index.html", {root: './public'});
});//pagina inicial do forntend
app.get("/livros", async (req, res) =>{
    const sql = "SELECT * FROM livros";
    const [resposta] = await conexao.query(sql);
    res.json(resposta);
});//rota para listar todos os livros do banco
app.post("/livros", async (req, res) => {
    const { titulo, descricao, autor } = req.body;
    if (!titulo || !descricao || !autor) {
        return res.status(400).json({ erro: "Obrigatório preencher todos os campos" });
    }

    try {
        const sql = "INSERT INTO livros (titulo, descricao, autor) VALUES (?, ?, ?)";
        await conexao.query(sql, [titulo, descricao, autor]); //essa linha eu tive duvidas... estudar!
        return res.status(201).json({ mensagem: "Adicionado com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao adicionar o livro." });
    }
}); // adicionar novos livros
app.put("/livros/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao, autor } = req.body;

    if (!titulo || !descricao || !autor) {
        return res.status(400).json({ erro: "Obrigatório preencher todos os campos" });
    }

    try {
        const novoLivro = [titulo, descricao, autor, id];
        const sql = "UPDATE livros SET titulo=?, descricao=?, autor=? WHERE id=?";
        
        const [resposta] = await conexao.query(sql, novoLivro);
        
        if (resposta.affectedRows > 0) {
            return res.status(200).json({ mensagem: "Atualizado com sucesso!" });
        } else {
            return res.status(404).json({ erro: "Nenhum livro encontrado com esse ID" });
        }
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar o livro." });
    }
}); // atualiza os livros da tabela
app.listen(PORTA, ()=>{
    console.log(`Servidor Rodando em http://localhost:${PORTA}`);
})//a porta 
