document.addEventListener('DOMContentLoaded', () => {
    const btnSignin = document.querySelector("#signin");
    const btnSignup = document.querySelector("#signup");
    const body = document.querySelector("body");

    btnSignin.addEventListener("click", function () {
        console.log("Login button clicked");
        body.classList.remove("sign-up-js");
        body.classList.add("sign-in-js");
    });

    btnSignup.addEventListener("click", function () {
        console.log("Signup button clicked");
        body.classList.remove("sign-in-js");
        body.classList.add("sign-up-js");
    });
});
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log('Dados enviados para login:', { email, password });

    try {
        const res = await fetch('http://127.0.0.1:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            console.log('Login bem-sucedido. Token recebido:', data.token);

            // Armazena o token e o nome do usuário no localStorage
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('username', data.name);

            // Redireciona para a página inicial
            window.location.href = 'home.html';
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
});


document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log('Dados enviados:', { name, email, password }); 

    try {
        const res = await fetch('http://127.0.0.1:5000/api/users/register', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            alert('Usuário registrado com sucesso');
            window.location.reload();
        } else {
            alert(data.error || 'Erro ao registrar usuário');
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
});
