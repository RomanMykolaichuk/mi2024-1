const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const reports = config.reports ?? [];
  if (!reports.length) return;
  let current = 0;
  element.innerHTML = `<div class="text-lab"><div class="text-report-tabs" data-role="tabs"></div><div class="text-lab-layout"><article class="text-document"><p class="eyebrow">SYNTHETIC REPORT</p><h3 data-role="title"></h3><p data-role="text"></p></article><div class="text-analysis-panel"><div class="prep-tabs"><button class="prep-tab is-active" data-mode="extract">Extract</button><button class="prep-tab" data-mode="classify">Classify</button><button class="prep-tab" data-mode="summarize">Generate summary</button></div><div data-role="analysis"></div></div></div></div>`;
  const tabs = element.querySelector('[data-role="tabs"]');
  const title = element.querySelector('[data-role="title"]');
  const text = element.querySelector('[data-role="text"]');
  const analysis = element.querySelector('[data-role="analysis"]');
  const modeButtons = [...element.querySelectorAll('[data-mode]')];
  let mode = 'extract';

  function renderTabs() {
    tabs.innerHTML = reports.map((report,index)=>`<button class="method-case-tab ${index===current?'is-active':''}" data-report="${index}">${esc(report.short ?? `Report ${index+1}`)}</button>`).join('');
    tabs.querySelectorAll('[data-report]').forEach(button => button.addEventListener('click',()=>{current=Number(button.dataset.report);renderTabs();renderReport();}));
  }
  function renderReport() {
    const report = reports[current];
    title.textContent = report.title;
    text.textContent = report.text;
    renderAnalysis();
  }
  function renderAnalysis() {
    const report = reports[current];
    if (mode === 'extract') {
      analysis.innerHTML = `<div class="entity-grid">${(report.entities??[]).map(item=>`<div><span>${esc(item.type)}</span><strong>${esc(item.value)}</strong></div>`).join('')}</div><div class="analytics-callout"><strong>Keywords:</strong> ${(report.keywords??[]).map(esc).join(' · ')}</div>`;
    } else if (mode === 'classify') {
      analysis.innerHTML = `<div class="metric-grid">${metric('Topic',report.topic)}${metric('Priority',report.priority)}${metric('Confidence',report.confidence)}</div><div class="risk-note"><strong>Rule:</strong> automated classification should support triage, not silently replace source review.</div>`;
    } else {
      analysis.innerHTML = `<div class="generated-summary"><p class="eyebrow">DETERMINISTIC DEMO · NOT AN LLM CALL</p><h3>Generated-style summary</h3><p>${esc(report.summary)}</p><div class="evidence-links">${(report.evidence??[]).map((item,index)=>`<span>[${index+1}] ${esc(item)}</span>`).join('')}</div></div><div class="hallucination-check"><strong>Provenance check</strong><p>${esc(report.provenanceNote ?? 'Every statement in the summary should be traceable to the source text. Unsupported additions are hallucinations, even when plausible.')}</p></div>`;
    }
  }
  modeButtons.forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;modeButtons.forEach(node=>node.classList.toggle('is-active',node===button));renderAnalysis();}));
  renderTabs();
  renderReport();
}
function metric(label,value){return `<div class="metric"><span class="metric__value metric__value--small">${esc(value)}</span><span class="metric__label">${esc(label)}</span></div>`;}
