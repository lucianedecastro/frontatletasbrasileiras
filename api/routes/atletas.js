const express = require('express');
const pool = require('../db'); // Ajuste o caminho
const requireAuth = require('../middleware/requireAuth'); // Ajuste o caminho

const router = express.Router();

// Middleware para garantir que o usuário está autenticado para as rotas abaixo
router.use(requireAuth);

// Rota para criar uma nova atleta (POST)
router.post('/', async (req, res) => {
    try {
        const { nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes } = req.body;
        const novaAtleta = await pool.query(
            'INSERT INTO atletas (nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes, criado_por) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes, req.usuario.email] // Usando o email do usuário que criou
        );
        res.status(201).json(novaAtleta.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar a atleta' });
    }
});

// Rota para buscar todas as atletas (GET)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM atletas');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar as atletas' });
    }
});

// Rota para buscar uma atleta específica por ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM atletas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Atleta não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar a atleta' });
    }
});

// Rota para atualizar uma atleta (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes } = req.body;
        const result = await pool.query(
            'UPDATE atletas SET nome_completo = $1, data_nascimento = $2, modalidade_id = $3, principais_conquistas = $4, fonte_informacao = $5, outras_informacoes = $6, atualizado_por = $7 WHERE id = $8 RETURNING *',
            [nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes, req.usuario.email, id] // Usando o email do usuário que atualizou
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Atleta não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar a atleta' });
    }
});

// Rota para excluir uma atleta (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM atletas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Atleta não encontrada' });
        }
        res.json({ message: 'Atleta excluída com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir a atleta' });
    }
});

module.exports = router;