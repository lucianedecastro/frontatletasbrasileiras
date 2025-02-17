const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

const formLogin = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            mensagem.textContent = 'Login realizado com sucesso!';
            mensagem.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            mensagem.textContent = 'Erro ao fazer login: ' + (data.message || 'Verifique suas credenciais');
            mensagem.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro:', error);
        mensagem.textContent = 'Erro ao fazer login. Tente novamente mais tarde.';
        mensagem.style.color = 'red';
    }
});
