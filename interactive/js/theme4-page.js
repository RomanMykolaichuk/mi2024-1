const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const lessonId = new URLSearchParams(window.location.search).get('lesson') || 't4-l1';
const allowed = new Set(['t4-l1','t4-l2','t4-l3','t4-l4','t4-l5','t4-l6','t4-l7','t4-l8','t4-l9','t4-l11','t4-l12','t4-l13','t4-l14']);
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
      <div class="hero-meta"><span>${esc(lesson.typeLabel ?? lesson.type ?? 'заняття')}</span><span>≈ ${esc(lesson.roadmap?.duration?.min ?? 30)}–${esc(lesson.roadmap?.duration?.max ?? 45)} хв</span></div>
      <p class="eyebrow">ТЕМА 4 · ${esc(lesson.number)} · ANALYSIS</p>
      <h1>${esc(lesson.title)}</h1>
      <p class="hero__lead">${esc(lesson.lead)}</p>
    </header>
    <section class="section-shell"><div class="section-heading"><p class="eyebrow">LEARNING ROUTE</p><h2>Маршрут заняття</h2></div><div data-component="lesson-roadmap" data-source="${source}" data-select="roadmap"></div></section>
    ${lesson.scenario ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">ANALYTICAL SCENARIO</p><h2>${esc(lesson.scenario.title)}</h2><p>${esc(lesson.scenario.description)}</p></div>${lesson.scenario.facts?.length ? `<div class="metric-grid">${lesson.scenario.facts.map(item => `<div class="metric"><span class="metric__value metric__value--small">${esc(item.value)}</span><span class="metric__label">${esc(item.label)}</span></div>`).join('')}</div>` : ''}${lesson.scenario.question ? `<div class="analytics-callout"><strong>Питання:</strong> ${esc(lesson.scenario.question)}</div>` : ''}</section>` : ''}
    ${lesson.pipeline ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">ANALYTICS PIPELINE</p><h2>Місце методу в аналітичному процесі</h2></div><div data-component="analytics-pipeline" data-source="${source}" data-select="pipeline"></div></section>` : ''}
    ${(lesson.sections ?? []).map((section,index) => renderSection(section,index,source)).join('')}
    ${lesson.analystNote ? `<section class="analyst-note"><p class="eyebrow">WHY IT MATTERS FOR THE ANALYST</p><h2>${esc(lesson.analystNote.title)}</h2><p>${esc(lesson.analystNote.text)}</p></section>` : ''}
    ${lesson.quiz ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">SELF-CHECK</p><h2>${esc(lesson.quizTitle ?? 'Перевірте розуміння')}</h2></div><div data-component="knowledge-check" data-source="${source}" data-select="quiz"></div>${lesson.reflection ? `<div class="analytics-callout"><strong>Рефлексія:</strong> ${esc(lesson.reflection)}</div>` : ''}</section>` : ''}
    ${lesson.sources?.length ? `<section class="section-shell"><div class="section-heading"><p class="eyebrow">SOURCE MATERIALS</p><h2>Матеріали репозиторію</h2></div><div class="source-links">${lesson.sources.map(item => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join('')}</div>${lesson.sourceNote ? `<p class="microcopy">${esc(lesson.sourceNote)}</p>` : ''}</section>` : ''}
  `;
}

function renderSection(section,index,source) {
  const select = section.select ?? section.id;
  return `<section class="section-shell"><div class="section-heading"><p class="eyebrow">${esc(section.eyebrow ?? `${index + 1} · INTERACTIVE`)}</p><h2>${esc(section.title)}</h2>${section.description ? `<p>${esc(section.description)}</p>` : ''}</div><div data-component="${esc(section.component)}" data-source="${source}" data-select="${esc(select)}"></div>${section.after ? `<div class="analytics-callout">${esc(section.after)}</div>` : ''}</section>`;
}

function renderTrack(current) {
  const items = ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11','4.12','4.13','4.14'];
  return `<nav class="track-nav" aria-label="Тема 4">${items.map(number => number === '4.10' ? `<span class="track-gap" title="У репозиторії немає окремого джерела для 4.10">4.10</span>` : `<a class="${number === current ? 'is-current' : ''}" href="theme4.html?lesson=t4-l${number.split('.')[1]}">${number}</a>`).join('')}</nav>`;
}
