const calendario = document.getElementById('calendarioDias');
const funciona = document.getElementById('funciona');
const mesesSelect = document.getElementById('meses');
const containerProgressos = document.querySelector('.Progressos');

let mesAtual = mesesSelect.value;

mesesSelect.addEventListener('change', () => {
    mesAtual = mesesSelect.value;
    carregarTarefasDoMes(mesAtual);
    carregarQuadrados(mesAtual);
});

funciona.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <h1>Como Funciona</h1>
        <p>Clique nos quadros que correspondem às atividades realizadas no dia.</p>
        <button id="fecharPopup">Fechar</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('fecharPopup').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
});

function configurarBotaoAdicionar() {
    const botaoAdicionar = document.getElementById('botaoAdicionar');
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', abrirPopupAdicionar);
    }
}

function abrirPopupAdicionar() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const popup = document.createElement('div');
    popup.classList.add('popup-rosinha');
    popup.innerHTML = `
        <div class="popup-header">
            <h2>Adicionar</h2>
            <span id="fecharAdicionar" class="fechar">×</span>
        </div>
        <div class="popup-body">
            <label for="tarefaInput">Escreva a tarefa:</label>
            <input type="text" id="tarefaInput" placeholder="Digite sua tarefa...">
            <button id="confirmarAdicionar">Adicionar</button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('fecharAdicionar').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    document.getElementById('confirmarAdicionar').addEventListener('click', () => {
        const tarefa = document.getElementById('tarefaInput').value.trim();
        if (tarefa !== "") {
            salvarTarefa(tarefa, mesAtual);
            document.body.removeChild(overlay);
        } else {
            alert("Por favor, escreva uma tarefa!");
        }
    });
}

function salvarTarefa(tarefa, mes) {
    fetch('http://localhost:3030/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameOfProgress: tarefa, month: mes })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarTarefaNaTela(tarefa);
        } else {
            alert('Erro ao salvar tarefa!');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    });
}

function mostrarTarefaNaTela(tarefa) {
    const tarefaDiv = document.createElement('div');
    tarefaDiv.classList.add('tarefa');
    tarefaDiv.innerHTML = `<p>${tarefa}</p>`;

    containerProgressos.appendChild(tarefaDiv);

    adicionarNovoBotaoAdicionar();
}

function adicionarNovoBotaoAdicionar() {
    const botaoExistente = document.getElementById('botaoAdicionar');
    if (botaoExistente) {
        botaoExistente.remove();
    }

    const novoBotao = document.createElement('button');
    novoBotao.id = 'botaoAdicionar';
    novoBotao.textContent = '+ adicionar';
    containerProgressos.appendChild(novoBotao);

    configurarBotaoAdicionar();
}

function carregarTarefasDoMes(mes) {
    fetch(`http://localhost:3030/progress/${mes}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            containerProgressos.innerHTML = "";
            data.data.forEach(tarefa => {
                if (tarefa.nameOfProgress) {
                    mostrarTarefaNaTela(tarefa.nameOfProgress);
                }
            });
            adicionarNovoBotaoAdicionar();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Função que carrega o calendário de quadrados

function carregarQuadrados(mes) {
    calendario.innerHTML = ''; // Limpa os quadrados existentes

    const totalQuadrados = 279; // Total de quadrados
    const grade = document.createElement('div');
    grade.classList.add('grade-calendario'); // Aplique a classe de grid aqui

    // Criação dos quadrados
    for (let i = 1; i <= totalQuadrados; i++) {
        const quadrado = document.createElement('div');
        quadrado.classList.add('quadrado');
        quadrado.dataset.numero = i; // Identifica o quadrado
        quadrado.textContent = i; // Exibe o número dentro do quadrado
        grade.appendChild(quadrado);
    }

    calendario.appendChild(grade); // Adiciona a grade com os quadrados

    // Puxar as cores do banco de dados e pintar os quadrados
    fetch(`http://localhost:3030/progress/${mes}`)
    .then(response => response.json())
    .then(data => {
        data.data.forEach(item => {
            if (item.day && item.color) {
                const quadrado = grade.querySelector(`div[data-numero="${item.day}"]`);
                if (quadrado) {
                    quadrado.style.backgroundColor = item.color;
                }
            }
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

calendario.addEventListener('click', (e) => {
    if (e.target.classList.contains('quadrado')) {
        const quadrado = e.target;
        const dia = quadrado.dataset.numero; // Corrigido para 'data-numero'
        let novaCor = '';

        // Verificar a cor atual do quadrado para alternar a cor
        if (quadrado.style.backgroundColor === 'rgb(227, 181, 229)') {
            novaCor = '#852289'; // cor roxa
        } else {
            novaCor = '#E3B5E5'; // cor padrão
        }

        // Atualizar a cor do quadrado na interface
        quadrado.style.backgroundColor = novaCor;

        // Enviar a nova cor para o backend
        fetch('http://localhost:3030/progress/updateColor', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: mesAtual, day: dia, color: novaCor })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Erro ao atualizar cor:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
});

// Inicializa
carregarTarefasDoMes(mesAtual);
carregarQuadrados(mesAtual);
configurarBotaoAdicionar();