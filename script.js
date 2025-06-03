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