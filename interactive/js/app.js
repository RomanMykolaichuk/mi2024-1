import { registry } from './core/registry.js';
import { resolveConfig } from './core/data.js';

async function mountComponents() {
  const elements = [...document.querySelectorAll('[data-component]')];

  for (const element of elements) {
    const name = element.dataset.component;
    const mount = registry[name];

    if (!mount) {
      renderError(element, `Невідомий компонент: ${name}`);
      continue;
    }

    try {
      const config = await resolveConfig(element);
      await mount(element, config);
      element.dataset.mounted = 'true';
    } catch (error) {
      console.error(`[MI2024] ${name}`, error);
      renderError(element, 'Не вдалося завантажити інтерактивний блок. Перевірте JSON та browser console.');
    }
  }
}

function renderError(element, message) {
  element.innerHTML = `<div class="component-error" role="alert">${message}</div>`;
}

mountComponents();
