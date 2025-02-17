const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Testar a conexão ao iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Banco de dados conectado:', res.rows[0]);
  }
});

module.exports = pool;
