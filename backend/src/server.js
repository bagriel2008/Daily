const express = require("express");
const cors = require("cors");
const connection = require("./db_config");
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { email, senha, nome, usuario } = req.body;
    const query = "INSERT INTO users (email, password, name, nameOfUser) VALUES (?, ?, ?, ?)";

    connection.query(query, [email, senha, nome, usuario], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

        res.json({
            success: true,
            message: 'Cadastro bem-sucedido',
            data: { id: results.insertId, email, senha, nome, usuario}
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

app.put('/usuarios/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;

    const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    connection.query(query, [name, email, id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Erro ao atualizar." });

        res.json({ success: true, message: "Perfil atualizado com sucesso." });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM users WHERE id = ?";

    connection.query(query, [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Erro ao excluir usuário." });

        res.json({ success: true, message: "Usuário excluído com sucesso." });
    });
});


// Cadastrar tarefa
app.post('/progress', (req, res) => {
    const { nameOfProgress, month,} = req.body;
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

app.post('/novaMeta', (req, res) => {
    const { novaMeta } = req.body;
    const sql = 'INSERT INTO newGoal (novaMeta) VALUES (?)';
  
    connection.query(sql, [novaMeta], (err, result) => {
      if (err) {
        console.error('Erro ao adicionar meta:', err);
        return res.status(500).json({ error: 'Erro ao adicionar meta' });
      }
      res.json({ id: result.insertId, novaMeta }); //
    });
  });

app.get('/metas', (req, res) => {
    const query = 'SELECT * FROM newGoal';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar metas:', err);
            return res.status(500).json({ error: 'Erro ao buscar metas' });
        }
        res.json(results);
    });
});

app.delete('/deleteGoal/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM newGoal WHERE id = ?';
  
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Erro ao excluir meta:', err);
        return res.status(500).json({ error: 'Erro ao excluir meta' });
      }
      res.json({ success: true });
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