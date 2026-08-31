const jsonCache = new Map();

export async function fetchJson(path) {
  const url = new URL(path, document.baseURI).href;

  if (!jsonCache.has(url)) {
    jsonCache.set(url, fetch(url).then(async response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return response.json();
    }));
  }

  return jsonCache.get(url);
}

export async function resolveConfig(element) {
  if (element.dataset.source) {
    const data = await fetchJson(element.dataset.source);
    return element.dataset.select ? selectPath(data, element.dataset.select) : data;
  }

  if (element.dataset.config) {
    return JSON.parse(element.dataset.config);
  }

  return {};
}

function selectPath(value, path) {
  return path.split('.').reduce((current, key) => {
    if (current && Object.hasOwn(current, key)) return current[key];
    throw new Error(`JSON path not found: ${path}`);
  }, value);
}
