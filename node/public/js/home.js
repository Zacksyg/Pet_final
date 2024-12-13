document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwt'); // Recupera o token do localStorage
    const loginLink = document.getElementById('login-link');
    const petLink = document.getElementById('pet-link');
    const petViewLink = document.getElementById('pet-view-link'); // Link para visualizar o pet

    if (username) {
        loginLink.style.display = 'none';
        petLink.style.display = 'block';
        petViewLink.style.display = 'block';

        // Atualiza o link do "Cadastrar Pet" com o token
        if (token) {
            petLink.href = `http://127.0.0.1:5001/cadastrar_pet?token=${token}`;
            petViewLink.href = `http://127.0.0.1:5001/pets?token=${token}`;
            // Atualiza o link para o pet
            console.log('Links atualizados com token:', {
                cadastrarPet: petLink.href,
                visualizarPet: petViewLink.href
            });
        } else {
            console.warn('Token não encontrado. Certifique-se de que o usuário está autenticado.');
        }

        // Adiciona uma saudação ao usuário logado
        const navLinks = document.querySelector('.navbar-nav');
        navLinks.innerHTML += `
            <li class="nav-item">
                <span class="nav-link">Bem-vindo, ${username}</span>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link" id="logout">Logout</a>
            </li>
        `;
    } else {
        loginLink.style.display = 'block';
        petLink.style.display = 'none';
        petViewLink.style.display = 'none';
    }

    // Logout
    document.getElementById('logout')?.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        window.location.href = 'cadastro_login.html';
    });
});

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = encodeURIComponent(document.getElementById('name').value);
    const message = encodeURIComponent(document.getElementById('message').value);

    const mailtoLink = `mailto:pethealth.contato@gmail.com?subject=Contato%20de%20${name}&body=${message}`;
    window.location.href = mailtoLink;
});
