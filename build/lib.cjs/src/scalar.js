"use strict";

/* global BigInt */
const hexLen = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4];

function fromString(s, radix) {
  if (!radix || radix == 10) {
    return BigInt(s);
  } else if (radix == 16) {
    if (s.slice(0, 2) == "0x") {
      return BigInt(s);
    } else {
      return BigInt("0x" + s);
    }
  }
}

const e = fromString;

function fromArray(a, radix) {
  let acc = BigInt(0);
  radix = BigInt(radix);
  for (let i = 0; i < a.length; i++) {
    acc = acc * radix + BigInt(a[i]);
  }
  return acc;
}

function bitLength(a) {
  const aS = a.toString(16);
  return (aS.length - 1) * 4 + hexLen[parseInt(aS[0], 16)];
}

function isNegative(a) {
  return BigInt(a) < BigInt(0);
}

function isZero(a) {
  return !a;
}

function shiftLeft(a, n) {
  return BigInt(a) << BigInt(n);
}

function shiftRight(a, n) {
  return BigInt(a) >> BigInt(n);
}

const shl = shiftLeft;
const shr = shiftRight;

function isOdd(a) {
  return (BigInt(a) & BigInt(1)) == BigInt(1);
}

function naf(n) {
  let E = BigInt(n);
  const res = [];
  while (E) {
    if (E & BigInt(1)) {
      const z = 2 - Number(E % BigInt(4));
      res.push(z);
      E = E - BigInt(z);
    } else {
      res.push(0);
    }
    E = E >> BigInt(1);
  }
  return res;
}

function bits(n) {
  let E = BigInt(n);
  const res = [];
  while (E) {
    if (E & BigInt(1)) {
      res.push(1);
    } else {
      res.push(0);
    }
    E = E >> BigInt(1);
  }
  return res;
}

function toNumber(s) {
  if (s > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Number too big");
  }
  return Number(s);
}

function toArray(s, radix) {
  const res = [];
  let rem = BigInt(s);
  radix = BigInt(radix);
  while (rem) {
    res.unshift(Number(rem % radix));
    rem = rem / radix;
  }
  return res;
}

function add(a, b) {
  return BigInt(a) + BigInt(b);
}

function sub(a, b) {
  return BigInt(a) - BigInt(b);
}

function neg(a) {
  return -BigInt(a);
}

function mul(a, b) {
  return BigInt(a) * BigInt(b);
}

function square(a) {
  return BigInt(a) * BigInt(a);
}

function powBigInt(a, b) {
  let result = 1n;
  while (b > 0n) {
    if (b % 2n === 1n) result = a;
    a = a;
    b /= 2n;
  }
  return result;
}

function pow(a, b) {
  return powBigInt(BigInt(a), BigInt(b));
}

function exp(a, b) {
  return BigInt(a) ** BigInt(b);
}

function abs(a) {
  return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
}

function div(a, b) {
  return BigInt(a) / BigInt(b);
}

function mod(a, b) {
  return BigInt(a) % BigInt(b);
}

function eq(a, b) {
  return BigInt(a) == BigInt(b);
}

function neq(a, b) {
  return BigInt(a) != BigInt(b);
}

function lt(a, b) {
  return BigInt(a) < BigInt(b);
}

function gt(a, b) {
  return BigInt(a) > BigInt(b);
}

function leq(a, b) {
  return BigInt(a) <= BigInt(b);
}

function geq(a, b) {
  return BigInt(a) >= BigInt(b);
}

function band(a, b) {
  return BigInt(a) & BigInt(b);
}

function bor(a, b) {
  return BigInt(a) | BigInt(b);
}

function bxor(a, b) {
  return BigInt(a) ^ BigInt(b);
}

function land(a, b) {
  return BigInt(a) && BigInt(b);
}

function lor(a, b) {
  return BigInt(a) || BigInt(b);
}

function lnot(a) {
  return !BigInt(a);
}

// Returns a buffer with Little Endian Representation
function toRprLE(buff, o, e, n8) {
  const s = "0000000" + e.toString(16);
  const v = new Uint32Array(buff.buffer, o, n8 / 4);
  const l = (((s.length - 7) * 4 - 1) >> 5) + 1; // Number of 32bit words;
  for (let i = 0; i < l; i++)
    v[i] = parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16);
  for (let i = l; i < v.length; i++) v[i] = 0;
  for (let i = v.length * 4; i < n8; i++)
    buff[i] = toNumber(band(shiftRight(e, i * 8), 0xff));
}

// Returns a buffer with Big Endian Representation
function toRprBE(buff, o, e, n8) {
  const s = "0000000" + e.toString(16);
  const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
  const l = (((s.length - 7) * 4 - 1) >> 5) + 1; // Number of 32bit words;
  for (let i = 0; i < l; i++)
    v.setUint32(
      n8 - i * 4 - 4,
      parseInt(s.substring(s.length - 8 * i - 8, s.length - 8 * i), 16),
      false
    );
  for (let i = 0; i < n8 / 4 - l; i++) v[i] = 0;
}

// Pases a buffer with Little Endian Representation
function fromRprLE(buff, o, n8) {
  n8 = n8 || buff.byteLength;
  o = o || 0;
  const v = new Uint32Array(buff.buffer, o, n8 / 4);
  const a = new Array(n8 / 4);
  v.forEach(
    (ch, i) => (a[a.length - i - 1] = ch.toString(16).padStart(8, "0"))
  );
  return fromString(a.join(""), 16);
}

// Pases a buffer with Big Endian Representation
function fromRprBE(buff, o, n8) {
  n8 = n8 || buff.byteLength;
  o = o || 0;
  const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
  const a = new Array(n8 / 4);
  for (let i = 0; i < n8 / 4; i++) {
    a[i] = v
      .getUint32(i * 4, false)
      .toString(16)
      .padStart(8, "0");
  }
  return fromString(a.join(""), 16);
}

function toString(a, radix) {
  return a.toString(radix);
}

function toLEBuff(a) {
  const buff = new Uint8Array(Math.floor((bitLength(a) - 1) / 8) + 1);
  toRprLE(buff, 0, a, buff.byteLength);
  return buff;
}

const zero = e(0);
const one = e(1);

exports.abs = abs;
exports.add = add;
exports.band = band;
exports.bitLength = bitLength;
exports.bits = bits;
exports.bor = bor;
exports.bxor = bxor;
exports.div = div;
exports.e = e;
exports.eq = eq;
exports.exp = exp;
exports.fromArray = fromArray;
exports.fromRprBE = fromRprBE;
exports.fromRprLE = fromRprLE;
exports.fromString = fromString;
exports.geq = geq;
exports.gt = gt;
exports.isNegative = isNegative;
exports.isOdd = isOdd;
exports.isZero = isZero;
exports.land = land;
exports.leq = leq;
exports.lnot = lnot;
exports.lor = lor;
exports.lt = lt;
exports.mod = mod;
exports.mul = mul;
exports.naf = naf;
exports.neg = neg;
exports.neq = neq;
exports.one = one;
exports.pow = pow;
exports.shiftLeft = shiftLeft;
exports.shiftRight = shiftRight;
exports.shl = shl;
exports.shr = shr;
exports.square = square;
exports.sub = sub;
exports.toArray = toArray;
exports.toLEBuff = toLEBuff;
exports.toNumber = toNumber;
exports.toRprBE = toRprBE;
exports.toRprLE = toRprLE;
exports.toString = toString;
exports.zero = zero;
