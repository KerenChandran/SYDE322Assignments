
// creating variables and list of operations
var operations = ['+', '-', '*', '/'];
var decimalAdded = false;
var keys = document.querySelectorAll('#frame span');


// Printing keys and operations on screen
for(var i = 0; i < keys.length; i++) {
  keys[i].onclick = function(e) {
  var input = document.querySelector('.screen');
  var inputValue = input.innerHTML;
  var buttonValue = this.innerHTML;
  // Erasing screen when Clr is pressed
  if(buttonValue == 'Clr') {
    input.innerHTML = '';
    decimalAdded = false;
  }

  // Calculating when eval is pressed
  else if(buttonValue == '=') {
    var eq = inputValue;
    var lastCharacter = eq[eq.length - 1];
    
    // Removing if the last character is a decimal or operation
    if(operations.indexOf(lastCharacter) > -1 || lastCharacter == '.')
      eq = eq.replace(/.$/, '');
    
    if(eq)
      input.innerHTML = eval(eq);
      
    decimalAdded = false;
  }

  // Restricting the input of two operations consecitively
  else if(operations.indexOf(buttonValue) > -1) {
    
    // checking to see the last character when operation is selected
    var lastCharacter = inputValue[inputValue.length - 1];

    // add the operation if the last character is not an operation
    if(inputValue != '' && operations.indexOf(lastCharacter) == -1) 
      input.innerHTML += buttonValue;
    
    // Allowing minus when string is empty
    else if(inputValue == '' && buttonValue == '-') 
      input.innerHTML += buttonValue;
    
    // Replacing last operation with a new operation
    if(operations.indexOf(lastCharacter) > -1 && inputValue.length > 1) {
      input.innerHTML = inputValue.replace(/.$/, buttonValue);
    }
    
    decimalAdded =false;
  }

  // limiting the input of only one decimal
  else if(buttonValue == '.') {
    if(!decimalAdded) {
      input.innerHTML += buttonValue;
      decimalAdded = true;
    }
  }

  // displaying if another key is pressed
  else {
    input.innerHTML += buttonValue;
  }

  // preventing page jumps
  e.preventDefault();
  }
}