const initialState = () => ({
  step: "hero",
  destination: null, // { id, nom }
  dates: { debut: null, fin: null, nuits: 0 },
  activites: [], // [{ id, label }]
  reponse: null,
});

let state = initialState();
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetState() {
  state = initialState();
  listeners.forEach((fn) => fn(state));
}
