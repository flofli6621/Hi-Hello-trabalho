import { auth, db } from "../firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { getAuth } from "firebase-admin/auth";

const hashOptions = {
  algorithm: 'SCRYPT',
  key: Buffer.from('bxGo8EbjrY8ci+E9ajIou10KKB1gj1xbH1d8fLk/PlmwkARnlEMXAVzyLY0/B/6TbwsqvLxI0tLN43JNZmifnw==', 'base64'),
  saltSeparator: Buffer.from('Bw==', 'base64'),
  rounds: 8,
  memoryCost: 14
};

// Exemplo de importação no Admin SDK
getAuth().importUsers([
  {
    uid: 'uid-do-usuario',
    email: 'usuario@email.com',
    passwordHash: Buffer.from('hash_da_senha_do_usuario', 'base64'),
    passwordSalt: Buffer.from('salt_do_usuario', 'base64')
  }
], { hash: hashOptions });

// ==============================
// ELEMENTOS DA PÁGINA
// ==============================

const formulario = document.getElementById("cadastro-form");
const campoSenha = document.getElementById("senha");
const campoConfirmarSenha = document.getElementById("confirmar-senha");
const forcaSenha = document.getElementById("forca-senha");
const mensagem = document.getElementById("mensagem");

// ==============================
// FUNÇÃO PARA MOSTRAR MENSAGEM
// ==============================

function mostrarMensagem(texto, tipo = "erro") {
    mensagem.textContent = texto;
    mensagem.style.display = "block";

    if (tipo === "sucesso") {
        mensagem.style.color = "#4e342e";
        mensagem.style.backgroundColor = "#e8f0e5";
    } else {
        mensagem.style.color = "#8b3a3a";
        mensagem.style.backgroundColor = "#f5e1e1";
    }
}

// ==============================
// VERIFICAR FORÇA DA SENHA
// ==============================

campoSenha.addEventListener("input", function () {
    const senha = campoSenha.value;

    if (senha.length === 0) {
        forcaSenha.textContent = "";
    } else if (senha.length < 6) {
        forcaSenha.textContent = "🔴 Senha fraca";
    } else if (senha.length < 10) {
        forcaSenha.textContent = "🟡 Senha média";
    } else {
        forcaSenha.textContent = "🟢 Senha forte";
    }
});

// ==============================
// CADASTRO
// ==============================

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = campoSenha.value;
    const confirmarSenha = campoConfirmarSenha.value;

    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
        mostrarMensagem("Preencha todos os campos!");
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem("A senha precisa ter pelo menos 6 caracteres!");
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não são iguais!");
        return;
    }

    const botaoCadastrar = formulario.querySelector('button[type="submit"]');
    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Criando conta...";

    try {
        const resultado = await createUserWithEmailAndPassword(auth, email, senha);
        const usuario = resultado.user;

        console.log("Usuário criado no Authentication:", usuario.uid);

        await setDoc(doc(db, "usuarios", usuario.uid), {
            nome: nome,
            email: email,
            telefone: telefone,
            ativo: true,
            criadoEm: new Date()
        });

        console.log("Dados salvos no Firestore!");

        mostrarMensagem("Cadastro realizado com sucesso! ☕", "sucesso");

        setTimeout(() => {
            window.location.href = "perfil.html";
        }, 1500);

    } catch (erro) {
        console.error("Erro completo no cadastro:", erro);

        if (erro.code === "auth/email-already-in-use") {
            mostrarMensagem("Este e-mail já possui uma conta.");
        } else if (erro.code === "auth/invalid-email") {
            mostrarMensagem("Digite um e-mail válido.");
        } else if (erro.code === "auth/weak-password") {
            mostrarMensagem("A senha é muito fraca. Use pelo menos 6 caracteres.");
        } else if (erro.code === "auth/operation-not-allowed") {
            mostrarMensagem("O cadastro por e-mail e senha não está ativado no Firebase.");
        } else if (
            erro.code === "permission-denied" ||
            erro.code === "firestore/permission-denied"
        ) {
            mostrarMensagem("A conta foi criada, mas o Firestore bloqueou o salvamento dos dados.");
        } else {
            mostrarMensagem("Não foi possível realizar o cadastro. Verifique o console.");
        }

        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = "Cadastrar";
    }
});

// ==============================
// MOSTRAR / OCULTAR SENHA
// ==============================

const botoesSenha = document.querySelectorAll(".mostrar-senha");

botoesSenha.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const idCampo = botao.getAttribute("data-target");
        const campo = document.getElementById(idCampo);

        if (campo.type === "password") {
            campo.type = "text";
            botao.textContent = "🙈";
        } else {
            campo.type = "password";
            botao.textContent = "👁";
        }
    });
});