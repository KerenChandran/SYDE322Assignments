
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

  // prevents going to other urls
  // If this method is called, the default action of the event will not be triggered.
  e.preventDefault();
  }
}


// Graphing Calculator
function graph() {

  var i = document.getElementById("userInput").value;
  i = '-' + i;

  var canvas = document.getElementById('myCanvas'),
      c = canvas.getContext('2d'),

      // 'n' is the number of line segments.
      n = 100,

      // define the math "window".
      xMin = -10,
      xMax = 10,
      yMin = -10,
      yMax = 10,

      math = mathjs(),
      expr = i,
      scope = { x: 0 },
      tree = math.parse(expr, scope);

      c.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid(20);
      drawCurve();

      function drawGrid(step) {
        c.beginPath();
        for (var x = 0; x <= canvas.width; x += step) {
          c.moveTo(x, 0);
          c.lineTo(x, canvas.height);
        }

        // set the color of the line
        c.strokeStyle = 'rgb(0,0,0)';
        c.lineWidth = 0.1;

        // the stroke will actually paint the current path
        c.stroke();

        // for the sake of the example 2nd path
        c.beginPath();

        for (var y = 0; y <= canvas.height; y += step) {
          c.moveTo(0, y);
          c.lineTo(canvas.width, y);
        }

        // set the color of the line
        c.strokeStyle = 'rgb(0,0,0)';
        // just for fun
        c.lineWidth = 0.1;
        // for your original question - you need to stroke only once
        c.stroke();
      }


  function drawCurve(){
    // these are used inside the for loop.
    var i,

        // these vary between xMin and xMax
        //                and yMin and yMax
        xPixel, yPixel,

        // these vary between 0 and 1.
        percentX, percentY,

        // these are in math coordinates.
        mathX, mathY;

    c.beginPath();
    for(i = 0; i < n; i++) {
      percentX = i / (n - 1);
      mathX = percentX * (xMax - xMin) + xMin;

      mathY = evaluateMathExpr(mathX);

      percentY = (mathY - yMin) / (yMax - yMin);
      console.log(percentY);

      xPixel = percentX * canvas.width;
      yPixel = percentY * canvas.height;
      c.lineTo(xPixel, yPixel);
    }
    c.lineWidth = 1;
    c.stroke();
  }

  function evaluateMathExpr(mathX){
    scope.x = mathX;
    console.log(tree.eval());
    return tree.eval();
  }
}
