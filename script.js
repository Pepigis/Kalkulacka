const inputDisplay = document.getElementById('calculator-input');
const outputDisplay = document.getElementById('calculator-output');
const buttons = document.querySelectorAll('.calculator-buttons button');
const clearBtn = document.getElementById('clear-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const equalBtn = document.getElementById('equal-sign');
const historyDisplay = document.getElementById('history-display');
const clearHistoryBtn = document.getElementById('clear-history-btn');

let input = '';
let output = '0';
let lastResult = '0';
let history = [];


const OPERATORS = ['+', '-', '*', '/', '^'];
const DECIMAL = '.';

function saveHistory() {
  localStorage.setItem('calc-history', JSON.stringify(history));
}
function loadHistory() {
  const h = localStorage.getItem('calc-history');
  history = h ? JSON.parse(h) : [];
}

function renderHistory() {
  historyDisplay.innerHTML = '';
  if (history.length === 0) {
    historyDisplay.innerHTML = '<p style="text-align:center; color:gray;">No history</p>';
    return;
  }
  history.slice().reverse().forEach(entry => {
    const div = document.createElement('div');
    div.innerHTML = `<span style="color:gray">${entry.input}</span> <br>= <span style="font-weight:bold">${entry.output}</span><hr>`;
    historyDisplay.appendChild(div);
  });
}

function safeEval(expr) {
    expr = expr.replace(/\^/g, '**');
    if (!/^[-+*/().\d\s*]+$/.test(expr)) {
      throw new Error('Invalid characters');
    }
    if (/[^0-9)][+\-/*.]{2,}/.test(expr.replace(/\*\*/g, ''))) {
      throw new Error('Invalid sequence');
    }
    return Function('"use strict";return (' + expr + ')')();
  }
  
  function useResultIfInputEmpty(op) {
    if (input === '' && OPERATORS.includes(op)) {
      input = lastResult !== undefined ? lastResult : '0';
    }
  }