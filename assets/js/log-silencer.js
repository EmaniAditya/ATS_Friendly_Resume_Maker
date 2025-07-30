/**
 * log-silencer.js
 *
 * Temporarily silences all console output **except** for `console.error` when
 * running in production (i.e., not on `localhost` or `127.0.0.1`).
 *
 * How it works:
 * 1. Detects if verbose logs are explicitly enabled via:
 *    - Query-string parameter  ?debugLogs=true   OR
 *    - localStorage flag       debugLogs = "true"
 *    In those cases we keep the original console behaviour.
 * 2. Otherwise, we replace `console.log`, `console.info`, `console.debug`,
 *    `console.warn`, and `console.trace` with no-op functions.
 * 3. We expose a helper `window.__enableLogs()` so that you can re-enable the
 *    original behaviour at runtime from DevTools if needed.
 *
 * To restore logging:
 *     window.__enableLogs && window.__enableLogs();
 *
 * To persist verbose logging across page reloads in production:
 *     localStorage.setItem('debugLogs', 'true');
 *
 * To enable for a single load:
 *     https://example.com/?debugLogs=true
 */
(function () {
  // Bypass silencing when developing locally.
  const isLocalHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  // Check run-time overrides.
  const urlParamDebug = new URLSearchParams(location.search).get('debugLogs') === 'true';
  const lsDebug = localStorage.getItem('debugLogs') === 'true';

  if (isLocalHost || urlParamDebug || lsDebug) {
    // Keep original console behaviour.
    return;
  }

  // Capture originals so that we can restore them later.
  const originalConsole = {
    log: console.log,
    info: console.info,
    debug: console.debug,
    warn: console.warn,
    trace: console.trace
  };

  function noop() {}

  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.trace = noop;

  // Helper for manual restoration.
  window.__enableLogs = function () {
    Object.assign(console, originalConsole);
    delete window.__enableLogs;
  };
})();
