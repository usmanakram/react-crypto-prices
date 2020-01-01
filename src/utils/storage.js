const storageKey = "bittrainex";

function getAll() {
  return JSON.parse(localStorage.getItem(storageKey)) || {};
}

function get(key) {
  const data = getAll();
  // return data[key] === undefined ? null : data[key];
  return data[key];
}

function set(key, value) {
  const data = getAll();

  // data[key] = value;
  if (value === undefined) delete data[key];
  else data[key] = value;

  if (Object.keys(data).length)
    localStorage.setItem(storageKey, JSON.stringify(data));
  else localStorage.removeItem(storageKey);
}

function remove(key) {
  set(key);
}

export default { get, set, remove };
