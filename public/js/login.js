document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const mensagem = document.getElementById('mensagem');

  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
          const response = await fetch('/api/auth/login', {  // Use o caminho relativo
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, senha }),
          });

          const data = await response.json();

          if (response.ok) {
              localStorage.setItem('token', data.token); // Salva o token no localStorage
              mensagem.textContent = 'Login realizado com sucesso!';
              mensagem.style.color = 'green';
              window.location.href = 'admin.html'; // Redireciona para a página de admin
          } else {
              mensagem.textContent = `Erro: ${data.message || 'Falha ao fazer login'}`;
              mensagem.style.color = 'red';
          }
      } catch (error) {
          console.error('Erro durante o login:', error);
          mensagem.textContent = 'Erro ao conectar com o servidor';
          mensagem.style.color = 'red';
      }
  });
});