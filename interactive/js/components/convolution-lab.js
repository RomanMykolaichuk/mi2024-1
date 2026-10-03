const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mount(element, config) {
  const input = config.input ?? [[0,0,0,0,0],[0,1,1,1,0],[0,1,0,1,0],[0,1,1,1,0],[0,0,0,0,0]];
  const kernels = config.kernels ?? [];
  let current = kernels[0];
  let selectedCell = {row:0,col:0};

  element.innerHTML = `<div class="conv-lab">
    <div class="conv-kernel-tabs" data-role="tabs"></div>
    <p class="microcopy">Оберіть фільтр, а потім натисніть клітинку feature map. Підсвічений patch 3×3 показує, яку саме частину зображення kernel використав для цього результату.</p>
    <div class="conv-layout">
      <div><p class="eyebrow">INPUT 5×5</p><div class="matrix-grid matrix-grid--5" data-role="input"></div></div>
      <div class="conv-arrow">∗</div>
      <div><p class="eyebrow">KERNEL 3×3</p><div class="matrix-grid matrix-grid--3" data-role="kernel"></div></div>
      <div class="conv-arrow">→</div>
      <div><p class="eyebrow">FEATURE MAP 3×3</p><div class="matrix-grid matrix-grid--3" data-role="output"></div></div>
    </div>
    <div class="analytics-callout" data-role="insight"></div>
    <div class="conv-equation" data-role="equation"></div>
  </div>`;

  const tabs = element.querySelector('[data-role="tabs"]');
  const inputNode = element.querySelector('[data-role="input"]');
  const kernelNode = element.querySelector('[data-role="kernel"]');
  const outputNode = element.querySelector('[data-role="output"]');
  const insight = element.querySelector('[data-role="insight"]');
  const equation = element.querySelector('[data-role="equation"]');

  function renderTabs() {
    tabs.innerHTML = kernels.map((kernel, index) => `<button class="prep-tab ${kernel === current ? 'is-active' : ''}" data-kernel="${index}">${esc(kernel.label)}</button>`).join('');
    tabs.querySelectorAll('[data-kernel]').forEach(button => button.addEventListener('click', () => {
      current = kernels[Number(button.dataset.kernel)];
      selectedCell = {row:0,col:0};
      renderTabs();
      render();
    }));
  }

  function render() {
    if (!current) return;
    const output = convolve(input, current.values);
    inputNode.innerHTML = renderInput(input, selectedCell, current.values.length);
    kernelNode.innerHTML = renderMatrix(current.values);
    outputNode.innerHTML = renderOutput(output, selectedCell);
    insight.innerHTML = `<strong>${esc(current.label)}:</strong> ${esc(current.explanation)} <span class="microcopy">Kernel ковзає по input. Для кожного patch виконується element-wise множення, сума потрапляє в одну клітинку feature map.</span>`;
    equation.textContent = buildEquation(input, current.values, selectedCell.row, selectedCell.col);
    outputNode.querySelectorAll('[data-output-cell]').forEach(button => button.addEventListener('click', () => {
      selectedCell = {row:Number(button.dataset.row),col:Number(button.dataset.col)};
      render();
    }));
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
      for (let kr = 0; kr < kernel.length; kr += 1) {
        for (let kc = 0; kc < kernel[0].length; kc += 1) sum += input[r + kr][c + kc] * kernel[kr][kc];
      }
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

function renderMatrix(matrix) {
  return matrix.flat().map(value => `<span class="matrix-cell">${esc(format(value))}</span>`).join('');
}

function renderInput(matrix, selected, kernelSize) {
  return matrix.map((row,rowIndex) => row.map((value,colIndex) => {
    const inPatch = rowIndex >= selected.row && rowIndex < selected.row + kernelSize && colIndex >= selected.col && colIndex < selected.col + kernelSize;
    return `<span class="matrix-cell${inPatch ? ' is-patch' : ''}">${esc(format(value))}</span>`;
  }).join('')).join('');
}

function renderOutput(matrix, selected) {
  const max = Math.max(1, ...matrix.flat().map(value => Math.abs(value)));
  return matrix.map((row,rowIndex) => row.map((value,colIndex) => {
    const hot = Math.abs(value) >= max * .7;
    const active = rowIndex === selected.row && colIndex === selected.col;
    return `<button type="button" class="matrix-cell conv-output-cell${hot ? ' is-hot' : ''}${active ? ' is-selected' : ''}" data-output-cell data-row="${rowIndex}" data-col="${colIndex}" aria-label="Feature map рядок ${rowIndex + 1}, стовпець ${colIndex + 1}, значення ${esc(format(value))}">${esc(format(value))}</button>`;
  }).join('')).join('');
}

function buildEquation(input, kernel, row, col) {
  const terms = [];
  let sum = 0;
  for (let kr = 0; kr < kernel.length; kr += 1) {
    for (let kc = 0; kc < kernel[0].length; kc += 1) {
      const inputValue = Number(input[row + kr][col + kc]);
      const kernelValue = Number(kernel[kr][kc]);
      sum += inputValue * kernelValue;
      terms.push(`${inputValue}×${kernelValue}`);
    }
  }
  return `Feature map[${row + 1},${col + 1}] = ${terms.join(' + ')} = ${format(sum)}`;
}

function format(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toFixed(1);
}
