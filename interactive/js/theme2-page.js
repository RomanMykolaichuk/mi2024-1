const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const lessonId=new URLSearchParams(window.location.search).get('lesson')||'t2-l1';
const allowed=new Set(['t2-l1','t2-l2','t2-l3']);
const root=document.querySelector('[data-role="lesson-root"]');

if(!allowed.has(lessonId)){
  root.innerHTML=`<div class="component-error" role="alert">Невідоме заняття Theme 2. <a href="../index.html">Повернутися на головну</a>.</div>`;
}else{
  try{
    const source=`../data/lessons/${lessonId}.json`;
    const response=await fetch(source);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const lesson=await response.json();
    document.title=`${lesson.number} · ${lesson.title}`;
    root.innerHTML=renderPage(lesson,source);
    await import('./app.js');
  }catch(error){
    console.error('[MI2024] Theme 2 shell',error);
    root.innerHTML=`<div class="component-error" role="alert">Не вдалося завантажити заняття. Перевірте JSON та browser console.</div>`;
  }
}

function renderPage(lesson,source){
  return `
    <nav class="breadcrumb" aria-label="Навігація"><a href="../index.html">MI2024 Interactive</a><span>→</span><span>Тема 2 · ${esc(lesson.number)}</span></nav>
    ${renderTrack(lesson.number)}
    <header class="hero hero--compact">
      <div class="hero-meta"><span>${esc(lesson.typeLabel??lesson.type??'заняття')}</span><span>≈ ${esc(lesson.roadmap?.duration?.min??30)}–${esc(lesson.roadmap?.duration?.max??45)} хв</span>${lesson.titleConfidence?`<span>${esc(lesson.titleConfidence)}</span>`:''}</div>
      <p class="eyebrow">ТЕМА 2 · ${esc(lesson.number)} · DATA COLLECTION</p>
      <h1>${esc(lesson.title)}</h1>
      <p class="hero__lead">${esc(lesson.lead)}</p>
    </header>
    <section class="section-shell"><div class="section-heading"><p class="eyebrow">LEARNING ROUTE</p><h2>Маршрут заняття</h2></div><div data-component="lesson-roadmap" data-source="${source}" data-select="roadmap"></div></section>
    ${lesson.scenario?`<section class="section-shell"><div class="section-heading"><p class="eyebrow">ANALYTICAL SCENARIO</p><h2>${esc(lesson.scenario.title)}</h2><p>${esc(lesson.scenario.description)}</p></div>${lesson.scenario.facts?.length?`<div class="metric-grid">${lesson.scenario.facts.map(item=>`<div class="metric"><span class="metric__value metric__value--small">${esc(item.value)}</span><span class="metric__label">${esc(item.label)}</span></div>`).join('')}</div>`:''}${lesson.scenario.question?`<div class="analytics-callout"><strong>Питання:</strong> ${esc(lesson.scenario.question)}</div>`:''}</section>`:''}
    ${lesson.pipeline?`<section class="section-shell"><div class="section-heading"><p class="eyebrow">IAZ PIPELINE</p><h2>Місце збору даних в аналітичному циклі</h2></div><div data-component="analytics-pipeline" data-source="${source}" data-select="pipeline"></div></section>`:''}
    ${(lesson.sections??[]).map((section,index)=>renderSection(section,index,source)).join('')}
    ${lesson.analystNote?`<section class="analyst-note"><p class="eyebrow">WHY IT MATTERS FOR THE ANALYST</p><h2>${esc(lesson.analystNote.title)}</h2><p>${esc(lesson.analystNote.text)}</p></section>`:''}
    ${lesson.quiz?`<section class="section-shell"><div class="section-heading"><p class="eyebrow">SELF-CHECK</p><h2>${esc(lesson.quizTitle??'Перевірте розуміння')}</h2></div><div data-component="knowledge-check" data-source="${source}" data-select="quiz"></div>${lesson.reflection?`<div class="analytics-callout"><strong>Рефлексія:</strong> ${esc(lesson.reflection)}</div>`:''}</section>`:''}
    ${lesson.sources?.length?`<section class="section-shell"><div class="section-heading"><p class="eyebrow">SOURCE MATERIALS</p><h2>Матеріали репозиторію</h2></div><div class="source-links">${lesson.sources.map(item=>`<a href="${esc(item.href)}">${esc(item.label)}</a>`).join('')}</div>${lesson.sourceNote?`<p class="microcopy">${esc(lesson.sourceNote)}</p>`:''}</section>`:''}
  `;
}

function renderSection(section,index,source){
  const select=section.select??section.id;
  return `<section class="section-shell"><div class="section-heading"><p class="eyebrow">${esc(section.eyebrow??`${index+1} · INTERACTIVE`)}</p><h2>${esc(section.title)}</h2>${section.description?`<p>${esc(section.description)}</p>`:''}</div><div data-component="${esc(section.component)}" data-source="${source}" data-select="${esc(select)}"></div>${section.after?`<div class="analytics-callout">${esc(section.after)}</div>`:''}</section>`;
}

function renderTrack(current){
  const items=[
    {number:'2.1',href:'theme2.html?lesson=t2-l1'},
    {number:'2.2',href:'theme2.html?lesson=t2-l2'},
    {number:'2.3',href:'theme2.html?lesson=t2-l3'},
    {number:'2.4',href:'t2-l4.html'},
    {number:'2.5',href:'t2-l5.html'}
  ];
  return `<nav class="track-nav" aria-label="Тема 2">${items.map(item=>`<a class="${item.number===current?'is-current':''}" href="${item.href}">${item.number}</a>`).join('')}</nav>`;
}
