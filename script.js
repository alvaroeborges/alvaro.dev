/* =========================================================
   ÁLVARO BORGES — LANDING PAGE
   script.js — navegação, animações e interações da página
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initTypewriter();
  initRevealOnScroll();
  initTerminalReveal();
  initStackBars();
  initActiveTab();
  initTiltEffect();
  initHeroParallax();
  initHeaderScroll();
  initThemeToggle();
  initCommandPalette();
  initLiquidGlass();
});

// Preferência do usuário por menos animação (acessibilidade)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Atualiza o ano no rodapé automaticamente.
 */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * Efeito de máquina de escrever no herói: digita e apaga
 * uma lista de frases em loop.
 */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const frases = [
    'interfaces rápidas.',
    'experiências fluidas.',
    'sites que convertem.',
    'código limpo e organizado.'
  ];

  // Se o usuário prefere menos movimento, mostra a primeira frase parada.
  if (prefersReducedMotion) {
    el.textContent = frases[0];
    return;
  }

  let indiceFrase = 0;
  let indiceLetra = 0;
  let apagando = false;

  function digitar() {
    const fraseAtual = frases[indiceFrase];

    if (!apagando) {
      indiceLetra++;
      el.textContent = fraseAtual.slice(0, indiceLetra);

      if (indiceLetra === fraseAtual.length) {
        apagando = true;
        setTimeout(digitar, 1800); // pausa antes de apagar
        return;
      }
    } else {
      indiceLetra--;
      el.textContent = fraseAtual.slice(0, indiceLetra);

      if (indiceLetra === 0) {
        apagando = false;
        indiceFrase = (indiceFrase + 1) % frases.length;
      }
    }

    setTimeout(digitar, apagando ? 35 : 65);
  }

  digitar();
}

/**
 * Revela elementos com a classe .reveal conforme entram na tela.
 */
function initRevealOnScroll() {
  const itens = document.querySelectorAll('.reveal');
  if (!itens.length) return;

  if (prefersReducedMotion) {
    itens.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, indice) => {
        if (entrada.isIntersecting) {
          // pequeno atraso escalonado para dar sensação de cascata
          setTimeout(() => entrada.target.classList.add('is-visible'), indice * 60);
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  itens.forEach((item) => observer.observe(item));
}

/**
 * Faz as linhas do terminal (seção "sobre") aparecerem
 * em cascata quando o bloco entra na tela.
 */
function initTerminalReveal() {
  const corposDoTerminal = document.querySelectorAll('.terminal__body');
  if (!corposDoTerminal.length) return;

  if (prefersReducedMotion) {
    corposDoTerminal.forEach((corpo) => corpo.classList.add('is-typed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-typed');
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  corposDoTerminal.forEach((corpo) => observer.observe(corpo));
}

/**
 * Anima as barras de proficiência da seção "stack" (package.json)
 * até a largura definida em data-level quando entram na tela.
 */
function initStackBars() {
  const linhas = document.querySelectorAll('.stack__row');
  if (!linhas.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const linha = entrada.target;
          const nivel = linha.getAttribute('data-level') || '0';
          const preenchimento = linha.querySelector('.stack__fill');
          if (preenchimento) {
            requestAnimationFrame(() => {
              preenchimento.style.width = nivel + '%';
            });
          }
          observer.unobserve(linha);
        }
      });
    },
    { threshold: 0.4 }
  );

  linhas.forEach((linha) => observer.observe(linha));
}

/**
 * Marca a aba correspondente à seção visível como ativa,
 * imitando o comportamento de abas de um editor de código.
 */
function initActiveTab() {
  const abas = document.querySelectorAll('.tab');
  if (!abas.length) return;

  const idsComAba = Array.from(abas).map((aba) => aba.dataset.tab);
  const secoes = Array.from(document.querySelectorAll('main > section[id]')).filter((secao) =>
    idsComAba.includes(secao.id)
  );
  if (!secoes.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const idAtual = entrada.target.id;
          abas.forEach((aba) => aba.classList.toggle('is-active', aba.dataset.tab === idAtual));
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  secoes.forEach((secao) => observer.observe(secao));
}

/**
 * Inclinação 3D nos cards (efeito "tilt") ao passar o mouse,
 * usada nos cards de serviços.
 */
function initTiltEffect() {
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (evento) => {
      const retangulo = card.getBoundingClientRect();
      const x = evento.clientX - retangulo.left;
      const y = evento.clientY - retangulo.top;
      const rotacaoX = ((y / retangulo.height) - 0.3) * -10;
      const rotacaoY = ((x / retangulo.width) - 0.3) * 10;
      card.style.transform = `perspective(700px) rotateX(${rotacaoX}deg) rotateY(${rotacaoY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Move o cubo 3D do herói junto com o mouse, criando
 * sensação de profundidade (parallax).
 */
function initHeroParallax() {
  if (prefersReducedMotion) return;

  const cena = document.querySelector('.hero__scene');
  const palco = document.getElementById('cubeStage');
  if (!cena || !palco) return;

  cena.addEventListener('mousemove', (evento) => {
    const retangulo = cena.getBoundingClientRect();
    const relX = (evento.clientX - retangulo.left) / retangulo.width - 0.3;
    const relY = (evento.clientY - retangulo.top) / retangulo.height - 0.3;
    palco.style.transform = `rotateY(${relX * 10}deg) rotateX(${relY * -10}deg)`;
  });

  cena.addEventListener('mouseleave', () => {
    palco.style.transform = '';
  });
}

/**
 * Dá profundidade à barra de abas (header) quando a página
 * é rolada, aproximando a sensação de um app premium.
 */
function initHeaderScroll() {
  const header = document.getElementById('tabbar');
  if (!header) return;

  function atualizar() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  atualizar();
  window.addEventListener('scroll', atualizar, { passive: true });
}

/**
 * Alterna entre tema escuro (padrão) e tema claro, guardando
 * a preferência do visitante no localStorage.
 */
function initThemeToggle() {
  const botao = document.getElementById('themeToggle');
  if (!botao) return;

  const raiz = document.documentElement;

  let temaSalvo = null;
  try {
    temaSalvo = localStorage.getItem('tema');
  } catch (erro) {
    // localStorage indisponível (modo privado, etc.) — segue com o padrão.
  }

  if (temaSalvo === 'light') {
    raiz.setAttribute('data-theme', 'light');
    botao.setAttribute('aria-pressed', 'true');
    botao.setAttribute('aria-label', 'Alternar para tema escuro');
  }

  botao.addEventListener('click', () => {
    const claroAtivo = raiz.getAttribute('data-theme') === 'light';
    const proximoTema = claroAtivo ? 'dark' : 'light';

    if (proximoTema === 'light') {
      raiz.setAttribute('data-theme', 'light');
    } else {
      raiz.removeAttribute('data-theme');
    }

    botao.setAttribute('aria-pressed', String(proximoTema === 'light'));
    botao.setAttribute('aria-label', proximoTema === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro');

    try {
      localStorage.setItem('tema', proximoTema);
    } catch (erro) {
      // Sem persistência disponível — a escolha vale só para esta sessão.
    }
  });
}

/**
 * Command palette (Ctrl/Cmd+K): navegação rápida entre seções,
 * usada também como menu principal no mobile.
 */
function initCommandPalette() {
  const cmdk = document.getElementById('cmdk');
  const input = document.getElementById('cmdkInput');
  const lista = document.getElementById('cmdkList');
  const botaoMenu = document.getElementById('menuBtn');
  if (!cmdk || !input || !lista || !botaoMenu) return;

  const itens = Array.from(cmdk.querySelectorAll('.cmdk__item'));

  function abrir() {
    cmdk.hidden = false;
    document.body.classList.add('cmdk-open');
    botaoMenu.setAttribute('aria-expanded', 'true');
    input.value = '';
    filtrar('');
    setTimeout(() => input.focus(), 10);
  }

  function fechar() {
    cmdk.hidden = true;
    document.body.classList.remove('cmdk-open');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.focus();
  }

  function filtrar(termo) {
    const termoNormalizado = termo.trim().toLowerCase();
    let algumVisivel = false;

    itens.forEach((item) => {
      const visivel = item.textContent.toLowerCase().includes(termoNormalizado);
      item.closest('li').style.display = visivel ? '' : 'none';
      if (visivel) algumVisivel = true;
    });

    const vazioExistente = lista.querySelector('.cmdk__empty');
    if (!algumVisivel && !vazioExistente) {
      const vazio = document.createElement('p');
      vazio.className = 'cmdk__empty';
      vazio.textContent = 'Nenhuma seção encontrada.';
      lista.appendChild(vazio);
    } else if (algumVisivel && vazioExistente) {
      vazioExistente.remove();
    }
  }

  botaoMenu.addEventListener('click', () => {
    if (cmdk.hidden) abrir();
    else fechar();
  });

  cmdk.querySelectorAll('[data-cmdk-close]').forEach((elemento) => {
    elemento.addEventListener('click', fechar);
  });

  itens.forEach((item) => {
    item.addEventListener('click', () => {
      const alvo = item.getAttribute('data-target');
      fechar();
      if (!alvo) return;
      const secao = document.querySelector(alvo);
      if (secao) secao.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  input.addEventListener('input', () => filtrar(input.value));

  document.addEventListener('keydown', (evento) => {
    const atalhoAbrir = (evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k';
    if (atalhoAbrir) {
      evento.preventDefault();
      if (cmdk.hidden) abrir();
      else fechar();
      return;
    }
    if (evento.key === 'Escape' && !cmdk.hidden) fechar();
  });
}

/**
 * Liquid glass: ativa a refração (filtro SVG #liquid-glass) apenas
 * no Chromium desktop — Safari/Firefox não aplicam url() no
 * backdrop-filter, e no celular o custo de GPU não compensa.
 * Também faz o reflexo especular (.glass::after) seguir o ponteiro.
 */
function initLiquidGlass() {
  const marcas = navigator.userAgentData && navigator.userAgentData.brands;
  const ehChromium = Array.isArray(marcas) && marcas.some((m) => /Chromium/i.test(m.brand));
  const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const menosTransparencia = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;

  if (ehChromium && ponteiroFino && !menosTransparencia) {
    document.documentElement.classList.add('lg-refract');
  }

  if (!ponteiroFino) return;

  document.querySelectorAll('.glass').forEach((elemento) => {
    elemento.addEventListener('pointermove', (evento) => {
      const caixa = elemento.getBoundingClientRect();
      elemento.style.setProperty('--mx', `${evento.clientX - caixa.left}px`);
      elemento.style.setProperty('--my', `${evento.clientY - caixa.top}px`);
    });
    elemento.addEventListener('pointerleave', () => {
      elemento.style.removeProperty('--mx');
      elemento.style.removeProperty('--my');
    });
  });
}
