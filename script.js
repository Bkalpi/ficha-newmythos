function calcularModificador(valor) {
  return Math.floor((valor - 10) / 2);
}

function atualizarModificadores() {
  const atributos = document.querySelectorAll('input[data-atributo]');
  atributos.forEach(input => {
    const valor = parseInt(input.value) || 0;
    const modificador = calcularModificador(valor);
    const celulaModificador = input.closest('tr').querySelector('.modificador');
    if (celulaModificador) {
      celulaModificador.textContent = modificador;
    }
  });

  atualizarPVMaximo();
  atualizarSanMaxima();
  atualizarDefesa(); // <-- Chama a função de defesa sempre que os atributos forem atualizados
}

function atualizarPVMaximo() {
  const conInput = document.querySelector('input[data-atributo="CON"]');
  const con = parseInt(conInput?.value) || 0;
  const pvMax = 6 + (con * 2);
  const pvMaxInput = document.getElementById('pv-max');
  pvMaxInput.value = pvMax;
  atualizarBarra('pv-atual', 'pv-max', 'pv-bar');
}

function atualizarSanMaxima() {
  const sabInput = document.querySelector('input[data-atributo="SAB"]');
  const sab = parseInt(sabInput?.value) || 0;
  const sanMax = sab * 5;
  const sanMaxInput = document.getElementById('san-max');
  sanMaxInput.value = sanMax;
  atualizarBarra('san-atual', 'san-max', 'san-bar');
}

function atualizarBarra(idAtual, idMaximo, idBarra) {
  const atual = parseInt(document.getElementById(idAtual)?.value) || 0;
  const max = parseInt(document.getElementById(idMaximo)?.value) || 1;
  const barra = document.getElementById(idBarra);
  const porcentagem = Math.max(0, Math.min(100, (atual / max) * 100));
  barra.style.width = `${porcentagem}%`;
}

function atualizarDefesa() {
  const desInput = document.querySelector('input[data-atributo="DES"]');
  const modDesInput = document.getElementById('mod-des');
  const aleatorioInput = document.getElementById('defesa-bonus');
  const totalInput = document.getElementById('defesa-total');

  const des = parseInt(desInput?.value) || 0;
  const modDes = calcularModificador(des);
  const bonus = parseInt(aleatorioInput?.value) || 0;
  const total = 10 + modDes + bonus;

  if (modDesInput) {
    modDesInput.value = modDes;
    modDesInput.readOnly = true;
  }

  if (totalInput) {
    totalInput.value = total;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarModificadores();

  document.querySelectorAll('input[data-atributo]').forEach(input => {
    input.addEventListener('input', atualizarModificadores);
  });

  document.getElementById('pv-atual').addEventListener('input', () => {
    atualizarBarra('pv-atual', 'pv-max', 'pv-bar');
  });

  document.getElementById('san-atual').addEventListener('input', () => {
    atualizarBarra('san-atual', 'san-max', 'san-bar');
  });

  document.getElementById('defesa-bonus').addEventListener('input', atualizarDefesa);
});

// Parafernalha de Peícias do Waternuse
function atualizarPericias() {
  document.querySelectorAll('.linha-pericia').forEach(linha => {
    const atributoBase = linha.dataset.atributoBase;
    const inputAtributo = document.querySelector(`input[data-atributo="${atributoBase}"]`);
    const valor = parseInt(inputAtributo?.value) || 0;
    const modificador = Math.floor((valor - 10) / 2);

    const campoModAttr = linha.querySelector('.mod-atributo');
    const campoModExtra = linha.querySelector('.mod-extra');
    const campoTotal = linha.querySelector('.mod-pericia');

    if (campoModAttr) campoModAttr.value = modificador;

    const extra = parseInt(campoModExtra.value) || 0;
    campoTotal.value = modificador + extra;
  });
}

function atualizarPericias() {
  document.querySelectorAll('.linha-pericia').forEach(linha => {
    const atributoBase = linha.dataset.atributoBase;
    const inputAtributo = document.querySelector(`input[data-atributo="${atributoBase}"]`);
    const valor = parseInt(inputAtributo?.value) || 0;
    const modificador = Math.floor((valor - 10) / 2);

    const campoModAttr = linha.querySelector('.mod-atributo');
    const campoModExtra = linha.querySelector('.mod-extra');
    const campoTotal = linha.querySelector('.mod-pericia');

    if (campoModAttr) campoModAttr.value = modificador;

    const extra = parseInt(campoModExtra.value) || 0;
    campoTotal.value = modificador + extra;
  });
}

// 📢 Popup e Áudio
const popup = document.getElementById("resultado-dado");
const texto = document.getElementById("resultado-texto");

// 🔊 Áudio de rolagem de dado (link seguro de .mp3)
const audioDado = new Audio("https://files.catbox.moe/lvohmh.wav");

// 🧠 Função de rolar o dado
function rolarD20(modTotal) {
  // Garante que o áudio esteja no começo
  audioDado.currentTime = 0;
  audioDado.play().catch(e => {
    console.log("Audio play bloqueado, interação necessária");
  });

  // Depois do som, mostra o popup
  setTimeout(() => {
    const rolagem = Math.floor(Math.random() * 20) + 1;
    const resultadoFinal = rolagem + modTotal;

    texto.innerHTML = `D20: ${rolagem}<br>Modificador: ${modTotal >= 0 ? '+' : ''}${modTotal}<br><strong>Total: ${resultadoFinal}</strong>`;
    popup.style.display = "block";
  }, 500); // 0.5 segundo, dá tempo do som tocar
}

// 🚀 Inicialização dos eventos
document.addEventListener('DOMContentLoaded', () => {
  atualizarPericias();

  document.querySelectorAll('input[data-atributo]').forEach(input => {
    input.addEventListener('input', atualizarPericias);
  });

  document.querySelectorAll('.mod-extra').forEach(input => {
    input.addEventListener('input', atualizarPericias);
  });

  document.querySelectorAll('.aptidao-select').forEach(select => {
    select.addEventListener('change', atualizarPericias);
  });

// 🎲 Eventos de rolagem normal nas perícias
document.querySelectorAll('.linha-pericia .dado-botao').forEach(botao => {
  botao.addEventListener('click', (e) => {
    const linha = e.target.closest('.linha-pericia');
    const mod = parseInt(linha.querySelector('.mod-pericia')?.value) || 0;
    rolarD20(mod);
  });
});

// 🎯 Evento de rolagem no combate
document.getElementById('botao-combate').addEventListener('click', () => {
  const expressao = document.getElementById('entrada-combate').value;
  rolarExpressaoDados(expressao);
});
  });

// ❌ Função para fechar o popup
function fecharPopup() {
  document.getElementById("resultado-dado").style.display = "none";
}

function rolarExpressaoDados(expressao) {
  // 🔊 Toca o som do dado
  audioDado.currentTime = 0;
  audioDado.play().catch(e => console.log("Audio play bloqueado"));

  setTimeout(() => {
    const regex = /(\d*)d(3|4|6|8|10|12|20)|([+-]\d+(?!d))/g;
    let match;
    let detalhes = [];
    let total = 0;

    while ((match = regex.exec(expressao.replace(/\s+/g, ''))) !== null) {
      if (match[1] !== undefined) {
        const qtd = parseInt(match[1]) || 1; // Se não colocar número, assume 1
        const faces = parseInt(match[2]);

        if (qtd === 1) {
          // Se for só 1 dado, mostra o valor diretamente
          const resultado = Math.floor(Math.random() * faces) + 1;
          detalhes.push(`d${faces}: ${resultado}`);
          total += resultado;
        } else {
          // Se for mais de 1 dado, soma tudo e mostra o total dos dados
          let somaDados = 0;
          for (let i = 0; i < qtd; i++) {
            somaDados += Math.floor(Math.random() * faces) + 1;
          }
          detalhes.push(`${qtd}d${faces}: ${somaDados}`);
          total += somaDados;
        }
      } else if (match[3] !== undefined) {
        // Modificadores simples (+ ou - número)
        const mod = parseInt(match[3]);
        detalhes.push(`modificador: ${mod >= 0 ? '+' : ''}${mod}`);
        total += mod;
      }
    }

    if (detalhes.length === 0) {
      detalhes.push("Nenhuma rolagem válida detectada.");
    }

    texto.innerHTML = detalhes.join('<br>') + `<br><br><strong>Total: ${total}</strong>`;
    popup.style.display = "block";
  }, 500); // Espera o som antes de mostrar
}

// Botão de rolar d100
document.getElementById('botao-d100').addEventListener('click', () => {
  audioDado.currentTime = 0;
  audioDado.play().catch(e => {
    console.log("Audio play bloqueado, interação necessária");
  });

  setTimeout(() => {
    const rolagem = Math.floor(Math.random() * 100) + 1;

    const popup = document.getElementById("resultado-dado");
    const texto = document.getElementById("resultado-texto");
    texto.innerHTML = `<strong>d100:</strong> ${rolagem}`;
    popup.style.display = "block";
  }, 500); // 0.5 segundo depois do som
});

function criarInput(label, placeholder = "", className = "") {
  return `<div>
    <label>${label}</label>
    <input type="text" class="${className}" placeholder="${placeholder}">
  </div>`;
}

function adicionarArma(dados = {}) {
  const html = `
    <div class="inventario-item" data-tipo="arma">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        <div>
          <label>ARMA</label>
          <input type="text" class="campo-arma" value="${dados.arma || ''}">
        </div>
        <div>
          <label>DANO</label>
          <input type="text" class="campo-dano" value="${dados.dano || ''}">
        </div>
        <div>
          <label>CRÍTICO</label>
          <input type="text" class="campo-critico" value="${dados.critico || ''}">
        </div>
        <div>
          <label>MULTIP.</label>
          <input type="text" class="campo-multiplicador" value="${dados.multiplicador || ''}">
        </div>
      </div>
      <div class="inventario-linha">
        <div>
          <label>TIPO DE DANO</label>
          <select class="campo-tipo-dano">
            ${['Perfurante', 'Balístico', 'Cortante', 'Impacto', 'Fogo', 'Frio', 'Elétrico', 'Mental', 'Pútrido', 'Vazio']
              .map(op => `<option${op === dados.tipoDano ? ' selected' : ''}>${op}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>EFEITO</label>
          <input type="text" class="campo-efeito" value="${dados.efeito || ''}">
        </div>
        <div>
          <label>ALCANCE</label>
          <input type="text" class="campo-alcance" value="${dados.alcance || ''}">
        </div>
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function adicionarItem(dados = {}) {
  const html = `
    <div class="inventario-item" data-tipo="item">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        <div>
          <label>ITEM</label>
          <input type="text" class="campo-item" value="${dados.nome || ''}">
        </div>
        <div>
          <label>TIPO</label>
          <select class="campo-tipo-item">
            <option${dados.subtipo === 'Artefato' ? ' selected' : ''}>Artefato</option>
            <option${dados.subtipo === 'Miscelânea' ? ' selected' : ''}>Miscelânea</option>
          </select>
        </div>
        <div>
          <label>DESCRIÇÃO</label>
          <input type="text" class="campo-descricao-item" value="${dados.descricao || ''}">
        </div>
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function adicionarEquipamento(dados = {}) {
  const html = `
    <div class="inventario-item" data-tipo="equipamento">
      <button class="botao-remover" onclick="removerItem(this)">X</button>
      <div class="inventario-linha">
        <div>
          <label>EQUIPAMENTO</label>
          <input type="text" class="campo-equipamento" value="${dados.nome || ''}">
        </div>
        <div>
          <label>TIPO</label>
          <select class="campo-tipo-equipamento">
            <option${dados.subtipo === 'Ferramenta' ? ' selected' : ''}>Ferramenta</option>
            <option${dados.subtipo === 'Proteção' ? ' selected' : ''}>Proteção</option>
          </select>
        </div>
        <div>
          <label>DESCRIÇÃO</label>
          <input type="text" class="campo-descricao-equipamento" value="${dados.descricao || ''}">
        </div>
      </div>
    </div>`;
  document.getElementById("inventario-conteudo").insertAdjacentHTML("beforeend", html);
}

function removerItem(botao) {
  const item = botao.closest('.inventario-item');
  if (item) item.remove();
}

document.getElementById("inventario-add").addEventListener("click", function (e) {
  e.stopPropagation();
  const dropdown = this.parentElement;
  dropdown.classList.toggle("ativo");
});

document.addEventListener("click", function () {
  document.querySelectorAll(".dropdown").forEach(el => el.classList.remove("ativo"));
});

const botaoMais = document.getElementById('inventario-add');
  const dropdownConteudo = document.querySelector('.dropdown-conteudo');
  const inventarioBox = document.querySelector('.inventario-box');

  botaoMais.addEventListener('click', () => {
    const estaAtivo = dropdownConteudo.classList.toggle('ativo');
    inventarioBox.classList.toggle('dropdown-ativo', estaAtivo);
  });

  // Fechar o dropdown ao clicar numa opção
  const botoesDropdown = dropdownConteudo.querySelectorAll('button');
  botoesDropdown.forEach(btn => {
    btn.addEventListener('click', () => {
      dropdownConteudo.classList.remove('ativo');
      inventarioBox.classList.remove('dropdown-ativo');
    });
  });

  // Sessão Habilidades e Perícias 
function adicionarHabilidade() {
  const container = document.querySelector('.habilidades-container');
  const div = document.createElement('div');
  div.classList.add('habilidade');
  div.innerHTML = `
    <div class="linha-topo">
      <input type="text" placeholder="Nome da Habilidade">
      <button class="botao-remover" onclick="this.closest('.habilidade').remove()">x</button>
    </div>
    <input type="text" placeholder="Custo">
    <textarea placeholder="Descrição"></textarea>
  `;
  container.appendChild(div);
}

function adicionarAptidao() {
  const container = document.querySelector('.habilidades-container');
  const div = document.createElement('div');
  div.classList.add('aptidao');
  div.innerHTML = `
    <div class="linha-topo">
      <input type="text" placeholder="Nome da Aptidão">
      <button class="botao-remover" onclick="this.closest('.aptidao').remove()">x</button>
    </div>
    <select>
      <option value="1">Nível 1</option>
      <option value="2">Nível 2</option>
      <option value="3">Nível 3</option>
    </select>
    <textarea placeholder="Descrição"></textarea>
  `;
  container.appendChild(div);
}

document.addEventListener('DOMContentLoaded', () => {
  const botaoMaisHabilidades = document.getElementById('habilidades-add');
  const dropdownHabilidades = botaoMaisHabilidades?.parentElement;

  if (botaoMaisHabilidades && dropdownHabilidades) {
  const habilidadesBox = document.querySelector('.habilidades-box');

  botaoMaisHabilidades.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownHabilidades.classList.toggle('ativo');

    // Adiciona ou remove a classe que expande a caixa
    if (dropdownHabilidades.classList.contains('ativo')) {
      habilidadesBox.classList.add('dropdown-ativo');
    } else {
      habilidadesBox.classList.remove('dropdown-ativo');
    }
  });

  // Fecha o dropdown se clicar fora
  document.addEventListener('click', () => {
    if (dropdownHabilidades.classList.contains('ativo')) {
      dropdownHabilidades.classList.remove('ativo');
      habilidadesBox.classList.remove('dropdown-ativo');
    }
  });
}
  });

function salvarHabilidadesEAptidoes() {
  const habilidades = [];

  document.querySelectorAll('.habilidades-container > div').forEach(el => {
    if (el.classList.contains('habilidade')) {
      habilidades.push({
        tipo: 'habilidade',
        nome: el.querySelector('input[type="text"]').value,
        custo: el.querySelectorAll('input[type="text"]')[1].value,
        descricao: el.querySelector('textarea').value,
      });
    } else if (el.classList.contains('aptidao')) {
      habilidades.push({
        tipo: 'aptidao',
        nome: el.querySelector('input[type="text"]').value,
        nivel: el.querySelector('select').value,
        descricao: el.querySelector('textarea').value,
      });
    }
  });

  localStorage.setItem('habilidadesEAptidoes', JSON.stringify(habilidades));
}

function salvarInventario() {
  const inventario = [];

  document.querySelectorAll('.inventario-item').forEach(item => {
    const tipo = item.dataset.tipo;

    if (tipo === 'arma') {
      inventario.push({
        tipo,
        arma: item.querySelector('.campo-arma').value,
        dano: item.querySelector('.campo-dano').value,
        critico: item.querySelector('.campo-critico').value,
        multiplicador: item.querySelector('.campo-multiplicador').value,
        tipoDano: item.querySelector('.campo-tipo-dano').value,
        efeito: item.querySelector('.campo-efeito').value,
        alcance: item.querySelector('.campo-alcance').value,
      });
    } else if (tipo === 'item') {
      inventario.push({
        tipo,
        nome: item.querySelector('.campo-item').value,
        subtipo: item.querySelector('.campo-tipo-item').value,
        descricao: item.querySelector('.campo-descricao-item').value,
      });
    } else if (tipo === 'equipamento') {
      inventario.push({
        tipo,
        nome: item.querySelector('.campo-equipamento').value,
        subtipo: item.querySelector('.campo-tipo-equipamento').value,
        descricao: item.querySelector('.campo-descricao-equipamento').value,
      });
    }
  });

  localStorage.setItem('inventario', JSON.stringify(inventario));
}

function salvarPericias() {
  const pericias = [];

  document.querySelectorAll('.linha-pericia').forEach(linha => {
    const aptidao = linha.querySelector('.aptidao-select').value;
    const modExtra = linha.querySelector('.mod-extra').value;
    const modAtributo = linha.querySelector('.mod-atributo').value;
    const modPericia = linha.querySelector('.mod-pericia').value;

    pericias.push({ aptidao, modExtra, modAtributo, modPericia });
  });

  localStorage.setItem('pericias', JSON.stringify(pericias));
}

function salvarFicha() {
  const dados = {};

  // Campos fixos com ID
  document.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
    dados[el.id] = el.value;
  });
  
  // 💾 Salvar tudo no localStorage
  localStorage.setItem('fichaRPG', JSON.stringify(dados));
  salvarPericias();
  salvarInventario();
  salvarHabilidadesEAptidoes();
  
  alert('Ficha salva com sucesso!');
}

 // Carregamento
function carregarFicha() {
  const dados = JSON.parse(localStorage.getItem('fichaRPG'));
  if (dados) {
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.id && dados[el.id] !== undefined) {
        el.value = dados[el.id];
      }
    });
    
    atualizarModificadores();
    
    // Carrega perícias separadamente
    const periciasSalvas = JSON.parse(localStorage.getItem('pericias') || '[]');
    const linhas = document.querySelectorAll('.linha-pericia');

    periciasSalvas.forEach((pericia, index) => {
      const linha = linhas[index];
      if (!linha) return;

      linha.querySelector('.aptidao-select').value = pericia.aptidao;
      linha.querySelector('.mod-extra').value = pericia.modExtra;
      linha.querySelector('.mod-atributo').value = pericia.modAtributo;   // ADICIONADO
      linha.querySelector('.mod-pericia').value = pericia.modPericia;     // ADICIONADO
    });
    
    // Carrega Inventário
const inventarioSalvo = JSON.parse(localStorage.getItem('inventario') || '[]');
const containerInventario = document.querySelector('.inventario-conteudo');
containerInventario.innerHTML = ''; // limpa antes de carregar

inventarioSalvo.forEach(item => {
  if (item.tipo === 'arma') {
    adicionarArma(item);
  } else if (item.tipo === 'item') {
    adicionarItem(item);
  } else if (item.tipo === 'equipamento') {
    adicionarEquipamento(item);
  }
});
    
    // Carrega Habilidades e Aptidões
carregarHabilidadesEAptidoes();
    
    alert('Ficha carregada!');
  } else {
    alert('Nenhuma ficha salva encontrada.');
  }
}

function limparFicha() {
  localStorage.removeItem('fichaRPG');
  alert('Ficha apagada!');
}

function carregarHabilidadesEAptidoes() {
  const dados = JSON.parse(localStorage.getItem('habilidadesEAptidoes') || '[]');
  const container = document.querySelector('.habilidades-container');

  container.innerHTML = ''; // limpa antes de carregar

  dados.forEach(item => {
    if (item.tipo === 'habilidade') {
      const div = document.createElement('div');
      div.classList.add('habilidade');
      div.innerHTML = `
        <div class="linha-topo">
          <input type="text" placeholder="Nome da Habilidade" value="${item.nome}">
          <button class="botao-remover" onclick="this.closest('.habilidade').remove()">x</button>
        </div>
        <input type="text" placeholder="Custo" value="${item.custo}">
        <textarea placeholder="Descrição">${item.descricao}</textarea>
      `;
      container.appendChild(div);
    } else if (item.tipo === 'aptidao') {
      const div = document.createElement('div');
      div.classList.add('aptidao');
      div.innerHTML = `
        <div class="linha-topo">
          <input type="text" placeholder="Nome da Aptidão" value="${item.nome}">
          <button class="botao-remover" onclick="this.closest('.aptidao').remove()">x</button>
        </div>
        <select>
          <option value="1" ${item.nivel === "1" ? "selected" : ""}>Nível 1</option>
          <option value="2" ${item.nivel === "2" ? "selected" : ""}>Nível 2</option>
          <option value="3" ${item.nivel === "3" ? "selected" : ""}>Nível 3</option>
        </select>
        <textarea placeholder="Descrição">${item.descricao}</textarea>
      `;
      container.appendChild(div);
    }
  });
}