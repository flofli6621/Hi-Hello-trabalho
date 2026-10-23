import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const menuCriarConta = document.getElementById("menuCriarConta");
const menuLogin = document.getElementById("menuLogin");
const menuPerfil = document.getElementById("menuPerfil");
const menuSair = document.getElementById("menuSair");

// ===============================
// VERIFICAR USUÁRIO LOGADO
// ===============================
onAuthStateChanged(auth, (usuario) => {

    if (usuario) {

        // Usuário está logado
        menuCriarConta.style.display = "none";
        menuLogin.style.display = "none";

        menuPerfil.style.display = "";
        menuSair.style.display = "";

        console.log("Usuário logado:", usuario.uid);

    } else {

        // Usuário não está logado
        menuCriarConta.style.display = "";
        menuLogin.style.display = "";

        menuPerfil.style.display = "none";
        menuSair.style.display = "none";

        console.log("Nenhum usuário logado.");
    }
});

// ===============================
// BOTÃO SAIR
// ===============================
menuSair.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        await signOut(auth);

        // Limpa informações antigas da sessão
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("usuarioUID");

        console.log("Usuário saiu da conta.");

        window.location.href = "./login.html";

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        alert(
            "Não foi possível sair da conta."
        );
    }
});