const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Ajuste o caminho

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verificar se o usuário já existe
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Inserir o novo usuário no banco de dados
        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, criado_por) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [nome, email, senhaCriptografada, 'Sistema']
        );

        // Gerar um token JWT
        const token = jwt.sign(
            { id: novoUsuario.rows[0].id, email: novoUsuario.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '1y' }
        );

        res.status(201).json({ token });
    } catch (err) {
        console.error('Erro ao registrar o usuário:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para fazer login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Buscar o usuário no banco de dados
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length === 0) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const usuario = usuarioExistente.rows[0];

        // Verificar a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Gerar um token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;