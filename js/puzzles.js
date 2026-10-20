/* Pure rules shared by the UI and the optional Node verification. */
(function (root) {
  'use strict';
  function check(order, puzzle) {
    if (order.length !== puzzle.flowers.length || new Set(order).size !== order.length || order.some(x => !puzzle.flowers.includes(x))) return { correct: false, matched: 0, total: puzzle.rules.length };
    const at = name => order.indexOf(name);
    const matches = puzzle.rules.map(rule => {
      switch (rule.type) {
        case 'position': return at(rule.flower) === rule.value;
        case 'notPosition': return at(rule.flower) !== rule.value;
        case 'notEdge': return at(rule.flower) > 0 && at(rule.flower) < order.length - 1;
        case 'before': return at(rule.left) < at(rule.right);
        case 'adjacent': return at(rule.left) + 1 === at(rule.right);
        case 'gap': return Math.abs(at(rule.left) - at(rule.right)) - 1 === rule.value;
        default: return false;
      }
    });
    return { correct: matches.every(Boolean), matched: matches.filter(Boolean).length, total: matches.length };
  }
  root.GardenPuzzles = { check };
})(typeof window !== 'undefined' ? window : globalThis);
