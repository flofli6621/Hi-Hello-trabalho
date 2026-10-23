import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ===============================
// ELEMENTOS DA PÁGINA
// ===============================

const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");
const telefoneUsuario = document.getElementById("telefoneUsuario");
const sairButton = document.getElementById("sairButton");

// ===============================
// VERIFICAR USUÁRIO LOGADO
// ===============================

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {
        window.location.href = "./login.html";
        return;
    }

    console.log("Usuário logado:", usuario.uid);

    emailUsuario.textContent = usuario.email || "Não informado";

    // ===============================
    // BUSCAR DADOS NO FIRESTORE
    // ===============================

    try {
        const usuarioRef = doc(db, "usuarios", usuario.uid);
        const usuarioSnapshot = await getDoc(usuarioRef);

        if (usuarioSnapshot.exists()) {
            const dados = usuarioSnapshot.data();

            nomeUsuario.textContent = dados.nome || "Não informado";
            telefoneUsuario.textContent = dados.telefone || "Não informado";

        } else {
            console.log("Documento do usuário não encontrado no Firestore.");

            nomeUsuario.textContent = "Não informado";
            telefoneUsuario.textContent = "Não informado";
        }

    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);

        nomeUsuario.textContent = "Erro ao carregar";
        telefoneUsuario.textContent = "Erro ao carregar";
    }
});

// ===============================
// BOTÃO SAIR
// ===============================

sairButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "./login.html";

    } catch (error) {
        console.error("Erro ao sair:", error);
        alert("Não foi possível sair da conta.");
    }
});