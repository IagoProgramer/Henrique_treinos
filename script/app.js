import { config } from './config.js';

// Adicionando eventos para abrir e fechar o modal de login e registro
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.querySelector('.modal-overlay');
    const registerModal = document.getElementById('register-modal');
    const openLoginBtns = document.querySelectorAll('.login-trigger');
    const openRegisterBtn = document.getElementById('open-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Abrir o modal de login
    openLoginBtns.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    });

    // Fechar o modal de login ao clicar fora
    loginModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            loginModal.classList.remove('active');
        }
    });

    // Abrir o modal de registro
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', () => {
            loginModal.classList.remove('active'); // Fechar o modal de login ao abrir o de registro
            registerModal.classList.remove('hidden'); // Mostrar o modal de registro
            registerModal.classList.add('active'); // A classe 'active' pode ser usada para tornar o modal visível
        });
    };

    // Fechar o modal de registro ao clicar fora
    registerModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            registerModal.classList.remove('active');
            registerModal.classList.add('hidden');
        }
    });

    // Lógica de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('username').value.trim();
            const senha = document.getElementById('password').value.trim();

            if (!email || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            try {
                const response = await fetch(`${config.API_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                

                if (!response.ok) throw new Error('Login inválido.');

                alert('Login realizado com sucesso!');
                loginModal.classList.remove('active');
                loginForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Lógica de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('register-nome').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const senha = document.getElementById('register-senha').value.trim();

            if (!nome || !email || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const userData = { nome, email, Senha: senha };         


            try {
                const response = await fetch(`${config.API_URL}/api/usuarios/register`, {                     
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro ao criar conta: ${errorText}`);
                }

                alert('Conta criada com sucesso!');
                registerForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }
});