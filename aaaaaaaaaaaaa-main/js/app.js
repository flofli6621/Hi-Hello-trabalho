import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const form = document.getElementById('formCadastro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const senha = document.getElementById('senha').value;

  try {
    // 1. Cria o usuário com E-mail e Senha no Firebase Authentication de forma segura
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 2. Salva os dados adicionais (Nome e Telefone) no Firestore usando o UID do usuário
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: nome,
      telefone: telefone,
      email: email,
      cadastradoEm: new Date()
    });

    alert("Usuário cadastrado com sucesso!");
    form.reset();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert("Erro ao cadastrar: " + error.message);
  }
});
