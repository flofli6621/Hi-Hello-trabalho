let quantidadeCarrinho = 0;
let produtoAtual = null;


function usuarioEstaLogado() {

    return localStorage.getItem("usuarioLogado") === "true";

}


function verificarCadastro() {

    if (usuarioEstaLogado()) {

        adicionarCarrinho();

    } else {

        modalCadastro.classList.add("ativo");

    }

}


function adicionarCarrinho() {

    quantidadeCarrinho++;

    contadorCarrinho.textContent =
        quantidadeCarrinho;

    alert("Produto adicionado ao carrinho!");

}
botao.addEventListener("click", function (event) {

    event.stopPropagation();

    verificarCadastro();

});