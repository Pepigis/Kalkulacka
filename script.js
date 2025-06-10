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

  function handleButton(value, className) {
    if (value === 'C') {
      input = input.trim();
      if (input.length > 0) {
        if (/\s$/.test(input)) {
          input = input.slice(0, input.lastIndexOf(' '));
        } else {
          input = input.slice(0, -1);
        }
      }
    } else if (value === 'CE') {
      input = '';
      output = '0';
    } else if (value === '=') {
      if (!input) return;
      try {
        const result = safeEval(input);
        output = String(result);
        lastResult = output;
        history.push({ input: input, output: output });
        saveHistory();
        renderHistory();
        input = '';
      } catch (e) {
        output = 'Error';
      }
    } else if (OPERATORS.includes(value)) {
      useResultIfInputEmpty(value);
      if (input === '' && value !== '-') return;
      if (input.slice(-1) === ' ' || input === '-') return;
      input += ' ' + value + ' ';
    } else if (value === '(' || value === ')') {
      input += value;
    } else if (value === DECIMAL) {
      const parts = input.split(/[\+\-\*\/\^ ]/);
      const last = parts[parts.length - 1];
      if (!last.includes('.')) {
        input += value;
      }
    } else if (/^\d$/.test(value)) {
      input += value;
    }
    updateDisplay();
  }

  function updateDisplay() {
    inputDisplay.textContent = input || '0';
    outputDisplay.textContent = output;
  }

  function handleKeyboard(e) {
    const key = e.key;
    if (/\d/.test(key)) {
      handleButton(key);
    } else if (OPERATORS.includes(key)) {
      handleButton(key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleButton('=');
    } else if (key === 'Backspace') {
      handleButton('C');
    } else if (key === 'Escape') {
      handleButton('CE');
    } else if (key === DECIMAL) {
      handleButton(DECIMAL);
    } else if (key === '(' || key === ')') {
      handleButton(key);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => handleButton(btn.value, btn.className));
  });