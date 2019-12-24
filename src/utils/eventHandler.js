function bind(events) {
  for (let e in events) window.addEventListener(e, events[e]);
}
function unbind(events) {
  for (let e in events) window.removeEventListener(e, events[e]);
}

export default {
  bind,
  unbind
};
