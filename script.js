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