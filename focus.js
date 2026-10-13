window.onload = function() {
    populaRotinasCadastradas('campoExibeMetasIndividualmente')
    geraIdRotina('idRotinaCadastro');
    mostraDataAtual('dataInicioRotinaCadastro');
    mostraDataAtual('dataAtualizacaoRotinaCadastro');

};

let arrayRotinas = JSON.parse(localStorage.getItem('Rotina')) || [];

class Rotina{
    constructor(
        id, 
        nome, 
        inicio, 
        ultimaAtualizacao, 
        concluidos, 
        pendentes, 
        estado)
        {
        this.id = id;
        this.nome = nome;
        this.inicio = inicio;
        this.ultimaAtualizacao = ultimaAtualizacao;
        this.concluidos = concluidos;
        this.pendentes = pendentes;
        this.estado = estado;
    }
}

    
/* ----------------------------- FUNÇÕES ----------------------------- */
function geraIdRotina(idCampo) {
    let campoId = document.getElementById(idCampo);

    if (arrayRotinas.length === 0) {
        console.log('Nenhum cadastro de Rotina realizado.');
    }

    let totalAtual = arrayRotinas.length;
    let proximoCodigo = totalAtual + 1;

    campoId.value = `RTN_${proximoCodigo}`;
}

function salvarRotina() {
    let campoIdRotina = document.getElementById('idRotinaCadastro').value;
    let campoNomeRotina = document.getElementById('nomeRotinaCadastro').value;
    let campoDataInicioRotina = document.getElementById('dataInicioRotinaCadastro').value;
    let campoDataAtualizacaoRotina = document.getElementById('dataAtualizacaoRotinaCadastro').value;

    if (
        campoIdRotina.trim() === '' ||
        campoNomeRotina.trim() === '' ||
        campoDataInicioRotina.trim() === '' ||
        campoDataAtualizacaoRotina.trim() === ''
    ) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    let cadastro = new Rotina(
        campoIdRotina,
        campoNomeRotina.trim(),
        campoDataInicioRotina,
        campoDataAtualizacaoRotina,
        [],
        [],
        'Ativo'
    );

    arrayRotinas.push(cadastro);
    localStorage.setItem('Rotina', JSON.stringify(arrayRotinas));
    console.log(arrayRotinas);
    alert(`A rotina ${campoNomeRotina} foi cadastrada com sucesso!`);
    populaRotinasCadastradas('campoExibeMetasIndividualmente')
    geraIdRotina('idRotinaCadastro');
}

function mostraDataAtual(idCampo) {
    const campoData = document.getElementById(idCampo);
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    campoData.value = `${ano}-${mes}-${dia}`;
}

function formataData(data) {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
}

function populaRotinasCadastradas(idCampo, tipo) {
    let campo = document.getElementById(idCampo);
    campo.innerHTML = '';
    
    arrayRotinas.forEach(rotina => {
        let dataAtualizada = formataData(rotina.ultimaAtualizacao)

        campo.innerHTML += `
            <span class="statusRotina rotina_${rotina.estado}">${rotina.estado}</span>

            <div class="row">
                <div class="col">
                    <div class="alert alert-primary">
                        <div class="row">
                            <div class="col">
                                <div class="row">
                                    <span class="uppercase fw-bold tamanho08">
                                        ${rotina.nome}
                                    </span>
                                </div>

                                <div class="row">
                                    <span class="uppercase tamanho06 text-danger">
                                        ${dataAtualizada}
                                    </span>
                                </div>
                            </div>

                            <div class="col-auto">
                                <div class="btn btn-sm btn-success"
                                onclick="checkRotinaConcluido('${rotina.id}')">
                                    <span class="uppercase tamanho07">
                                        ${rotina.concluidos.length}
                                    </span>
                                    <i class="fa fa-check"></i>
                                </div>

                                <div class="btn btn-sm btn-danger"
                                onclick="checkRotinaPendente('${rotina.id}')">
                                    <span class="uppercase tamanho07">
                                        ${rotina.pendentes.length}
                                    </span>
                                    <i class="fa fa-xmark"></i>
                                </div>

                                <div class="btn btn-sm btn-warning"
                                onclick="resetaDados('${rotina.id}')">
                                    <i class="fa fa-refresh"></i>
                                </div>

                                <div class="btn btn-sm btn-primary"
                                onclick="ativarRotina('${rotina.id}')">
                                    <i class="fa-solid fa-thumbs-up"></i>
                                </div>

                                <div class="btn btn-sm btn-dark"
                                    onclick="desativarRotina('${rotina.id}')">
                                    <i class="fa-solid fa-thumbs-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}



function checkRotinaConcluido(idRotina) {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    let dataAtual = `${ano}-${mes}-${dia}`;
    let dataManipulada = `${dia}/${mes}/${ano}`;

    arrayRotinas.forEach(rotina => {
        if (rotina.id == idRotina) {
            if (!Array.isArray(rotina.concluidos)) {
                rotina.concluidos = [];
            }
            if (!Array.isArray(rotina.pendentes)) {
                rotina.pendentes = [];
            }
            if (rotina.concluidos.includes(dataAtual)) {
                alert(`Já foi confirmada anteriormente a conclusão da Rotina [${rotina.nome.toUpperCase()}] para o dia ${dataManipulada}`);
                return;
            }

            let indicePendente = rotina.pendentes.indexOf(dataAtual);

            if (indicePendente !== -1) {
                rotina.pendentes.splice(indicePendente, 1);
            }

            rotina.concluidos.push(dataAtual);

            localStorage.setItem('Rotina',JSON.stringify(arrayRotinas));

            populaRotinasCadastradas('campoExibeMetasIndividualmente','Todos');
        }
    });
}

function checkRotinaPendente(idRotina) {
    const data = new Date();

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    let dataAtual = `${ano}-${mes}-${dia}`;
    let dataManipulada = `${dia}/${mes}/${ano}`;

    arrayRotinas.forEach(rotina => {
        if (rotina.id == idRotina) {
            if (!Array.isArray(rotina.pendentes)) {
                rotina.pendentes = [];
            }
            if (!Array.isArray(rotina.concluidos)) {
                rotina.concluidos = [];
            }
            if (rotina.pendentes.includes(dataAtual)) {
                alert(`Já foi confirmada anteriormente a pendência da Rotina [${rotina.nome.toUpperCase()}] para o dia ${dataManipulada}`);
                return;
            }

            let indiceConclusao = rotina.concluidos.indexOf(dataAtual);

            if (indiceConclusao !== -1) {
                rotina.concluidos.splice(indiceConclusao, 1);
            }

            rotina.pendentes.push(dataAtual);

            localStorage.setItem('Rotina',JSON.stringify(arrayRotinas));
            populaRotinasCadastradas('campoExibeMetasIndividualmente','Todos');
        }
    });
}

function desativarRotina(idRotina){
    arrayRotinas.forEach(rotina => {
        if(rotina.id === idRotina){
            rotina.estado = 'Inativo'
        }
    })

    localStorage.setItem('Rotina', JSON.stringify(arrayRotinas));

    console.log(arrayRotinas)
    populaRotinasCadastradas('campoExibeMetasIndividualmente','rotinaTodos');

}

function ativarRotina(idRotina){
    arrayRotinas.forEach(rotina => {
        if(rotina.id === idRotina){
            rotina.estado = 'Ativo'
            localStorage.setItem('Rotina', JSON.stringify(arrayRotinas));
            populaRotinasCadastradas('campoExibeMetasIndividualmente')
            }
        }
    );
}

function resetaDados(idRotina){
    arrayRotinas.forEach(rotina => {
        if(rotina.id === idRotina){
            let confirma = confirm(`Deseja realmente resetar os dados da rotina ${rotina.nome.toUpperCase()} ?\nTodos os dados serão perdidos...`)
            if(confirma){
                rotina.concluidos.splice(0,rotina.concluidos.length)
                rotina.pendentes.splice(0,rotina.pendentes.length)
                localStorage.setItem('Rotina', JSON.stringify(arrayRotinas));

                populaRotinasCadastradas('campoExibeMetasIndividualmente')

                alert('Todas as informações de DATAS CONCLUÍDAS e PENDENTES foram APAGADAS')
            }
            else{
                alert('Os dados NÃO FORAM APAGADOS E PERMANECEM NO SISTEMA !')
            }
            
        }
    });
}