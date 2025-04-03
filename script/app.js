import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.querySelector('.modal-overlay');
    const registerModal = document.getElementById('register-modal');
    const openLoginBtns = document.querySelectorAll('.login-trigger');
    const openRegisterBtn = document.getElementById('open-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const landingPage = document.querySelector('.landing-page');
    const dashboard = document.getElementById('dashboard-container');
    const treinosSection = document.getElementById('treinos');
    const treinosList = document.getElementById('treinos-list');
    const addTreinoBtn = document.getElementById('add-treino');
    const menuButtons = document.querySelectorAll('.menu-btn');
    const exerciciosSection = document.getElementById('exercicios');
    const exerciciosList = document.getElementById('exercicios-list');
    const addExercicioBtn = document.getElementById('add-exercicio');

    let treinos = [];

    // Abrir modal de login
    openLoginBtns.forEach(button => {
        button.addEventListener('click', () => loginModal.classList.add('active'));
    });

    // Fechar modal de login ao clicar fora
    loginModal?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            loginModal.classList.remove('active');
        }
    });

    // Abrir modal de registro
    openRegisterBtn?.addEventListener('click', () => {
        loginModal.classList.remove('active');
        registerModal.classList.remove('hidden');
        registerModal.classList.add('active');
    });

    // Fechar modal de registro ao clicar fora
    registerModal?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            registerModal.classList.remove('active');
            registerModal.classList.add('hidden');
        }
    });

    // Lógica de Login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/api/usuarios/login?email=${email}&senha=${senha}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Login inválido.');

            const data = await response.json();
            console.log("Login bem-sucedido!", data);
            alert('Login realizado com sucesso!');
            
            // Esconde a landing page e mostra o dashboard
            loginModal.classList.remove('active');
            landingPage.classList.add('hidden');
            dashboard.classList.remove('hidden');

            // Ativa a aba "Treinos" automaticamente
            document.querySelector('.menu-btn[data-section="treinos"]').click();
            loginForm.reset();
        } catch (error) {
            console.error("Erro no login:", error);
            alert(error.message);
        }
    });

    // Lógica de Registro
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('register-nome').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const senha = document.getElementById('register-senha').value.trim();

        if (!nome || !email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const userData = { nome, email, senha };

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
            console.error("Erro no registro:", error);
            alert(error.message);
        }
    });

    // Alternância entre seções
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
            const sectionToShow = document.getElementById(button.dataset.section);
            sectionToShow.classList.remove('hidden');
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Adicionar novo treino
    addTreinoBtn?.addEventListener('click', async () => {
        const treinoNome = prompt("Nome do novo treino:");
        if (treinoNome) {
            try {
                const response = await fetch(`${config.API_URL}/api/treinos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: treinoNome })
                });

                if (!response.ok) throw new Error("Erro ao criar treino");

                const treino = await response.json();
                treinos.push(treino);
                atualizarTreinos();
            } catch (error) {
                console.error("Erro ao adicionar treino:", error);
                alert(error.message);
            }
        }
    });

    // Atualizar lista de treinos
    async function atualizarTreinos() {
        treinosList.innerHTML = "";
        try {
            const response = await fetch(`${config.API_URL}/api/treinos`);
            const treinosData = await response.json();
            treinosData.forEach((treino) => {
                const treinoItem = document.createElement('div');
                treinoItem.classList.add('treino-item');
                treinoItem.textContent = treino.nome;

                const addExercicioBtn = document.createElement('button');
                addExercicioBtn.textContent = 'Adicionar Exercício';
                addExercicioBtn.addEventListener('click', () => {
                    const exercicioNome = prompt("Nome do exercício:");
                    if (exercicioNome) {
                        adicionarExercicio(treino.id, exercicioNome);
                    }
                });

                treinoItem.appendChild(addExercicioBtn);
                treinosList.appendChild(treinoItem);
            });
        } catch (error) {
            console.error("Erro ao carregar treinos:", error);
        }
    }

    // Adicionar exercício
    async function adicionarExercicio(treinoId, exercicioNome) {
        try {
            const response = await fetch(`${config.API_URL}/api/exercicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: exercicioNome, treinoId })
            });

            if (!response.ok) throw new Error("Erro ao adicionar exercício");

            const exercicio = await response.json();
            const exercicioItem = document.createElement('div');
            exercicioItem.classList.add('exercicio-item');
            exercicioItem.textContent = exercicio.nome;

            exerciciosList.appendChild(exercicioItem);
        } catch (error) {
            console.error("Erro ao adicionar exercício:", error);
            alert(error.message);
        }
    }
});
