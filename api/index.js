require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const authRoutes = require('./routes/auth'); // Ajuste o caminho
const atletasRoutes = require('./routes/atletas'); // Ajuste o caminho
const pool = require('./db'); // Ajuste o caminho

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
    origin: ['https://www.atletasbrasileiras.com.br', 'http://localhost:3000', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes); // Ajuste o caminho
app.use('/api/atletas', atletasRoutes); // Ajuste o caminho

const requireAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Erro na verificação do token:", err);
            return res.status(403).json({ message: 'Token inválido.' });
        }

        req.usuario = decoded;
        next();
    });
};

// Testar conexão com banco ao iniciar
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Banco de dados conectado:', res.rows[0]);
    }
});

app.get('/api/', (req, res) => {  // Ajuste o caminho
    res.send('API está funcionando corretamente!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;