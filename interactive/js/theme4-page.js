const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const lessonId = new URLSearchParams(window.location.search).get('lesson') || 't4-l1';
const allowed = new Set(['t4-l1','t4-l2','t4-l3','t4-l4','t4-l5','t4-l6','t4-l7','t4-l8','t4-l9','t4-l10','t4-l11','t4-l12','t4-l13','t4-l14']);
const root = document.querySelector('[data-role="lesson-root"]');

if (!allowed.has(lessonId)) {
  root.innerHTML = `<div class="component-error" role="alert">Невідоме заняття Theme 4. <a href="../index.html">Повернутися на головну</a>.</div>`;
} else {
  try {
    const source = `../data/lessons/${lessonId}.json`;
    const response = await fetch(source);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const lesson = await response.json();
    document.title = `${lesson.number} · ${lesson.title}`;
    root.innerHTML = renderPage(lesson, source);
    setupInfographicViewer(lesson.infographics ?? []);
    await import('./app.js');
  } catch (error) {
    console.error('[MI2024] Theme 4 shell', error);
    root.innerHTML = `<div class="component-error" role="alert">Не вдалося завантажити заняття. Перевірте JSON та browser console.</div>`;
  }
}

function renderPage(lesson, source) {
  return `
    <nav class="breadcrumb" aria-label="Навігація"><a href="../index.html">MI2024 Interactive</a><span>→</span><span>Тема 4 · ${esc(lesson.number)}</span></nav>
    ${renderTrack(lesson.number)}
    <header class="hero hero--compact">
      <div class="hero-meta"><span>${esc(lesson.typeLabel ?? lesson.type ?? 'заняття')}</span><span>≈ ${esc(lesson.roadmap?.duration?.min ?? 30)}–${esc(lesson.roadmap?.duration?.max ?? 45)} хв</span>${lesson.titleConfidence ? `<span>${esc(lesson.titleConfidence)}</span>` : ''}</div>
      <p class="eyebrow">ТЕМА 4 · ${esc(lesson.number)} · ANALYSIS</p>
      <h1>${esc(lesson.title)}</h1>
      <p class="hero__lead">${esc(lesson.lead)}</p>
    </header>
    <section class="section-shell"><div class="section-heading"><p class="eyebrow">LEARNING ROUTE</p><h2>Маршрут заняття</h2></div><div data-component="lesson-roadmap" data-source="${source}" data-select="roadmap"></div></section>
    ${lesson.infographics?.length ? renderInfographics(lesson) : ''}
    ${lesson.scenario ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">ANALYTICAL SCENARIO</p><h2>${esc(lesson.scenario.title)}</h2><p>${esc(lesson.scenario.description)}</p></div>${lesson.scenario.facts?.length ? `<div class="metric-grid">${lesson.scenario.facts.map(item => `<div class="metric"><span class="metric__value metric__value--small">${esc(item.value)}</span><span class="metric__label">${esc(item.label)}</span></div>`).join('')}</div>` : ''}${lesson.scenario.question ? `<div class="analytics-callout"><strong>Питання:</strong> ${esc(lesson.scenario.question)}</div>` : ''}</section>` : ''}
    ${lesson.pipeline ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">ANALYTICS PIPELINE</p><h2>Місце методу в аналітичному процесі</h2></div><div data-component="analytics-pipeline" data-source="${source}" data-select="pipeline"></div></section>` : ''}
    ${(lesson.sections ?? []).map((section,index) => renderSection(section,index,source)).join('')}
    ${lesson.analystNote ? `<section class="analyst-note"><p class="eyebrow">WHY IT MATTERS FOR THE ANALYST</p><h2>${esc(lesson.analystNote.title)}</h2><p>${esc(lesson.analystNote.text)}</p></section>` : ''}
    ${lesson.quiz ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">SELF-CHECK</p><h2>${esc(lesson.quizTitle ?? 'Перевірте розуміння')}</h2></div><div data-component="knowledge-check" data-source="${source}" data-select="quiz"></div>${lesson.reflection ? `<div class="analytics-callout"><strong>Рефлексія:</strong> ${esc(lesson.reflection)}</div>` : ''}</section>` : ''}
    ${lesson.sources?.length ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">SOURCE MATERIALS</p><h2>Матеріали репозиторію</h2></div><div class="source-links">${lesson.sources.map(item => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join('')}</div>${lesson.sourceNote ? `<p class="microcopy">${esc(lesson.sourceNote)}</p>` : ''}</section>` : ''}
  `;
}

function renderInfographics(lesson) {
  const first = lesson.infographics[0];
  const navigation = lesson.infographics.map((item,index) => `
    <button class="infographic-nav__item${index === 0 ? ' is-active' : ''}" type="button" data-infographic-index="${index}" aria-label="Показати рисунок ${esc(item.number)}: ${esc(item.title)}">
      <span>${esc(item.number)}</span><small>${esc(item.title)}</small>
    </button>
  `).join('');

  return `<section class="section-shell infographic-lecture" id="visual-lecture">
    <div class="section-heading"><p class="eyebrow">VISUAL LECTURE · 10 INFOGRAPHICS</p><h2>${esc(lesson.infographicsTitle ?? 'Візуальна лекція')}</h2>${lesson.infographicsLead ? `<p>${esc(lesson.infographicsLead)}</p>` : ''}</div>
    <div class="infographic-viewer" data-infographic-viewer tabindex="0">
      <div class="infographic-viewer__heading">
        <span class="infographic-viewer__number" data-infographic-number>${esc(first.number)}</span>
        <div><h3 data-infographic-title>${esc(first.title)}</h3><p data-infographic-description>${esc(first.description ?? '')}</p></div>
      </div>
      <a class="infographic-viewer__image" data-infographic-link href="${esc(first.src)}" target="_blank" rel="noopener" aria-label="Відкрити рисунок у повному розмірі">
        <img data-infographic-image src="${esc(first.src)}" alt="${esc(first.title)}">
      </a>
      <div class="infographic-viewer__controls">
        <button type="button" data-infographic-prev>← Попередній</button>
        <span data-infographic-counter>1 / ${lesson.infographics.length}</span>
        <button type="button" data-infographic-next>Наступний →</button>
        <a data-infographic-open href="${esc(first.src)}" target="_blank" rel="noopener">Повний розмір ↗</a>
      </div>
      <nav class="infographic-nav" aria-label="Рисунки лекції">${navigation}</nav>
    </div>
  </section>`;
}

function setupInfographicViewer(items) {
  const viewer = root.querySelector('[data-infographic-viewer]');
  if (!viewer || !items.length) return;

  const image = viewer.querySelector('[data-infographic-image]');
  const link = viewer.querySelector('[data-infographic-link]');
  const open = viewer.querySelector('[data-infographic-open]');
  const number = viewer.querySelector('[data-infographic-number]');
  const title = viewer.querySelector('[data-infographic-title]');
  const description = viewer.querySelector('[data-infographic-description]');
  const counter = viewer.querySelector('[data-infographic-counter]');
  const prev = viewer.querySelector('[data-infographic-prev]');
  const next = viewer.querySelector('[data-infographic-next]');
  const buttons = [...viewer.querySelectorAll('[data-infographic-index]')];
  let current = 0;

  const hashMatch = window.location.hash.match(/^#infographic-(\d{1,2})$/);
  if (hashMatch) {
    const requested = items.findIndex(item => String(item.number) === hashMatch[1].padStart(2,'0'));
    if (requested >= 0) current = requested;
  }

  const render = (updateHash = false) => {
    const item = items[current];
    number.textContent = item.number ?? String(current + 1).padStart(2,'0');
    title.textContent = item.title ?? '';
    description.textContent = item.description ?? '';
    image.src = item.src;
    image.alt = item.title ?? `Інфографіка ${current + 1}`;
    link.href = item.src;
    open.href = item.src;
    counter.textContent = `${current + 1} / ${items.length}`;
    prev.disabled = current === 0;
    next.disabled = current === items.length - 1;
    buttons.forEach((button,index) => {
      button.classList.toggle('is-active', index === current);
      button.setAttribute('aria-current', index === current ? 'true' : 'false');
    });
    if (updateHash) history.replaceState(null,'',`#infographic-${item.number ?? current + 1}`);
  };

  const select = index => {
    current = Math.max(0, Math.min(items.length - 1, index));
    render(true);
    image.focus?.();
  };

  buttons.forEach((button,index) => button.addEventListener('click', () => select(index)));
  prev.addEventListener('click', () => select(current - 1));
  next.addEventListener('click', () => select(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && current > 0) { event.preventDefault(); select(current - 1); }
    if (event.key === 'ArrowRight' && current < items.length - 1) { event.preventDefault(); select(current + 1); }
  });

  render(false);
}

function renderSection(section,index,source) {
  const select = section.select ?? section.id;
  return `<section class="section-shell"><div class="section-heading"><p class="eyebrow">${esc(section.eyebrow ?? `${index + 1} · INTERACTIVE`)}</p><h2>${esc(section.title)}</h2>${section.description ? `<p>${esc(section.description)}</p>` : ''}</div><div data-component="${esc(section.component)}" data-source="${source}" data-select="${esc(select)}"></div>${section.after ? `<div class="analytics-callout">${esc(section.after)}</div>` : ''}</section>`;
}

function renderTrack(current) {
  const items = ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12','4.13','4.14'];
  return `<nav class="track-nav" aria-label="Тема 4">${items.map(number => `<a class="${number === current ? 'is-current' : ''}" href="theme4.html?lesson=t4-l${number.split('.')[1]}">${number}</a>`).join('')}</nav>`;
}
