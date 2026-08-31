const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const input = config.input ?? [[0,0,0,0,0],[0,1,1,1,0],[0,1,0,1,0],[0,1,1,1,0],[0,0,0,0,0]];
  const kernels = config.kernels ?? [];
  let current = kernels[0];
  element.innerHTML = `<div class="conv-lab"><div class="conv-kernel-tabs" data-role="tabs"></div><div class="conv-layout"><div><p class="eyebrow">INPUT 5×5</p><div class="matrix-grid matrix-grid--5" data-role="input"></div></div><div class="conv-arrow">∗</div><div><p class="eyebrow">KERNEL 3×3</p><div class="matrix-grid matrix-grid--3" data-role="kernel"></div></div><div class="conv-arrow">→</div><div><p class="eyebrow">FEATURE MAP 3×3</p><div class="matrix-grid matrix-grid--3" data-role="output"></div></div></div><div class="analytics-callout" data-role="insight"></div></div>`;
  const tabs = element.querySelector('[data-role="tabs"]');
  const inputNode = element.querySelector('[data-role="input"]');
  const kernelNode = element.querySelector('[data-role="kernel"]');
  const outputNode = element.querySelector('[data-role="output"]');
  const insight = element.querySelector('[data-role="insight"]');
  inputNode.innerHTML = renderMatrix(input);

  function renderTabs() {
    tabs.innerHTML = kernels.map((kernel, index) => `<button class="prep-tab ${kernel === current ? 'is-active' : ''}" data-kernel="${index}">${esc(kernel.label)}</button>`).join('');
    tabs.querySelectorAll('[data-kernel]').forEach(button => button.addEventListener('click', () => {
      current = kernels[Number(button.dataset.kernel)];
      renderTabs();
      render();
    }));
  }
  function render() {
    if (!current) return;
    kernelNode.innerHTML = renderMatrix(current.values);
    const output = convolve(input, current.values);
    outputNode.innerHTML = renderMatrix(output, true);
    insight.innerHTML = `<strong>${esc(current.label)}:</strong> ${esc(current.explanation)} <span class="microcopy">CNN не отримує «готовий сенс» — локальні ознаки формуються через послідовність learned filters, activations і наступних шарів.</span>`;
  }
  renderTabs();
  render();
}

function convolve(input, kernel) {
  const out = [];
  for (let r = 0; r <= input.length - kernel.length; r += 1) {
    const row = [];
    for (let c = 0; c <= input[0].length - kernel[0].length; c += 1) {
      let sum = 0;
      for (let kr = 0; kr < kernel.length; kr += 1) for (let kc = 0; kc < kernel[0].length; kc += 1) sum += input[r + kr][c + kc] * kernel[kr][kc];
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}
function renderMatrix(matrix, highlight = false) {
  const max = Math.max(1, ...matrix.flat().map(value => Math.abs(value)));
  return matrix.flat().map(value => `<span class="matrix-cell ${highlight && Math.abs(value) >= max * .7 ? 'is-hot' : ''}">${esc(Number(value).toFixed(Number.isInteger(value) ? 0 : 1))}</span>`).join('');
}
