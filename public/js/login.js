const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

const formLogin = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            mensagem.textContent = 'Login realizado com sucesso!';
            window.location.href = 'admin.html'; // Redireciona para o painel administrativo
        } else {
            mensagem.textContent = 'Erro ao fazer login: ' + data.message;
        }
    } catch (error) {
        console.error('Erro:', error);
        mensagem.textContent = 'Erro ao fazer login: ' + error;
    }
});