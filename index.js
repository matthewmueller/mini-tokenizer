/**
 * Module Dependencies
 */

var rrep = /(\$(`|&|'|\d+))/g;
var slice = [].slice;
var noop = function(m) { return m[0]; }

/**
 * Create a tokenizer
 *
 * @param {Regex} regex
 * @param {String|Function} rep
 * @return {Function}
 */

function tokens(regex, rep) {
  rep = rep || noop;
  rep = 'function' == typeof rep ? rep : compile(rep);

  return function(str) {
    var toks = [];

    str.replace(regex, function() {
      var args = slice.call(arguments);
      toks.push(rep(args));
    });

    return toks;
  };
}

/**
 * Compile the replacer
 *
 * @param {String} str
 * @return {String}
 */

function compile(str) {
  var expr = str.replace(rrep, function(m) {
    var out = '\' + $[';
    out += '&' == m[1] ? 0 : m[1];
    out += '] + \'';
    return out;
  })

  expr = '\'' + expr + '\'';
  return new Function('$', 'return ' + expr);
}

// U.S. telephone numbers
var rtelephone = /(\d{3})[\-\. ]?(\d{3})[\-\. ](\d{4})/g
var input = '782.312.5313, 902 534 6245, 324-342-6666';

// compile the tokenizer
var fn = tokens(rtelephone, '+1 ($1) $2-$3');
console.log(fn(input)); // 

