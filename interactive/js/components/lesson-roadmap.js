const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const blocks = config.blocks ?? [];
  const outcomes = config.outcomes ?? [];
  const min = Number(config.duration?.min ?? 30);
  const max = Number(config.duration?.max ?? 45);
  const planned = blocks.reduce((sum, block) => sum + Number(block.minutes ?? 0), 0);

  element.innerHTML = `
    <div class="lesson-roadmap__summary">
      <div>
        <p class="eyebrow">TIMEBOX</p>
        <strong class="lesson-roadmap__duration">≈ ${min}–${max} хв</strong>
        <p>${esc(config.note ?? 'Орієнтовний активний час проходження без додаткового notebook.')}</p>
      </div>
      <div class="lesson-roadmap__planned">
        <span>План</span>
        <strong>${planned || min} хв</strong>
      </div>
    </div>
    ${outcomes.length ? `
      <div class="lesson-outcomes">
        <p class="eyebrow">ПІСЛЯ ЗАНЯТТЯ ВИ ЗМОЖЕТЕ</p>
        <ul>${outcomes.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>` : ''}
    <div class="lesson-roadmap__blocks">
      ${blocks.map((block, index) => `
        <article class="lesson-roadmap__block">
          <div class="lesson-roadmap__index">${index + 1}</div>
          <div>
            <div class="lesson-roadmap__meta"><span>${esc(block.label ?? 'Блок')}</span><strong>${esc(block.minutes)} хв</strong></div>
            <h3>${esc(block.title)}</h3>
            <p>${esc(block.description)}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}
