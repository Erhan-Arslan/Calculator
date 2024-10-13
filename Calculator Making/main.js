// Get the display buttons
const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const operators = ["%", "*", "/", "-", "+"];
let output = "";
let history = [];
let sinCosTimeout;
let sinCosCount = 0;
let currentValue = ""; // To store the last value

// Function to calculate based on button value
const calculate = (btnValue) => {
  if (btnValue === "=") {
    try {
      history.push(output);
      output = evaluateExpression(output);
    } catch (error) {
      output = "Error";
    }
  } else if (btnValue === "AC") {
    history.push(output);
    output = "";
  } else if (btnValue === "DEL") {
    history.push(output);
    output = output.toString().slice(0, -1);
  } else if (btnValue === "UNDO") {
    if (history.length > 0) {
      output = history.pop();
    }
  } else if (btnValue === "sqrt") {
    history.push(output);
    output = Math.sqrt(parseFloat(output)).toString();
  } else if (btnValue === "sin") {
    history.push(output);
    output = Math.sin(parseFloat(currentValue) * (Math.PI / 180)).toString(); // Convert degrees to radians
  } else if (btnValue === "cos") {
    history.push(output);
    output = Math.cos(parseFloat(currentValue) * (Math.PI / 180)).toString(); // Convert degrees to radians
  } else {
    if (output === "" && operators.includes(btnValue)) return;
    output += btnValue;
    currentValue = output;
  }
  display.value = output;
};

// Function to evaluate mathematical expression
const evaluateExpression = (expression) => {
  return eval(expression.replace(/%/g, "/100"));
};

// Add click event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const btnValue = e.target.dataset.value;

    // If we click on the trig button, open the menu
    if (btnValue === "Sin/Cos") {
      const dropdownContent = document.querySelector(".dropdown-content");
      dropdownContent.classList.toggle("show");
    } else {
      calculate(btnValue);
    }
  });
});

// Document click event to close dropdown if clicked outside
document.addEventListener("click", (e) => {
  const dropdownContent = document.querySelector(".dropdown-content");
  if (!e.target.closest(".dropdown")) {
    dropdownContent.classList.remove("show");
  }
});

// Add keyboard event listener for numeric and operator keys
document.addEventListener("keydown", (e) => {
  const key = e.key;
  // Check if the key is a number, operator, or control key (Enter, Backspace, etc.)
  if (
    !isNaN(key) ||
    operators.includes(key) ||
    key === "Enter" ||
    key === "Backspace" ||
    key === "," ||
    key === "%"
  ) {
    let btnValue;
    if (key === "Enter") {
      btnValue = "=";
    } else if (key === "Backspace") {
      btnValue = "DEL";
    } else {
      btnValue = key;
    }
    calculate(btnValue);
  } else if (key === "c" || key === "C") {
    calculate("AC");
  } else if (key === "s" || key === "S") {
    // Handle single and double press of "S" key
    sinCosCount++;
    clearTimeout(sinCosTimeout);
    sinCosTimeout = setTimeout(() => {
      if (sinCosCount === 1) {
        calculate("sin");
      } else if (sinCosCount === 2) {
        calculate("cos");
      }
      sinCosCount = 0; // Reset the count
    }, 300); // 300ms delay to distinguish between single and double press
  }
});
