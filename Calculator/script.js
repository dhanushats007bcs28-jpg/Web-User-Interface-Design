
const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForOperand = false;
let justCalculated = false;

function updateDisplay() {
    display.textContent = current;
}

function inputNumber(number) {
    if (current === "Error" || waitingForOperand || justCalculated) {
        current = number;
        waitingForOperand = false;
        justCalculated = false;
    } else if (current === "0") {
        current = number;
    } else if (current.replace("-", "").length < 16) {
        current += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (current === "Error" || waitingForOperand || justCalculated) {
        current = "0.";
        waitingForOperand = false;
        justCalculated = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? null : a / b;
        default: return b;
    }
}

function formatNumber(number) {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(12)));
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const inputValue = Number(current);

    if (operator && !waitingForOperand) {
        const result = calculate(previous, inputValue, operator);

        if (result === null) {
            current = "Error";
            previous = null;
            operator = null;
            expression.textContent = "Cannot divide by zero";
            updateDisplay();
            return;
        }

        current = formatNumber(result);
        updateDisplay();
        previous = Number(current);
    } else {
        previous = inputValue;
    }

    operator = nextOperator;
    waitingForOperand = true;
    justCalculated = false;
    expression.textContent = `${current} ${symbol(nextOperator)}`;
}

function symbol(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op] || op;
}

function showResult() {
    if (!operator || previous === null || current === "Error") return;

    const first = previous;
    const second = Number(current);
    const op = operator;
    const result = calculate(first, second, op);

    expression.textContent =
        `${formatNumber(first)} ${symbol(op)} ${formatNumber(second)} =`;

    if (result === null) {
        current = "Error";
        expression.textContent = "Cannot divide by zero";
    } else {
        current = formatNumber(result);
    }

    previous = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = true;
    updateDisplay();
}

function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = false;
    expression.textContent = "";
    updateDisplay();
}

function changeSign() {
    if (current === "Error" || current === "0") return;

    current = current.startsWith("-")
        ? current.slice(1)
        : "-" + current;

    updateDisplay();
}

function percentage() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    updateDisplay();
}

function backspace() {
    if (current === "Error" || waitingForOperand || justCalculated) {
        current = "0";
        waitingForOperand = false;
        justCalculated = false;
    } else if (current.length > 1) {
        current = current.slice(0, -1);
        if (current === "-") current = "0";
    } else {
        current = "0";
    }

    updateDisplay();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear": clearCalculator(); break;
            case "decimal": inputDecimal(); break;
            case "equals": showResult(); break;
            case "sign": changeSign(); break;
            case "percent": percentage(); break;
            case "backspace": backspace(); break;
        }
    }
});

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape" || key === "Delete") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

document.getElementById("themeBtn").addEventListener("click", function () {
    document.body.classList.toggle("light");
    this.textContent = document.body.classList.contains("light") ? "☾" : "☀";
});

updateDisplay();