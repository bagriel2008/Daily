const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { name, nameOfUser, password, email } = req.body;
    const query = "INSERT INTO users (name, nameOfUser, password, email) VALUES (?, ?, ?, ?)";

    connection.query(query, [name, nameOfUser, password, email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        res.json({
            success: true,
            message: 'Cadastro bem-sucedido',
            data: { id: results.insertId, name, nameOfUser, password, email }
        });
    });
});

// Login de usuário
app.post('/login', (req, res) => {
    const { nameOfUser, password } = req.body;
    const query = 'SELECT * FROM users WHERE nameOfUser = ? AND password = ?';

    connection.query(query, [nameOfUser, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor.' });

        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido!', user: results[0] });
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos!' });
        }
    });
});

// Cadastrar tarefa
app.post('/progress', (req, res) => {
    const { nameOfProgress, month } = req.body;
    const query = "INSERT INTO progress (nameOfProgress, month) VALUES (?, ?)";

    connection.query(query, [nameOfProgress, month], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        res.json({
            success: true,
            message: 'Tarefa cadastrada com sucesso',
            data: { id: results.insertId, nameOfProgress, month }
        });
    });
});

// Buscar tarefas de um mês
app.get('/progress/:month', (req, res) => {
    const { month } = req.params;
    const query = "SELECT * FROM progress WHERE month = ?";

    connection.query(query, [month], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        res.json({ success: true, data: results });
    });
});

// Atualizar cor do dia
app.put('/progress/updateColor', (req, res) => {
    const { month, day, color } = req.body;

    if (!month || !day || !color) {
        return res.status(400).json({ success: false, message: 'Faltando parâmetros' });
    }

    const updateQuery = "UPDATE progress SET color = ? WHERE month = ? AND day = ?";
    connection.query(updateQuery, [color, month, day], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar cor:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor.' });
        }

        if (results.affectedRows > 0) {
            return res.json({ success: true, message: 'Cor atualizada com sucesso.' });
        } else {
            // Se não existir, inserir
            const insertQuery = "INSERT INTO progress (month, day, color) VALUES (?, ?, ?)";
            connection.query(insertQuery, [month, day, color], (err) => {
                if (err) {
                    console.error('Erro ao inserir cor:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao inserir no banco.' });
                }
                return res.json({ success: true, message: 'Cor inserida com sucesso.' });
            });
        }
    });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));