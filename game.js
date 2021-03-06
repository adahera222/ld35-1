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
  var ref$, concat, zipWith, map, filter, flatten, Key, FPS, RES, DIRS, remove, fill, flop, clip, stamp, gridAppend, degToRad, Point, Stage, Layer, Centerable, Character, Shard, Critter, drawArc, drawCircle, drawSemicircle, drawTriangle, R, pick, randomColor, Behavior, Snuffle, Shrine, Blok, emptyBlok, solidBlok, isInWall, Map, FlowerStack, Flower, Room, Game, restart, getCodeword, explode;
  ref$ = require('prelude-ls'), concat = ref$.concat, zipWith = ref$.zipWith, map = ref$.map, filter = ref$.filter, flatten = ref$.flatten;
  Key = Mousetrap;
  FPS = 30;
  RES = 20;
  DIRS = [['vy', -1, 'up'], ['vx', 1, 'right'], ['vy', 1, 'down'], ['vx', -1, 'left']];
  remove = function(list, member){
    var ii;
    ii = list.indexOf(member);
    if (-1 < ii) {
      return list.splice(ii, 1);
    }
  };
  fill = function(filler, length){
    var i$, z, results$ = [];
    if (!filler.slice) {
      return repeatArray$([filler], length);
    }
    for (i$ = 0; i$ < length; ++i$) {
      z = i$;
      results$.push(filler.slice(0));
    }
    return results$;
  };
  flop = function(a){
    var width, height, grid, i$, x, j$, y;
    width = a.length;
    height = a[0].length;
    grid = fill(fill(0, width), height);
    for (i$ = 0; i$ < width; ++i$) {
      x = i$;
      for (j$ = 0; j$ < height; ++j$) {
        y = j$;
        grid[y][x] = a[x][y];
      }
    }
    return grid;
  };
  clip = function(a, x, y, w, h){
    var grid, i$, ii, j$, jj;
    grid = fill(fill(0, height), width);
    for (i$ = 0; i$ < w; ++i$) {
      ii = i$;
      for (j$ = 0; j$ < h; ++j$) {
        jj = j$;
        grid[ii][jj] = a[x + ii][y + jj];
      }
    }
    return grid;
  };
  stamp = function(src, dst, x, y, w, h){
    var image, i$, to$, ii, j$, to1$, jj;
    image = clip(src, 0, 0, w, h);
    for (i$ = 0, to$ = image.length; i$ < to$; ++i$) {
      ii = i$;
      for (j$ = 0, to1$ = image[0].length; j$ < to1$; ++j$) {
        jj = j$;
        dst[x + ii][y + jj] = image[ii][jj];
      }
    }
    return dst;
  };
  gridAppend = function(a, b){
    return zipWith(function(x, y){
      return x.concat(y);
    }, a, b);
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
      this$.eq = bind$(this$, 'eq', prototype);
      this$.toGrid = bind$(this$, 'toGrid', prototype);
      this$.grid = bind$(this$, 'grid', prototype);
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
      return Point(~~this.x, ~~this.y);
    };
    prototype.grid = function(){
      return Point(~~(this.x / RES), ~~(this.y / RES));
    };
    prototype.toGrid = function(){
      var gg;
      gg = this.grid();
      return Point(gg.x * RES, gg.y * RES);
    };
    prototype.eq = function(oo){
      return oo.x === this.x && oo.y === this.y;
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
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.x = x;
      this$.y = y;
      this$.size = size != null ? size : RES;
      this$.tagged = bind$(this$, 'tagged', prototype);
      this$.intersect = bind$(this$, 'intersect', prototype);
      this$.exit = bind$(this$, 'exit', prototype);
      this$.pos = bind$(this$, 'pos', prototype);
      constructor.all.push(this$);
      this$.tags = [];
      this$.visible = true;
      this$.ticks = [];
      this$.addTick(this$.physics2D);
      this$.graphics = drawable || Snuffle('#aaa', '#999', '#666');
      this$.width = this$.height = this$.size;
      this$.vx = 0;
      this$.vy = 0;
      this$.lastPos = Point(0, 0);
      this$.lastDir = DIRS[0];
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.pos = function(){
      return Point(this.x, this.y);
    };
    prototype.physics2D = function(){
      this.x += this.vx;
      this.y += this.vy;
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
    prototype.tagged = function(tag){
      return -1 < this.tags.indexOf(tag);
    };
    return Character;
  }(Centerable));
  Shard = (function(superclass){
    var prototype = extend$((import$(Shard, superclass).displayName = 'Shard', Shard), superclass).prototype, constructor = Shard;
    Shard.DIRS = {
      0: {
        x: 0,
        y: -1,
        deg: 0
      },
      90: {
        x: 1,
        y: 0,
        deg: 90
      },
      180: {
        x: 0,
        y: 1,
        deg: 180
      },
      270: {
        x: -1,
        y: 0,
        deg: 270
      }
    };
    Shard.color = function(){
      return pick(['red', 'green', 'blue', 'purple', 'orange', 'white', 'cyan']);
    };
    function Shard(x, y, dir){
      var cc, this$ = this instanceof ctor$ ? this : new ctor$;
      this$.explodeCheck = bind$(this$, 'explodeCheck', prototype);
      this$.wraparound = bind$(this$, 'wraparound', prototype);
      cc = constructor.color();
      Shard.superclass.call(this$, x, y, RES, Snuffle(cc, 'white', cc));
      this$.rotation = dir;
      this$.speed = 5;
      this$.tags.push('shard');
      this$.vx = constructor.DIRS[dir].x * this$.speed;
      this$.vy = constructor.DIRS[dir].y * this$.speed;
      this$.addTick(this$.explodeCheck);
      this$.addTick(this$.wraparound);
      this$.startTick = window.game.frame;
      this$.addTick(function(){
        if (window.game.frame - this$.startTick > 15) {
          window.game.world.fg.remove(this$);
          this$.ticks = [];
          return this$.exit();
        }
      });
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.wraparound = function(){
      switch (false) {
      case !(this.x < 0):
        return this.x = this.speed + window.game.width - this.width;
      case !(this.x + this.width > window.game.width):
        return this.x = -this.speed;
      case !(this.y < 0):
        return this.y = this.speed + window.game.height - this.height;
      case !(this.y + this.height > window.game.height):
        return this.y = -this.speed;
      }
    };
    prototype.physics2D = function(){
      this.x += this.vx;
      return this.y += this.vy;
    };
    prototype.explodeCheck = function(){
      var pg, cell, ref$;
      if (!this.pos().eq(this.pos().toGrid())) {
        return;
      }
      pg = this.pos().grid();
      cell = (ref$ = window.game.world.bg.children[0].cells[pg.x]) != null ? ref$[pg.y] : void 8;
      if (cell && cell.solid) {
        window.game.world.bg.children[0].cells[pg.x][pg.y] = emptyBlok(this.x, this.y);
        explode(this.x, this.y);
        return window.game.world.fg.remove(this);
      }
    };
    return Shard;
  }(Character));
  Critter = (function(superclass){
    var prototype = extend$((import$(Critter, superclass).displayName = 'Critter', Critter), superclass).prototype, constructor = Critter;
    Critter.commands = 'fffbrrll..';
    Critter.randomPattern = function(){
      var i$, x, results$ = [];
      for (i$ = 0; i$ < 10; ++i$) {
        x = i$;
        results$.push(pick(this.commands));
      }
      return results$;
    };
    Critter.DIRS = {
      0: {
        x: 0,
        y: -1,
        deg: 0
      },
      90: {
        x: 1,
        y: 0,
        deg: 90
      },
      180: {
        x: 0,
        y: 1,
        deg: 180
      },
      270: {
        x: -1,
        y: 0,
        deg: 270
      }
    };
    function Critter(){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.move = bind$(this$, 'move', prototype);
      this$.stop = bind$(this$, 'stop', prototype);
      this$.orientation = bind$(this$, 'orientation', prototype);
      this$.wander = bind$(this$, 'wander', prototype);
      this$.rotationTick = bind$(this$, 'rotationTick', prototype);
      Critter.superclass.apply(this$, arguments);
      this$.rotation = pick(constructor.DIRS).deg;
      this$.index = 0;
      this$.patterns = [constructor.randomPattern(), constructor.randomPattern()];
      this$.addTick(this$.wander);
      this$.speed = 10;
      this$.addTick(this$.rotationTick);
      this$.activePattern = pick(this$.patterns);
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.rotationTick = function(){
      var ref$;
      return this.rotation += ((~~this.va) % (ref$ = 360) + ref$) % ref$;
    };
    prototype.wander = function(){
      if (window.game.frame % (FPS / 2) !== 0) {
        return;
      }
      if (this.index > this.activePattern.length) {
        this.index = 0;
        this.activePattern = pick(this.patterns);
      }
      this.move(this.activePattern[this.index]);
      return this.index++;
    };
    prototype.orientation = function(rotation){
      var ind, ref$;
      rotation == null && (rotation = this.rotation);
      ind = ((~~((rotation + 44) / 90)) % (ref$ = 4) + ref$) % ref$;
      return constructor.DIRS[ind * 90];
    };
    prototype.stop = function(){
      this.vx = 0;
      this.vy = 0;
      return this.va = 0;
    };
    prototype.move = function(dir){
      var ori;
      ori = this.orientation();
      this.stop();
      switch (dir) {
      case 'f':
        this.vx = ori.x * this.speed;
        return this.vy = ori.y * this.speed;
      case 'b':
        this.vx = -ori.x * this.speed;
        return this.vy = -ori.y * this.speed;
      case 'r':
        return this.va = 90 / (FPS / 2);
      case 'l':
        return this.va = -90 / (FPS / 2);
      default:
        return 'nothing';
      }
    };
    return Critter;
  }(Character));
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
      ctx.save();
      ctx.globalAlpha = 0.9;
      drawSemicircle(this.moon, pos, this.size / 2, ctx);
      drawTriangle(this.wedge, pos, -this.size / 2, ctx, this.size);
      return ctx.restore();
    };
    return Shrine;
  }());
  Blok = (function(){
    Blok.displayName = 'Blok';
    var prototype = Blok.prototype, constructor = Blok;
    function Blok(hour, decade, instant, x, y, solid, height){
      this.hour = hour;
      this.decade = decade;
      this.instant = instant;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.solid = solid != null ? solid : false;
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
  emptyBlok = function(x, y){
    return new Blok('#ddd', '#ccc', '#ccc', x * RES, y * RES, false);
  };
  solidBlok = function(x, y){
    return new Blok('black', 'black', 'white', x * RES, y * RES, true);
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
      var colors, centerColors, res$, i$, to$, x, lresult$, j$, to1$, y, m, blok, this$ = this instanceof ctor$ ? this : new ctor$;
      this$.mapping = mapping;
      this$.updateWalls = bind$(this$, 'updateWalls', prototype);
      this$.draw = bind$(this$, 'draw', prototype);
      colors = ['#aca', '#bdb', '#beb', '#ada', '#cec', '#cfc'];
      centerColors = ['#ccc', '#cfc'];
      res$ = [];
      for (i$ = 0, to$ = this$.mapping.length; i$ < to$; ++i$) {
        x = i$;
        lresult$ = [];
        for (j$ = 0, to1$ = this$.mapping[0].length; j$ < to1$; ++j$) {
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
    prototype.updateWalls = function(){
      return this.walls = filter(function(it){
        return it.solid === true;
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
      this$.scale = bind$(this$, 'scale', prototype);
      this$.draw = bind$(this$, 'draw', prototype);
      this$.flowers = [Flower.random(size), Flower.random(~~(size * 0.8)), Flower.random(~~(size * 0.5))];
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.draw = function(ctx, pos){
      ctx.save();
      if (this.scale) {
        ctx.scale(this.scale, this.scale);
      }
      map(function(it){
        return it.draw(ctx, pos);
      }, this.flowers);
      return ctx.restore();
    };
    prototype.scale = function(scale){
      return map(function(it){
        return it.scale = scale;
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
      if (this.scale) {
        ctx.scale(this.scale, this.scale);
      }
      ctx.rotate(degToRad(window.game.frame % (360 * 3)));
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
  Room = (function(){
    Room.displayName = 'Room';
    var prototype = Room.prototype, constructor = Room;
    Room.solid = ['black', 'black', 'white', true];
    Room.empty = ['#ddd', '#ccc', null, false];
    function Room(width, height, game){
      var choices, i$, to$, x, j$, to1$, y, this$ = this instanceof ctor$ ? this : new ctor$;
      width == null && (width = 20);
      height == null && (height = 15);
      game == null && (game = null);
      this$.mapping = fill(fill(constructor.empty, width), height);
      choices = (repeatArray$([constructor.empty], R(4) + 5)).concat([constructor.solid]);
      for (i$ = 0, to$ = this$.mapping.length; i$ < to$; ++i$) {
        x = i$;
        for (j$ = 0, to1$ = this$.mapping[0].length; j$ < to1$; ++j$) {
          y = j$;
          this$.mapping[x][y] = pick(choices);
          if (game && this$.mapping[x][y][3] === true) {
            game.wallCount++;
          }
        }
      }
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    return Room;
  }());
  Game = (function(){
    Game.displayName = 'Game';
    var prototype = Game.prototype, constructor = Game;
    function Game(width, height, fps){
      var i$, len$, room, this$ = this;
      this.width = width;
      this.height = height;
      this.fps = fps;
      this.loop = bind$(this, 'loop', prototype);
      this.loadRoom = bind$(this, 'loadRoom', prototype);
      Math.seedrandom(getCodeword());
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
      this.loopInstance = setInterval(this.loop, 1000 / this.fps);
      Key.bind('z', function(){
        var wallCount, pos, cells;
        wallCount = this$.wallCount;
        pos = this$.player.center().toGrid();
        cells = flatten(this$.world.children[0].children[0].cells);
        this$.player.visible = false;
        explode(pos.x, pos.y);
        this$.player.addTick(function(){
          var currentWallCount;
          if (Character.tagged('shard').length < 1) {
            this$.player.ticks = [];
            currentWallCount = filter(function(it){
              return it.solid;
            }, flatten(this$.world.bg.children[0].cells)).length;
            if (currentWallCount === 0) {
              return alert("PERFECT! All " + wallCount + " cells destroyed!");
            } else {
              return alert(("Destroyed " + (wallCount - currentWallCount) + "/" + wallCount + " walls!") + "\nPush SPACE to try again!");
            }
          }
        });
        return Key.bind('z', function(){});
      });
      this.player = new Character(this.width / 2, this.height / 2, RES, Snuffle('red', 'black', 'red'));
      this.player.speed = RES;
      for (i$ = 0, len$ = DIRS.length; i$ < len$; ++i$) {
        (fn$.call(this, DIRS[i$]));
      }
      this.wallCount = 0;
      room = Room(30, 30, this);
      this.loadRoom(room);
      this.world.fg.add(this.player);
      function fn$(dd){
        var this$ = this;
        Key.bind(dd[2], function(it){
          it.preventDefault();
          this$.player[dd[0]] = 6 * dd[1];
          return false;
        });
        Key.bind(dd[2], function(){
          return this$.player[dd[0]] = 0;
        }, 'keyup');
      }
    }
    prototype.loadRoom = function(room){
      var ff;
      this.world.bg.set(Map(room.mapping));
      this.world.ground.clear();
      if (this.player.flower) {
        if (room.base) {
          console.log("Flower collected!");
          ff = this.player.flower;
          ff.ticks = [];
          room.flowers.push(ff);
          ff.x = this.width / 4 + (1 + ff.origin.x) * (this.width / (2 * 9)) - RES / 2;
          ff.y = this.height / 4 + (1 + ff.origin.y) * (this.height / (2 * 9));
          this.player.flower = false;
        } else {
          this.world.ground.add(this.player.flower);
        }
      }
      if (room.shrine) {
        this.world.ground.add(room.shrine);
      }
      if (room.flower) {
        this.world.ground.add(room.flower);
      }
      if (room.flowers) {
        return map(this.world.ground.add, room.flowers);
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
      this.world.draw();
      if (this.over) {
        this.world.drawLabel(300, 230, "GAME OVER");
        return this.world.drawLabel(260, 260, "push r to restart");
      }
    };
    return Game;
  }());
  restart = function(it){
    if (it != null) {
      it.preventDefault();
    }
    if (window.game) {
      clearInterval(window.game.loopInstance);
    }
    Character.emptyAll();
    Key.reset();
    Key.bind('space', restart);
    window.game = new Game(600, 600, FPS);
    return false;
  };
  getCodeword = function(){
    if (location.hash.length < 1) {
      location.hash = prompt("What are you trying to destroy?");
    }
    return location.hash;
  };
  explode = function(x, y){
    var dir, results$ = [];
    for (dir in Shard.DIRS) {
      results$.push(window.game.world.fg.add(new Shard(x, y, dir)));
    }
    return results$;
  };
  restart();
  function repeatArray$(arr, n){
    for (var r = []; n > 0; (n >>= 1) && (arr = arr.concat(arr)))
      if (n & 1) r.push.apply(r, arr);
    return r;
  }
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
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

},{"prelude-ls":6}]},{},[7])
;