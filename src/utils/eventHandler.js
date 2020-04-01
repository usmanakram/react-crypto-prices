import debug from "./debuger";
function bindUnbind(events, method) {
  const errors = [];
  for (const e of events) {
    const selector = e.selector();

    /**
     * Populate error messages array & skip current iteration, if elemnet not found
     */
    if (selector === null) {
      errors.push(e.selector + " not found");
      continue;
    }

    /**
     * For window & document.querySelector()
     */
    if ([0, undefined].includes(selector.length))
      selector[method](e.event, e.listener);
    else selector.forEach(el => el[method](e.event, e.listener));
  }

  /**
   * Log errors
   */
  if (errors.length) debug.log(errors);
}

function bind(events) {
  // for (let e in events) window.addEventListener(e, events[e]);
  // for (const e of events) e.selector().addEventListener(e.event, e.listener);
  bindUnbind(events, "addEventListener");
}
function unbind(events) {
  // for (let e in events) window.removeEventListener(e, events[e]);
  // for (const e of events) e.selector().removeEventListener(e.event, e.listener);
  bindUnbind(events, "removeEventListener");
}

export default {
  bind,
  unbind
};
