document.addEventListener("DOMContentLoaded", () => {
    let iaDatabase = {}; // Objeto para armazenar os dados do data.json

    // Seleção dos elementos do DOM
    const caixaBusca = document.querySelector("#caixa-busca");
    const botaoPesquisar = document.querySelector("#botao-pesquisar");
    const botoesExemplo = document.querySelectorAll(".botao-exemplo");
    const resultadosContainer = document.querySelector("#resultados");

    // Função para normalizar o texto (remover acentos e converter para minúsculas)
    function normalizarTermo(termo) {
        return termo
            .toLowerCase()
            .normalize("NFD") // Separa os caracteres dos acentos
            .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos
    }

    // Função para realizar a busca e renderizar os resultados
    function realizarBusca(termo) {
        const termoNormalizado = normalizarTermo(termo);
        resultadosContainer.innerHTML = ""; // Limpa resultados anteriores

        // Lógica de busca aprimorada: encontra a chave que corresponde ao termo pesquisado
        let chaveEncontrada = null;
        const chavesDoBanco = Object.keys(iaDatabase);

        // Procura a chave mais relevante na frase pesquisada
        for (const chave of chavesDoBanco) {
            const chaveNormalizada = normalizarTermo(chave.replace("_", " "));
            if (chaveNormalizada.includes(termoNormalizado)) {
                chaveEncontrada = chave;
                break; // Para na primeira correspondência encontrada
            }
        }

        if (chaveEncontrada && iaDatabase[chaveEncontrada]) {
            const resultado = iaDatabase[chaveEncontrada];

            // Cria o texto introdutório
            const pInfo = document.createElement("p");
            pInfo.innerHTML = resultado.titulo; // Usa o título do JSON
            resultadosContainer.appendChild(pInfo);

            // Cria a lista de IAs
            const ul = document.createElement("ul");
            resultado.ias.forEach(ia => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = ia.link;
                a.textContent = ia.nome;
                a.target = "_blank"; // Abrir em nova aba
                li.appendChild(a);
                ul.appendChild(li);
            });
            resultadosContainer.appendChild(ul);

        } else {
            // Mensagem para quando nada é encontrado
            const pNaoEncontrado = document.createElement("p");
            pNaoEncontrado.textContent = "Nenhuma IA encontrada para essa categoria.";
            resultadosContainer.appendChild(pNaoEncontrado);
        }
    }

    // Função que busca os dados iniciais do data.json
    fetch("data.json")
        .then(resposta => resposta.json())
        .then(dadosJson => {
            iaDatabase = dadosJson; // Guarda a lista completa

            // ATIVA OS EVENTOS APENAS DEPOIS DE CARREGAR OS DADOS

            // Event listener para o botão de pesquisar
            botaoPesquisar.addEventListener("click", () => {
                if (caixaBusca.value) {
                    realizarBusca(caixaBusca.value);
                }
            });

            // Event listener para a tecla "Enter" na caixa de busca
            caixaBusca.addEventListener("keypress", (event) => {
                if (event.key === "Enter" && caixaBusca.value) {
                    realizarBusca(caixaBusca.value);
                }
            });

            // Event listener para os botões de exemplo
            botoesExemplo.forEach(botao => {
                botao.addEventListener("click", () => {
                    const termoExemplo = botao.textContent;
                    caixaBusca.value = termoExemplo; // Preenche o campo de busca
                    realizarBusca(termoExemplo); // Realiza a busca
                });
            });
        });
});