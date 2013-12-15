;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var curry, flip, fix, apply;
curry = function(f){
  return curry$(f);
};
flip = curry$(function(f, x, y){
  return f(y, x);
});
fix = function(f){
  return function(g, x){
    return function(){
      return f(g(g)).apply(null, arguments);
    };
  }(function(g, x){
    return function(){
      return f(g(g)).apply(null, arguments);
    };
  });
};
apply = curry$(function(f, list){
  return f.apply(null, list);
});
module.exports = {
  curry: curry,
  flip: flip,
  fix: fix,
  apply: apply
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}

},{}],2:[function(require,module,exports){
var each, map, compact, filter, reject, partition, find, head, first, tail, last, initial, empty, reverse, unique, fold, foldl, fold1, foldl1, foldr, foldr1, unfoldr, concat, concatMap, flatten, difference, intersection, union, countBy, groupBy, andList, orList, any, all, sort, sortWith, sortBy, sum, product, mean, average, maximum, minimum, scan, scanl, scan1, scanl1, scanr, scanr1, slice, take, drop, splitAt, takeWhile, dropWhile, span, breakList, zip, zipWith, zipAll, zipAllWith, toString$ = {}.toString, slice$ = [].slice;
each = curry$(function(f, xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    f(x);
  }
  return xs;
});
map = curry$(function(f, xs){
  var i$, len$, x, results$ = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    results$.push(f(x));
  }
  return results$;
});
compact = curry$(function(xs){
  var i$, len$, x, results$ = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (x) {
      results$.push(x);
    }
  }
  return results$;
});
filter = curry$(function(f, xs){
  var i$, len$, x, results$ = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (f(x)) {
      results$.push(x);
    }
  }
  return results$;
});
reject = curry$(function(f, xs){
  var i$, len$, x, results$ = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (!f(x)) {
      results$.push(x);
    }
  }
  return results$;
});
partition = curry$(function(f, xs){
  var passed, failed, i$, len$, x;
  passed = [];
  failed = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    (f(x) ? passed : failed).push(x);
  }
  return [passed, failed];
});
find = curry$(function(f, xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (f(x)) {
      return x;
    }
  }
});
head = first = function(xs){
  if (!xs.length) {
    return;
  }
  return xs[0];
};
tail = function(xs){
  if (!xs.length) {
    return;
  }
  return xs.slice(1);
};
last = function(xs){
  if (!xs.length) {
    return;
  }
  return xs[xs.length - 1];
};
initial = function(xs){
  var len;
  len = xs.length;
  if (!len) {
    return;
  }
  return xs.slice(0, len - 1);
};
empty = function(xs){
  return !xs.length;
};
reverse = function(xs){
  return xs.concat().reverse();
};
unique = function(xs){
  var result, i$, len$, x;
  result = [];
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (!in$(x, result)) {
      result.push(x);
    }
  }
  return result;
};
fold = foldl = curry$(function(f, memo, xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    memo = f(memo, x);
  }
  return memo;
});
fold1 = foldl1 = curry$(function(f, xs){
  return fold(f, xs[0], xs.slice(1));
});
foldr = curry$(function(f, memo, xs){
  return fold(f, memo, xs.concat().reverse());
});
foldr1 = curry$(function(f, xs){
  var ys;
  ys = xs.concat().reverse();
  return fold(f, ys[0], ys.slice(1));
});
unfoldr = curry$(function(f, b){
  var result, x, that;
  result = [];
  x = b;
  while ((that = f(x)) != null) {
    result.push(that[0]);
    x = that[1];
  }
  return result;
});
concat = function(xss){
  return [].concat.apply([], xss);
};
concatMap = curry$(function(f, xs){
  var x;
  return [].concat.apply([], (function(){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];
      results$.push(f(x));
    }
    return results$;
  }()));
});
flatten = curry$(function(xs){
  var x;
  return [].concat.apply([], (function(){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];
      if (toString$.call(x).slice(8, -1) === 'Array') {
        results$.push(flatten(x));
      } else {
        results$.push(x);
      }
    }
    return results$;
  }()));
});
difference = function(xs){
  var yss, results, i$, len$, x, j$, len1$, ys;
  yss = slice$.call(arguments, 1);
  results = [];
  outer: for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    for (j$ = 0, len1$ = yss.length; j$ < len1$; ++j$) {
      ys = yss[j$];
      if (in$(x, ys)) {
        continue outer;
      }
    }
    results.push(x);
  }
  return results;
};
intersection = function(xs){
  var yss, results, i$, len$, x, j$, len1$, ys;
  yss = slice$.call(arguments, 1);
  results = [];
  outer: for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    for (j$ = 0, len1$ = yss.length; j$ < len1$; ++j$) {
      ys = yss[j$];
      if (!in$(x, ys)) {
        continue outer;
      }
    }
    results.push(x);
  }
  return results;
};
union = function(){
  var xss, results, i$, len$, xs, j$, len1$, x;
  xss = slice$.call(arguments);
  results = [];
  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];
    for (j$ = 0, len1$ = xs.length; j$ < len1$; ++j$) {
      x = xs[j$];
      if (!in$(x, results)) {
        results.push(x);
      }
    }
  }
  return results;
};
countBy = curry$(function(f, xs){
  var results, i$, len$, x, key;
  results = {};
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    key = f(x);
    if (key in results) {
      results[key] += 1;
    } else {
      results[key] = 1;
    }
  }
  return results;
});
groupBy = curry$(function(f, xs){
  var results, i$, len$, x, key;
  results = {};
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    key = f(x);
    if (key in results) {
      results[key].push(x);
    } else {
      results[key] = [x];
    }
  }
  return results;
});
andList = function(xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (!x) {
      return false;
    }
  }
  return true;
};
orList = function(xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (x) {
      return true;
    }
  }
  return false;
};
any = curry$(function(f, xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (f(x)) {
      return true;
    }
  }
  return false;
});
all = curry$(function(f, xs){
  var i$, len$, x;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    if (!f(x)) {
      return false;
    }
  }
  return true;
});
sort = function(xs){
  return xs.concat().sort(function(x, y){
    if (x > y) {
      return 1;
    } else if (x < y) {
      return -1;
    } else {
      return 0;
    }
  });
};
sortWith = curry$(function(f, xs){
  if (!xs.length) {
    return [];
  }
  return xs.concat().sort(f);
});
sortBy = curry$(function(f, xs){
  if (!xs.length) {
    return [];
  }
  return xs.concat().sort(function(x, y){
    if (f(x) > f(y)) {
      return 1;
    } else if (f(x) < f(y)) {
      return -1;
    } else {
      return 0;
    }
  });
});
sum = function(xs){
  var result, i$, len$, x;
  result = 0;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    result += x;
  }
  return result;
};
product = function(xs){
  var result, i$, len$, x;
  result = 1;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    result *= x;
  }
  return result;
};
mean = average = function(xs){
  var sum, len, i$, i;
  sum = 0;
  len = xs.length;
  for (i$ = 0; i$ < len; ++i$) {
    i = i$;
    sum += xs[i];
  }
  return sum / len;
};
maximum = function(xs){
  var max, i$, ref$, len$, x;
  max = xs[0];
  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];
    if (x > max) {
      max = x;
    }
  }
  return max;
};
minimum = function(xs){
  var min, i$, ref$, len$, x;
  min = xs[0];
  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];
    if (x < min) {
      min = x;
    }
  }
  return min;
};
scan = scanl = curry$(function(f, memo, xs){
  var last, x;
  last = memo;
  return [memo].concat((function(){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];
      results$.push(last = f(last, x));
    }
    return results$;
  }()));
});
scan1 = scanl1 = curry$(function(f, xs){
  if (!xs.length) {
    return;
  }
  return scan(f, xs[0], xs.slice(1));
});
scanr = curry$(function(f, memo, xs){
  xs = xs.concat().reverse();
  return scan(f, memo, xs).reverse();
});
scanr1 = curry$(function(f, xs){
  if (!xs.length) {
    return;
  }
  xs = xs.concat().reverse();
  return scan(f, xs[0], xs.slice(1)).reverse();
});
slice = curry$(function(x, y, xs){
  return xs.slice(x, y);
});
take = curry$(function(n, xs){
  if (n <= 0) {
    return xs.slice(0, 0);
  } else if (!xs.length) {
    return xs;
  } else {
    return xs.slice(0, n);
  }
});
drop = curry$(function(n, xs){
  if (n <= 0 || !xs.length) {
    return xs;
  } else {
    return xs.slice(n);
  }
});
splitAt = curry$(function(n, xs){
  return [take(n, xs), drop(n, xs)];
});
takeWhile = curry$(function(p, xs){
  var len, i;
  len = xs.length;
  if (!len) {
    return xs;
  }
  i = 0;
  while (i < len && p(xs[i])) {
    i += 1;
  }
  return xs.slice(0, i);
});
dropWhile = curry$(function(p, xs){
  var len, i;
  len = xs.length;
  if (!len) {
    return xs;
  }
  i = 0;
  while (i < len && p(xs[i])) {
    i += 1;
  }
  return xs.slice(i);
});
span = curry$(function(p, xs){
  return [takeWhile(p, xs), dropWhile(p, xs)];
});
breakList = curry$(function(p, xs){
  return span(compose$([not$, p]), xs);
});
zip = curry$(function(xs, ys){
  var result, len, i$, len$, i, x;
  result = [];
  len = ys.length;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];
    if (i === len) {
      break;
    }
    result.push([x, ys[i]]);
  }
  return result;
});
zipWith = curry$(function(f, xs, ys){
  var result, len, i$, len$, i, x;
  result = [];
  len = ys.length;
  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];
    if (i === len) {
      break;
    }
    result.push(f(x, ys[i]));
  }
  return result;
});
zipAll = function(){
  var xss, minLength, i$, len$, xs, ref$, i, lresult$, j$, results$ = [];
  xss = slice$.call(arguments);
  minLength = 9e9;
  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];
    minLength <= (ref$ = xs.length) || (minLength = ref$);
  }
  for (i$ = 0; i$ < minLength; ++i$) {
    i = i$;
    lresult$ = [];
    for (j$ = 0, len$ = xss.length; j$ < len$; ++j$) {
      xs = xss[j$];
      lresult$.push(xs[i]);
    }
    results$.push(lresult$);
  }
  return results$;
};
zipAllWith = function(f){
  var xss, minLength, i$, len$, xs, ref$, i, results$ = [];
  xss = slice$.call(arguments, 1);
  minLength = 9e9;
  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];
    minLength <= (ref$ = xs.length) || (minLength = ref$);
  }
  for (i$ = 0; i$ < minLength; ++i$) {
    i = i$;
    results$.push(f.apply(null, (fn$())));
  }
  return results$;
  function fn$(){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = xss).length; i$ < len$; ++i$) {
      xs = ref$[i$];
      results$.push(xs[i]);
    }
    return results$;
  }
};
module.exports = {
  each: each,
  map: map,
  filter: filter,
  compact: compact,
  reject: reject,
  partition: partition,
  find: find,
  head: head,
  first: first,
  tail: tail,
  last: last,
  initial: initial,
  empty: empty,
  reverse: reverse,
  difference: difference,
  intersection: intersection,
  union: union,
  countBy: countBy,
  groupBy: groupBy,
  fold: fold,
  fold1: fold1,
  foldl: foldl,
  foldl1: foldl1,
  foldr: foldr,
  foldr1: foldr1,
  unfoldr: unfoldr,
  andList: andList,
  orList: orList,
  any: any,
  all: all,
  unique: unique,
  sort: sort,
  sortWith: sortWith,
  sortBy: sortBy,
  sum: sum,
  product: product,
  mean: mean,
  average: average,
  concat: concat,
  concatMap: concatMap,
  flatten: flatten,
  maximum: maximum,
  minimum: minimum,
  scan: scan,
  scan1: scan1,
  scanl: scanl,
  scanl1: scanl1,
  scanr: scanr,
  scanr1: scanr1,
  slice: slice,
  take: take,
  drop: drop,
  splitAt: splitAt,
  takeWhile: takeWhile,
  dropWhile: dropWhile,
  span: span,
  breakList: breakList,
  zip: zip,
  zipWith: zipWith,
  zipAll: zipAll,
  zipAllWith: zipAllWith
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
function in$(x, arr){
  var i = -1, l = arr.length >>> 0;
  while (++i < l) if (x === arr[i] && i in arr) return true;
  return false;
}
function compose$(fs){
  return function(){
    var i, args = arguments;
    for (i = fs.length; i > 0; --i) { args = [fs[i-1].apply(this, args)]; }
    return args[0];
  };
}
function not$(x){ return !x; }

},{}],3:[function(require,module,exports){
var max, min, negate, abs, signum, quot, rem, div, mod, recip, pi, tau, exp, sqrt, ln, pow, sin, tan, cos, asin, acos, atan, atan2, truncate, round, ceiling, floor, isItNaN, even, odd, gcd, lcm;
max = curry$(function(x$, y$){
  return x$ > y$ ? x$ : y$;
});
min = curry$(function(x$, y$){
  return x$ < y$ ? x$ : y$;
});
negate = function(x){
  return -x;
};
abs = Math.abs;
signum = function(x){
  if (x < 0) {
    return -1;
  } else if (x > 0) {
    return 1;
  } else {
    return 0;
  }
};
quot = curry$(function(x, y){
  return ~~(x / y);
});
rem = curry$(function(x$, y$){
  return x$ % y$;
});
div = curry$(function(x, y){
  return Math.floor(x / y);
});
mod = curry$(function(x$, y$){
  var ref$;
  return ((x$) % (ref$ = y$) + ref$) % ref$;
});
recip = (function(it){
  return 1 / it;
});
pi = Math.PI;
tau = pi * 2;
exp = Math.exp;
sqrt = Math.sqrt;
ln = Math.log;
pow = curry$(function(x$, y$){
  return Math.pow(x$, y$);
});
sin = Math.sin;
tan = Math.tan;
cos = Math.cos;
asin = Math.asin;
acos = Math.acos;
atan = Math.atan;
atan2 = curry$(function(x, y){
  return Math.atan2(x, y);
});
truncate = function(x){
  return ~~x;
};
round = Math.round;
ceiling = Math.ceil;
floor = Math.floor;
isItNaN = function(x){
  return x !== x;
};
even = function(x){
  return x % 2 === 0;
};
odd = function(x){
  return x % 2 !== 0;
};
gcd = curry$(function(x, y){
  var z;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y !== 0) {
    z = x % y;
    x = y;
    y = z;
  }
  return x;
});
lcm = curry$(function(x, y){
  return Math.abs(Math.floor(x / gcd(x, y) * y));
});
module.exports = {
  max: max,
  min: min,
  negate: negate,
  abs: abs,
  signum: signum,
  quot: quot,
  rem: rem,
  div: div,
  mod: mod,
  recip: recip,
  pi: pi,
  tau: tau,
  exp: exp,
  sqrt: sqrt,
  ln: ln,
  pow: pow,
  sin: sin,
  tan: tan,
  cos: cos,
  acos: acos,
  asin: asin,
  atan: atan,
  atan2: atan2,
  truncate: truncate,
  round: round,
  ceiling: ceiling,
  floor: floor,
  isItNaN: isItNaN,
  even: even,
  odd: odd,
  gcd: gcd,
  lcm: lcm
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}

},{}],4:[function(require,module,exports){
var values, keys, pairsToObj, objToPairs, listsToObj, objToLists, empty, each, map, compact, filter, reject, partition, find;
values = function(object){
  var i$, x, results$ = [];
  for (i$ in object) {
    x = object[i$];
    results$.push(x);
  }
  return results$;
};
keys = function(object){
  var x, results$ = [];
  for (x in object) {
    results$.push(x);
  }
  return results$;
};
pairsToObj = function(object){
  var i$, len$, x, results$ = {};
  for (i$ = 0, len$ = object.length; i$ < len$; ++i$) {
    x = object[i$];
    results$[x[0]] = x[1];
  }
  return results$;
};
objToPairs = function(object){
  var key, value, results$ = [];
  for (key in object) {
    value = object[key];
    results$.push([key, value]);
  }
  return results$;
};
listsToObj = curry$(function(keys, values){
  var i$, len$, i, key, results$ = {};
  for (i$ = 0, len$ = keys.length; i$ < len$; ++i$) {
    i = i$;
    key = keys[i$];
    results$[key] = values[i];
  }
  return results$;
});
objToLists = function(objectect){
  var keys, values, key, value;
  keys = [];
  values = [];
  for (key in objectect) {
    value = objectect[key];
    keys.push(key);
    values.push(value);
  }
  return [keys, values];
};
empty = function(object){
  var x;
  for (x in object) {
    return false;
  }
  return true;
};
each = curry$(function(f, object){
  var i$, x;
  for (i$ in object) {
    x = object[i$];
    f(x);
  }
  return object;
});
map = curry$(function(f, object){
  var k, x, results$ = {};
  for (k in object) {
    x = object[k];
    results$[k] = f(x);
  }
  return results$;
});
compact = curry$(function(object){
  var k, x, results$ = {};
  for (k in object) {
    x = object[k];
if (x) {
      results$[k] = x;
    }
  }
  return results$;
});
filter = curry$(function(f, object){
  var k, x, results$ = {};
  for (k in object) {
    x = object[k];
if (f(x)) {
      results$[k] = x;
    }
  }
  return results$;
});
reject = curry$(function(f, object){
  var k, x, results$ = {};
  for (k in object) {
    x = object[k];
if (!f(x)) {
      results$[k] = x;
    }
  }
  return results$;
});
partition = curry$(function(f, object){
  var passed, failed, k, x;
  passed = {};
  failed = {};
  for (k in object) {
    x = object[k];
    (f(x) ? passed : failed)[k] = x;
  }
  return [passed, failed];
});
find = curry$(function(f, object){
  var i$, x;
  for (i$ in object) {
    x = object[i$];
    if (f(x)) {
      return x;
    }
  }
});
module.exports = {
  values: values,
  keys: keys,
  pairsToObj: pairsToObj,
  objToPairs: objToPairs,
  listsToObj: listsToObj,
  objToLists: objToLists,
  empty: empty,
  each: each,
  map: map,
  filter: filter,
  compact: compact,
  reject: reject,
  partition: partition,
  find: find
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}

},{}],5:[function(require,module,exports){
var split, join, lines, unlines, words, unwords, chars, unchars, reverse, repeat;
split = curry$(function(sep, str){
  return str.split(sep);
});
join = curry$(function(sep, xs){
  return xs.join(sep);
});
lines = function(str){
  if (!str.length) {
    return [];
  }
  return str.split('\n');
};
unlines = function(it){
  return it.join('\n');
};
words = function(str){
  if (!str.length) {
    return [];
  }
  return str.split(/[ ]+/);
};
unwords = function(it){
  return it.join(' ');
};
chars = function(it){
  return it.split('');
};
unchars = function(it){
  return it.join('');
};
reverse = function(str){
  return str.split('').reverse().join('');
};
repeat = curry$(function(n, str){
  var out, res$, i$;
  res$ = [];
  for (i$ = 0; i$ < n; ++i$) {
    res$.push(str);
  }
  out = res$;
  return out.join('');
});
module.exports = {
  split: split,
  join: join,
  lines: lines,
  unlines: unlines,
  words: words,
  unwords: unwords,
  chars: chars,
  unchars: unchars,
  reverse: reverse,
  repeat: repeat
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}

},{}],6:[function(require,module,exports){
var Func, List, Obj, Str, Num, id, isType, replicate, prelude, toString$ = {}.toString;
Func = require('./Func.js');
List = require('./List.js');
Obj = require('./Obj.js');
Str = require('./Str.js');
Num = require('./Num.js');
id = function(x){
  return x;
};
isType = curry$(function(type, x){
  return toString$.call(x).slice(8, -1) === type;
});
replicate = curry$(function(n, x){
  var i$, results$ = [];
  for (i$ = 0; i$ < n; ++i$) {
    results$.push(x);
  }
  return results$;
});
Str.empty = List.empty;
Str.slice = List.slice;
Str.take = List.take;
Str.drop = List.drop;
Str.splitAt = List.splitAt;
Str.takeWhile = List.takeWhile;
Str.dropWhile = List.dropWhile;
Str.span = List.span;
Str.breakStr = List.breakList;
prelude = {
  Func: Func,
  List: List,
  Obj: Obj,
  Str: Str,
  Num: Num,
  id: id,
  isType: isType,
  replicate: replicate
};
prelude.each = List.each;
prelude.map = List.map;
prelude.filter = List.filter;
prelude.compact = List.compact;
prelude.reject = List.reject;
prelude.partition = List.partition;
prelude.find = List.find;
prelude.head = List.head;
prelude.first = List.first;
prelude.tail = List.tail;
prelude.last = List.last;
prelude.initial = List.initial;
prelude.empty = List.empty;
prelude.reverse = List.reverse;
prelude.difference = List.difference;
prelude.intersection = List.intersection;
prelude.union = List.union;
prelude.countBy = List.countBy;
prelude.groupBy = List.groupBy;
prelude.fold = List.fold;
prelude.foldl = List.foldl;
prelude.fold1 = List.fold1;
prelude.foldl1 = List.foldl1;
prelude.foldr = List.foldr;
prelude.foldr1 = List.foldr1;
prelude.unfoldr = List.unfoldr;
prelude.andList = List.andList;
prelude.orList = List.orList;
prelude.any = List.any;
prelude.all = List.all;
prelude.unique = List.unique;
prelude.sort = List.sort;
prelude.sortWith = List.sortWith;
prelude.sortBy = List.sortBy;
prelude.sum = List.sum;
prelude.product = List.product;
prelude.mean = List.mean;
prelude.average = List.average;
prelude.concat = List.concat;
prelude.concatMap = List.concatMap;
prelude.flatten = List.flatten;
prelude.maximum = List.maximum;
prelude.minimum = List.minimum;
prelude.scan = List.scan;
prelude.scanl = List.scanl;
prelude.scan1 = List.scan1;
prelude.scanl1 = List.scanl1;
prelude.scanr = List.scanr;
prelude.scanr1 = List.scanr1;
prelude.slice = List.slice;
prelude.take = List.take;
prelude.drop = List.drop;
prelude.splitAt = List.splitAt;
prelude.takeWhile = List.takeWhile;
prelude.dropWhile = List.dropWhile;
prelude.span = List.span;
prelude.breakList = List.breakList;
prelude.zip = List.zip;
prelude.zipWith = List.zipWith;
prelude.zipAll = List.zipAll;
prelude.zipAllWith = List.zipAllWith;
prelude.apply = Func.apply;
prelude.curry = Func.curry;
prelude.flip = Func.flip;
prelude.fix = Func.fix;
prelude.split = Str.split;
prelude.join = Str.join;
prelude.lines = Str.lines;
prelude.unlines = Str.unlines;
prelude.words = Str.words;
prelude.unwords = Str.unwords;
prelude.chars = Str.chars;
prelude.unchars = Str.unchars;
prelude.values = Obj.values;
prelude.keys = Obj.keys;
prelude.pairsToObj = Obj.pairsToObj;
prelude.objToPairs = Obj.objToPairs;
prelude.listsToObj = Obj.listsToObj;
prelude.objToLists = Obj.objToLists;
prelude.max = Num.max;
prelude.min = Num.min;
prelude.negate = Num.negate;
prelude.abs = Num.abs;
prelude.signum = Num.signum;
prelude.quot = Num.quot;
prelude.rem = Num.rem;
prelude.div = Num.div;
prelude.mod = Num.mod;
prelude.recip = Num.recip;
prelude.pi = Num.pi;
prelude.tau = Num.tau;
prelude.exp = Num.exp;
prelude.sqrt = Num.sqrt;
prelude.ln = Num.ln;
prelude.pow = Num.pow;
prelude.sin = Num.sin;
prelude.tan = Num.tan;
prelude.cos = Num.cos;
prelude.acos = Num.acos;
prelude.asin = Num.asin;
prelude.atan = Num.atan;
prelude.atan2 = Num.atan2;
prelude.truncate = Num.truncate;
prelude.round = Num.round;
prelude.ceiling = Num.ceiling;
prelude.floor = Num.floor;
prelude.isItNaN = Num.isItNaN;
prelude.even = Num.even;
prelude.odd = Num.odd;
prelude.gcd = Num.gcd;
prelude.lcm = Num.lcm;
prelude.VERSION = '1.0.3';
module.exports = prelude;
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}

},{"./Func.js":1,"./List.js":2,"./Num.js":3,"./Obj.js":4,"./Str.js":5}],7:[function(require,module,exports){
// Generated by LiveScript 1.2.0
(function(){
  var ref$, map, filter, flatten, Key, FPS, RES, DIRS, remove, degToRad, Point, Stage, Layer, Centerable, Character, drawArc, drawCircle, drawSemicircle, drawTriangle, R, pick, randomColor, Behavior, Snuffle, Shrine, Blok, makeWall, isInWall, Map, FlowerStack, Flower, Game;
  ref$ = require('prelude-ls'), map = ref$.map, filter = ref$.filter, flatten = ref$.flatten;
  Key = Mousetrap;
  FPS = 30;
  RES = 40;
  DIRS = [['vy', -1, 'up'], ['vx', 1, 'right'], ['vy', 1, 'down'], ['vx', -1, 'left']];
  remove = function(list, member){
    var ii;
    ii = list.indexOf(member);
    if (-1 < ii) {
      return list.splice(ii, 1);
    }
  };
  degToRad = function(it){
    return it * (Math.PI / 180);
  };
  Point = (function(){
    Point.displayName = 'Point';
    var prototype = Point.prototype, constructor = Point;
    function Point(x, y){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.x = x;
      this$.y = y;
      this$.clamped = bind$(this$, 'clamped', prototype);
      this$.midpoint = bind$(this$, 'midpoint', prototype);
      this$.dist = bind$(this$, 'dist', prototype);
      this$.angle = bind$(this$, 'angle', prototype);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.angle = function(oo){
      var dy, dx;
      dy = oo.y - this.y;
      dx = oo.x - this.x;
      return Math.atan2(dy, dx);
    };
    prototype.dist = function(oo){
      return Math.sqrt(Math.pow(this.x - oo.x, 2) + Math.pow(this.y - oo.y, 2));
    };
    prototype.midpoint = function(oo, percent){
      var ang, factor, dx, dy;
      percent == null && (percent = 0.5);
      ang = this.angle(oo);
      factor = percent * this.dist(oo);
      dx = factor * Math.cos(ang);
      dy = factor * Math.sin(ang);
      return new Point(this.x + dx, this.y + dy);
    };
    prototype.clamped = function(){
      return new Point(~~this.x, ~~this.y);
    };
    return Point;
  }());
  Stage = (function(){
    Stage.displayName = 'Stage';
    var prototype = Stage.prototype, constructor = Stage;
    function Stage(){
      this.canvas = document.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      this.children = [];
    }
    prototype.clear = function(){
      return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    prototype.drawLabel = function(x, y, text){
      this.ctx.font = '16pt Arial';
      this.ctx.fillStyle = 'white';
      return this.ctx.fillText(text, x, y);
    };
    prototype.add = function(c){
      return this.children.push(c);
    };
    prototype.remove = function(c){
      return remove(this.children, c);
    };
    prototype.draw = function(){
      var this$ = this;
      this.clear();
      return map(function(it){
        return it.draw(this$.ctx);
      }, this.children);
    };
    return Stage;
  }());
  Layer = (function(){
    Layer.displayName = 'Layer';
    var prototype = Layer.prototype, constructor = Layer;
    function Layer(){
      this.set = bind$(this, 'set', prototype);
      this.clear = bind$(this, 'clear', prototype);
      this.remove = bind$(this, 'remove', prototype);
      this.add = bind$(this, 'add', prototype);
      this.draw = bind$(this, 'draw', prototype);
      this.children = [];
    }
    prototype.draw = function(ctx){
      return map(function(it){
        return it.draw(ctx);
      }, this.children);
    };
    prototype.add = function(c){
      return this.children.push(c);
    };
    prototype.remove = function(c){
      return remove(this.children, c);
    };
    prototype.clear = function(){
      return this.children = [];
    };
    prototype.set = function(it){
      return this.children = [it];
    };
    return Layer;
  }());
  Centerable = {
    center: function(){
      return Point(this.x + this.width / 2, this.y + this.height / 2);
    },
    moveCenterTo: function(point){
      this.x = point.x - this.width / 2;
      return this.y = point.y - this.height / 2;
    }
  };
  Character = (function(){
    Character.displayName = 'Character';
    var prototype = Character.prototype, constructor = Character;
    importAll$(prototype, arguments[0]);
    Character.all = [];
    Character.tagged = function(tag){
      return this.all.filter(function(x){
        return in$(tag, x.tags);
      });
    };
    Character.emptyAll = function(){
      return this.all = [];
    };
    function Character(x, y, size, drawable){
      this.x = x;
      this.y = y;
      this.size = size != null ? size : RES;
      this.intersect = bind$(this, 'intersect', prototype);
      this.exit = bind$(this, 'exit', prototype);
      constructor.all.push(this);
      this.tags = [];
      this.visible = true;
      this.ticks = [];
      this.addTick(this.physics2D);
      this.graphics = drawable || Snuffle('#aaa', '#999', '#666');
      this.width = this.height = this.size;
      this.vx = 0;
      this.vy = 0;
      this.lastPos = Point(0, 0);
      this.lastDir = DIRS[0];
    }
    prototype.physics2D = function(){
      this.x += this.vx;
      if (this.vx && isInWall(this)) {
        this.x -= this.vx;
      }
      this.y += this.vy;
      if (this.vy && isInWall(this)) {
        this.y -= this.vy;
      }
      return this.lastPos = Point(this.x, this.y);
    };
    prototype.exit = function(){
      return remove(constructor.all, this);
    };
    prototype.draw = function(ctx){
      var cx, cy;
      if (!this.visible) {
        return;
      }
      ctx.save();
      cx = this.x;
      cy = this.y;
      if (this.alpha) {
        ctx.globalAlpha = this.alpha;
      }
      if (this.rotation) {
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((Math.PI / 180) * this.rotation);
        this.x = -(this.width / 2);
        this.y = -(this.height / 2);
      }
      this.graphics.draw(ctx, Point(this.x, this.y));
      ctx.restore();
      this.x = cx;
      return this.y = cy;
    };
    prototype.tick = function(){
      var i$, ref$, len$, tt, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.ticks).length; i$ < len$; ++i$) {
        tt = ref$[i$];
        if ('remove-me' === tt.call(this)) {
          results$.push(this.removeTick(tt));
        }
      }
      return results$;
    };
    prototype.addTick = function(f){
      return this.ticks.push(f);
    };
    prototype.removeTick = function(f){
      return remove(this.ticks, f);
    };
    prototype.intersect = function(oo){
      if (!oo) {
        return;
      }
      return this.x <= oo.x + oo.width && oo.x <= this.x + this.width && this.y <= oo.y + oo.height && oo.y <= this.y + this.height;
    };
    prototype.dist = function(oo){
      var mc, oc;
      mc = {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
      oc = {
        x: oo.x + oo.width / 2,
        y: oo.y + oo.height / 2
      };
      return Math.sqrt(Math.pow(mc.x - oc.x, 2) + Math.pow(mc.y - oc.y, 2));
    };
    return Character;
  }(Centerable));
  drawArc = function(color, start, radius, ctx, rads){
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, Math.PI, Math.PI + rads);
    ctx.closePath();
    ctx.fillStyle = color;
    return ctx.fill();
  };
  drawCircle = function(color, start, radius, ctx){
    return drawArc(color, start, radius, ctx, 2 * Math.PI);
  };
  drawSemicircle = function(color, start, radius, ctx){
    return drawArc(color, start, radius, ctx, Math.PI);
  };
  drawTriangle = function(color, start, height, ctx, width){
    if (!width) {
      width = height;
    }
    ctx.fillStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.beginPath();
    ctx.lineTo(start.x + width / 2, start.y + height);
    ctx.lineTo(start.x - width / 2, start.y + height);
    ctx.lineTo(start.x, start.y);
    ctx.closePath();
    return ctx.fill();
  };
  R = function(it){
    return ~~(it * Math.random());
  };
  pick = function(it){
    return it[R(it.length)];
  };
  randomColor = function(){
    var palette;
    palette = '0123456789ABCDEF';
    return '#' + pick(palette) + pick(palette) + pick(palette);
  };
  Behavior = (function(){
    Behavior.displayName = 'Behavior';
    var prototype = Behavior.prototype, constructor = Behavior;
    function Behavior(method, tape){
      this.method = method;
      this.tape = tape != null ? tape : null;
      this.perform = bind$(this, 'perform', prototype);
      this.pointer = 0;
    }
    prototype.perform = function(target){
      if (this.pointer > this.tape.length) {
        return null;
      }
      target[this.method](this.tape[this.pointer]);
      return this.pointer++;
    };
    return Behavior;
  }());
  Snuffle = (function(){
    Snuffle.displayName = 'Snuffle';
    var prototype = Snuffle.prototype, constructor = Snuffle;
    function Snuffle(nose, band, body, height){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.nose = nose;
      this$.band = band;
      this$.body = body;
      this$.height = height != null ? height : RES;
      this$.draw = bind$(this$, 'draw', prototype);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.draw = function(ctx, pos){
      pos = Point(pos.x + this.height / 2, pos.y);
      drawTriangle(this.body, pos, this.height, ctx);
      drawTriangle(this.band, pos, 0.4 * this.height, ctx);
      return drawTriangle(this.nose, pos, 0.3 * this.height, ctx);
    };
    return Snuffle;
  }());
  Shrine = (function(){
    Shrine.displayName = 'Shrine';
    var prototype = Shrine.prototype, constructor = Shrine;
    function Shrine(moon, wedge, size){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.moon = moon;
      this$.wedge = wedge;
      this$.size = size != null
        ? size
        : 4 * RES;
      this$.draw = bind$(this$, 'draw', prototype);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.draw = function(ctx, pos){
      pos = Point(pos.x + this.size / 2, pos.y);
      drawSemicircle(this.moon, pos, this.size / 2, ctx);
      return drawTriangle(this.wedge, pos, -this.size / 2, ctx, this.size);
    };
    return Shrine;
  }());
  Blok = (function(){
    Blok.displayName = 'Blok';
    var prototype = Blok.prototype, constructor = Blok;
    function Blok(hour, decade, instant, x, y, height){
      this.hour = hour;
      this.decade = decade;
      this.instant = instant;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.height = height != null ? height : RES;
      this.draw = bind$(this, 'draw', prototype);
      this.center = bind$(this, 'center', prototype);
      this.width = this.height;
    }
    prototype.center = function(){
      var h2;
      h2 = ~~(this.height / 2);
      return {
        x: this.x + h2,
        y: this.y + h2
      };
    };
    prototype.pos = Point(Blok.x, Blok.y);
    prototype.draw = function(ctx){
      var h2, h4;
      ctx.save();
      ctx.fillStyle = this.decade;
      ctx.fillRect(this.x, this.y, this.height, this.height);
      h2 = ~~(this.height / 2);
      this.drawTriangle(this.hour, this.center(), {
        x: h2,
        y: h2
      }, {
        x: -h2,
        y: h2
      }, ctx);
      this.drawTriangle(this.hour, this.center(), {
        x: h2,
        y: -h2
      }, {
        x: -h2,
        y: -h2
      }, ctx);
      if (this.instant) {
        h4 = ~~(this.height / 4);
        drawCircle(this.instant, this.center(), h4, ctx);
      }
      return ctx.restore();
    };
    prototype.drawCorners = function(ctx){
      var h4, h2;
      h4 = ~~(this.height / 4);
      h2 = ~~(this.height / 2);
      this.drawTriangle(this.hour, {
        x: this.x,
        y: this.y
      }, {
        x: h4,
        y: 0
      }, {
        x: 0,
        y: h2
      });
      this.drawTriangle(this.hour, {
        x: this.x + this.height,
        y: this.y
      }, {
        x: -h4,
        y: 0
      }, {
        x: 0,
        y: h2
      });
      this.drawTriangle(this.hour, {
        x: this.x,
        y: this.y + this.height
      }, {
        x: h4,
        y: 0
      }, {
        x: 0,
        y: -h2
      });
      return this.drawTriangle(this.hour, {
        x: this.x + this.height,
        y: this.y + this.height
      }, {
        x: -h4,
        y: 0
      }, {
        x: 0,
        y: -h2
      });
    };
    prototype.drawTriangle = function(fill, start, diff1, diff2, ctx){
      ctx.moveTo(start.x, start.y);
      ctx.beginPath();
      ctx.lineTo(start.x + diff1.x, start.y + diff1.y);
      ctx.lineTo(start.x + diff2.x, start.y + diff2.y);
      ctx.lineTo(start.x, start.y);
      ctx.closePath();
      ctx.fillStyle = fill;
      return ctx.fill();
    };
    return Blok;
  }());
  makeWall = function(){
    var colors, centerColors, i$, x, lresult$, j$, y, blok, results$ = [];
    colors = ['#aca', '#bdb', '#beb', '#ada', '#cec', '#cfc'];
    centerColors = ['#ccc', '#cfc'];
    for (i$ = 0; i$ < 20; ++i$) {
      x = i$;
      lresult$ = [];
      for (j$ = 0; j$ < 15; ++j$) {
        y = j$;
        lresult$.push(blok = new Blok(pick(colors), pick(colors), pick(centerColors), x * RES, y * RES));
      }
      results$.push(lresult$);
    }
    return results$;
  };
  isInWall = function(oo){
    var walls, collisions;
    walls = window.game.world.bg.children[0].walls;
    collisions = filter(oo.intersect, walls);
    if (collisions.length > 0) {
      return true;
    }
  };
  Map = (function(){
    Map.displayName = 'Map';
    var prototype = Map.prototype, constructor = Map;
    function Map(mapping){
      var colors, centerColors, m, res$, i$, x, lresult$, j$, y, blok, this$ = this instanceof ctor$ ? this : new ctor$;
      this$.mapping = mapping;
      this$.draw = bind$(this$, 'draw', prototype);
      colors = ['#aca', '#bdb', '#beb', '#ada', '#cec', '#cfc'];
      centerColors = ['#ccc', '#cfc'];
      m = this$.mapping;
      res$ = [];
      for (i$ = 0; i$ < 20; ++i$) {
        x = i$;
        lresult$ = [];
        for (j$ = 0; j$ < 15; ++j$) {
          y = j$;
          m = this$.mapping[x][y];
          blok = new Blok(m[0], m[1], m[2], x * RES, y * RES);
          blok.solid = m[3];
          lresult$.push(blok);
        }
        res$.push(lresult$);
      }
      this$.cells = res$;
      this$.walls = filter(function(it){
        return it.solid === true;
      }, flatten(this$.cells));
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.draw = function(ctx){
      return map(function(it){
        return it.draw(ctx);
      }, flatten(this.cells));
    };
    return Map;
  }());
  FlowerStack = (function(){
    FlowerStack.displayName = 'FlowerStack';
    var prototype = FlowerStack.prototype, constructor = FlowerStack;
    function FlowerStack(size){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      size == null && (size = RES * 2);
      this$.draw = bind$(this$, 'draw', prototype);
      this$.flowers = [Flower.random(size), Flower.random(~~(size * 0.8)), Flower.random(~~(size * 0.5))];
      console.log(this$.flowers);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.draw = function(ctx, pos){
      return map(function(it){
        return it.draw(ctx, pos);
      }, this.flowers);
    };
    return FlowerStack;
  }());
  Flower = (function(){
    Flower.displayName = 'Flower';
    var prototype = Flower.prototype, constructor = Flower;
    Flower.colors = ['black', 'red', 'green', 'blue', 'purple', 'orange', 'white', 'cyan'];
    Flower.random = function(size){
      var color, petals, s4, cp1, cp2;
      size == null && (size = RES);
      color = pick(Flower.colors);
      petals = 3 * (R(8) + 1);
      s4 = ~~(size / 4);
      cp1 = Point(R(size / 3), R(size / 4) + s4);
      cp2 = Point(size - R(size / 2), R(size / 4) + s4);
      return Flower(color, petals, cp1, cp2, size);
    };
    function Flower(color, petals, cp1, cp2, size){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.color = color;
      this$.petals = petals;
      this$.cp1 = cp1;
      this$.cp2 = cp2;
      this$.size = size != null ? size : RES;
      this$.draw = bind$(this$, 'draw', prototype);
      this$.itos = bind$(this$, 'itos', prototype);
      this$.opacity = 0.3;
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.itos = function(val, frac){
      frac == null && (frac = 1);
      return val * (this.size / frac);
    };
    prototype.draw = function(ctx, pos){
      var i$, to$, p;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(pos.x, pos.y);
      ctx.moveTo(0, 0);
      for (i$ = 0, to$ = this.petals; i$ < to$; ++i$) {
        p = i$;
        ctx.beginPath();
        ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.size, 0);
        ctx.bezierCurveTo(this.cp2.x, -this.cp2.y, this.cp1.x, -this.cp1.y, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.rotate(degToRad(360 / this.petals));
      }
      return ctx.restore();
    };
    return Flower;
  }());
  Game = (function(){
    Game.displayName = 'Game';
    var prototype = Game.prototype, constructor = Game;
    function Game(width, height, fps){
      var i$, len$, solid, empty, mapping, ref$, mapping2, mapping3, this$ = this;
      this.width = width;
      this.height = height;
      this.fps = fps;
      this.loop = bind$(this, 'loop', prototype);
      this.screenSwap = bind$(this, 'screenSwap', prototype);
      this.frame = 0;
      this.pause = false;
      this.over = false;
      this.world = new Stage;
      this.world.add(new Layer);
      this.world.add(new Layer);
      this.world.add(new Layer);
      this.world.bg = this.world.children[0];
      this.world.ground = this.world.children[1];
      this.world.fg = this.world.children[2];
      Key.bind('space', function(){
        return this.pause = !this.pause;
      });
      Key.bind('a', function(){
        var s;
        s = new Character(10 * RES, 10 * RES, 4 * RES, Shrine('#39f', '#cc6'));
        return this$.world.ground.add(s);
      });
      Key.bind('z', function(){
        var f;
        f = new Character(this$.player.x, this$.player.y, 4 * RES, new FlowerStack);
        return this$.world.ground.add(f);
      });
      this.loopInstance = setInterval(this.loop, 1000 / this.fps);
      this.player = new Character(3 * RES, 3 * RES, RES, Snuffle('#aaa', '#000', '#aaa'));
      for (i$ = 0, len$ = DIRS.length; i$ < len$; ++i$) {
        (fn$.call(this, DIRS[i$]));
      }
      solid = ['black', 'black', 'white', true];
      empty = ['#eee', '#ddd', '#ddd', false];
      mapping = [[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]].concat([ref$ = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty], ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$]).concat([[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]]);
      this.world.bg.add(Map(mapping));
      this.world.fg.add(this.player);
      mapping = [[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]].concat([ref$ = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty], ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$]).concat([[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]]);
      mapping2 = [[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]].concat([ref$ = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty], ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$]).concat([ref$ = [solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid], ref$]);
      mapping3 = [[solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid]].concat([ref$ = [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty], ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$, ref$]).concat([ref$ = [solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid, solid], ref$, ref$]);
      this.worldMap = [[mapping, mapping2, mapping3]];
      this.screen = Point(0, 0);
      function fn$(dd){
        var this$ = this;
        Key.bind(dd[2], function(){
          return this$.player[dd[0]] = 6 * dd[1];
        });
        Key.bind(dd[2], function(){
          return this$.player[dd[0]] = 0;
        }, 'keyup');
      }
    }
    prototype.screenSwap = function(){
      if (this.player.y < 0) {
        this.screen = Point(this.screen.x, this.screen.y - 1);
        this.world.bg.set(Map(this.worldMap[this.screen.x][this.screen.y]));
        this.player.y = this.height - this.player.height - 1;
      }
      if (this.player.y + this.player.height > this.height) {
        this.screen = Point(this.screen.x, this.screen.y + 1);
        this.world.bg.set(Map(this.worldMap[this.screen.x][this.screen.y]));
        return this.player.y = 1;
      }
    };
    prototype.loop = function(){
      var i$, ref$, len$, cc;
      if (this.pause) {
        return;
      }
      this.frame++;
      for (i$ = 0, len$ = (ref$ = Character.all).length; i$ < len$; ++i$) {
        cc = ref$[i$];
        if (cc != null) {
          cc.tick();
        }
      }
      this.screenSwap();
      this.world.draw();
      if (this.over) {
        this.world.drawLabel(300, 230, "GAME OVER");
        return this.world.drawLabel(260, 260, "push r to restart");
      }
    };
    return Game;
  }());
  window.game = new Game(800, 600, FPS);
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);

},{"prelude-ls":6}]},{},[7])
;