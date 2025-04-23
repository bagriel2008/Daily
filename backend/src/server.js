const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

app.post('/cadastro', (req, res) => {
    const { name, nameOfUser, password, email } = req.body
    const query = "INSERT INTO users (name,nameOfUser, password, email) VALUES (?,?,?,?)"

    connection.query(query, [name, nameOfUser, password, email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor' })
        }
        else {
            res.json({
                success: true, message: 'Cadastro bem sucedido',
                data: { id: results.insertId, name, nameOfUser, password, email }
            })
        }
    })
})

app.post('/login', (req, res) => {
    const { nameOfUser, password } = req.body;

    const query = 'SELECT * FROM users WHERE nameOfUser = ? AND password = ?';
    connection.query(query, [nameOfUser, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido!', user: results[0] });
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos!' });
        }
    });
});

app.post('/progress', (req, res) =>{
    const {nameOfProgress} = req.body
    const query = "INSERT INTO progress (nameOfProgress) VALUES (?)"
    
    connection.query(query, [nameOfProgress], (err, results) =>{
        if (err) {
            return res.status(500).json({success:false, message:'Erro no servidor'})
        }
        else {
            res.json({success:true, message:'Cadastro bem sucedido', 
            data:{ id: results.insertId, nameOfProgress }})
        }
    })
})




app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));