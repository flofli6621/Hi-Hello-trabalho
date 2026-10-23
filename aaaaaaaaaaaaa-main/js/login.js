import { auth } from "../firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");
const message = document.getElementById("message");

// ===============================
// MOSTRAR MENSAGEM
// ===============================
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
    message.style.display = "block";
}

// ===============================
// MOSTRAR / OCULTAR SENHA
// ===============================
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Ocultar";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Mostrar";
    }
});

// ===============================
// LOGIN
// ===============================
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage(
            "Preencha seu e-mail e sua senha.",
            "error"
        );
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";

    try {
        const resultado = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const usuario = resultado.user;

        console.log("Login realizado:", usuario.uid);

        showMessage(
            "Login realizado com sucesso!",
            "success"
        );

        setTimeout(() => {
            window.location.href = "perfil.html";
        }, 1000);

    } catch (error) {
        console.error("Erro no login:", error);

        let errorMessage = "Não foi possível realizar o login.";

        switch (error.code) {
            case "auth/invalid-credential":
                errorMessage = "E-mail ou senha incorretos.";
                break;

            case "auth/user-not-found":
                errorMessage = "Não existe uma conta com este e-mail.";
                break;

            case "auth/wrong-password":
                errorMessage = "Senha incorreta.";
                break;

            case "auth/invalid-email":
                errorMessage = "Digite um e-mail válido.";
                break;

            case "auth/too-many-requests":
                errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
                break;

            case "auth/operation-not-allowed":
                errorMessage =
                    "O login por e-mail e senha ainda não está ativado no Firebase.";
                break;
        }

        showMessage(errorMessage, "error");

        loginButton.disabled = false;
        loginButton.textContent = "Entrar";
    }
});

// ===============================
// RECUPERAR SENHA
// ===============================
forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        showMessage(
            "Digite seu e-mail primeiro para recuperar sua senha.",
            "error"
        );

        emailInput.focus();
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);

        showMessage(
            "Enviamos um link para redefinir sua senha.",
            "success"
        );

    } catch (error) {
        console.error(
            "Erro ao recuperar senha:",
            error
        );

        if (error.code === "auth/invalid-email") {
            showMessage(
                "Digite um e-mail válido.",
                "error"
            );
        } else {
            showMessage(
                "Não foi possível enviar o e-mail de recuperação.",
                "error"
            );
        }
    }
});