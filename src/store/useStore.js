import { useState, useEffect, useCallback } from "react";
import { generateData } from "../data/mockData.js";

const STORAGE_KEY = "FinSight_v3";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveState(s) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ txns: s.txns, role: s.role, dark: s.dark }),
    );
  } catch {}
}

let _state = null;
const _listeners = new Set();

function getState() {
  if (!_state) {
    const saved = loadState();
    _state = {
      txns: saved.txns || generateData(),
      role: saved.role || "admin",
      dark: saved.dark || false,
    };
  }
  return _state;
}

function setState(updater) {
  _state = {
    ...getState(),
    ...(typeof updater === "function" ? updater(getState()) : updater),
  };
  saveState(_state);
  _listeners.forEach((fn) => fn(_state));
}

export function useStore(selector) {
  const [val, setVal] = useState(() => selector(getState()));
  useEffect(() => {
    const handler = (s) => setVal(selector(s));
    _listeners.add(handler);
    return () => _listeners.delete(handler);
  }, []);
  return val;
}

export function useActions() {
  const addTxn = useCallback((t) => {
    setState((s) => ({
      txns: [t, ...s.txns].sort((a, b) => new Date(b.date) - new Date(a.date)),
    }));
  }, []);
  const updateTxn = useCallback((t) => {
    setState((s) => ({ txns: s.txns.map((x) => (x.id === t.id ? t : x)) }));
  }, []);
  const deleteTxn = useCallback((id) => {
    setState((s) => ({ txns: s.txns.filter((x) => x.id !== id) }));
  }, []);
  const setRole = useCallback((role) => setState({ role }), []);
  const setDark = useCallback((dark) => setState({ dark }), []);
  return { addTxn, updateTxn, deleteTxn, setRole, setDark };
}
