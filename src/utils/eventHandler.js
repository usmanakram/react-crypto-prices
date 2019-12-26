function bind(events) {
  // for (let e in events) window.addEventListener(e, events[e]);
  // for (const e of events) e.selector().addEventListener(e.event, e.listener);
  for (const e of events) {
    if ([0, undefined].includes(e.selector().length))
      e.selector().addEventListener(e.event, e.listener);
    else e.selector().forEach(el => el.addEventListener(e.event, e.listener));
  }
}
function unbind(events) {
  // for (let e in events) window.removeEventListener(e, events[e]);
  // for (const e of events) e.selector().removeEventListener(e.event, e.listener);
  for (const e of events) {
    if ([0, undefined].includes(e.selector().length))
      e.selector().removeEventListener(e.event, e.listener);
    else
      e.selector().forEach(el => el.removeEventListener(e.event, e.listener));
  }
}

export default {
  bind,
  unbind
};
