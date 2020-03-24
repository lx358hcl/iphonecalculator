//This is the commented version
'use strict'

var numbers = document.querySelectorAll(".numbers");
var inputField = document.getElementById("inputField")
var operators = document.querySelectorAll(".operators");
var clock = document.getElementById("time");
var AC = document.getElementById("ac");

operators.forEach(e => e.addEventListener("click", inputting, false));
numbers.forEach(e => e.addEventListener("click", inputting, false));

//IteratorMode this gets activated when the equals button gets clicked, when this is enabled it enables the equals sign to be spamclicked thereby do iteration, when it is off, this is not possible. It has to be off for 1 + 1 - 3 * 4 to be able to work.
//Operator, this is simply the operator that was clicked last.

//When any buttons gets clicked this function gets executed
function inputting(e){
  //Some styling
  operators.forEach(allel => allel.textContent == e.target.textContent ? false : allel.style.borderWidth = "0px");
  if(e.target.classList[1] == "operacolors" && e.target.textContent != "="){
      $(e.target).animate({
        "border-width":2,
      }, 100);
    }

  //The Calculator
  switch(e.target.classList[0]){
    case "numbers":
    AC.textContent = "C";
        //If the number 0 is clicked, then we do some checks. Most of it below is self-explanatory
        //This section for activeOperator == false, that means that we haven't clicked on one of the operators yet.
        if(cObj.activeOperator == false){
          if(e.target.textContent == "0"){
            if(inputField.value.startsWith("0.") || inputField.value.startsWith("-0.")) inputField.value += "0";
            else if(inputField.value.startsWith("0") || inputField.value.startsWith("-0")) return false;
            //This only gets executed if e.g. if the inputField starts with 1, maybe some others, but I cant think of any right now
            else inputField.value += "0";
          }
          //This only gets executed if activeOperator is true, that means that we have clicked on + or minus or something and therefore it is set to true
          //I'm not entirely sure when this part is relevant, but I dont dare remove it I should start commenting better
          else{
            if(inputField.value[0] == "0" || inputField.value[0] == "-"){
              if(inputField.value[1] == "." || inputField.value[2] == "."){
                inputField.value += e.target.textContent;
              } else return false;
            } else inputField.value += e.target.textContent;
          }
        }
        else if(cObj.activeOperator == true) {
          inputField.value = e.target.textContent;
          cObj.activeOperator = false;
        }
    break;
    case "operators": 
      if(e.target.textContent == "="){
        if(cObj.iteratorMode == true) cObj.evaluate();
        else{
          cObj.iteratorMode = true;
          cObj.second = inputField.value;
          cObj.evaluate();
        }
      }
      else if(e.target.textContent == "AC"){
        inputField.value = "";
        cObj.first = "";
        cObj.second = "";
        cObj.operator = null;
        cObj.activeOperator = false;
        cObj.iteratorMode = false;
      }
      else if(e.target.textContent == "C") {
        AC.textContent = "AC"; 
        inputField.value = "";
        cObj.second = "";
      }
      else if(e.target.textContent == "."){
        if(inputField.value.includes(".")){
          if(cObj.activeOperator == true){
            inputField.value = "0.";
            cObj.activeOperator = false;
          } else return false;
        }
        else{
          if(inputField.value == "") inputField.value = "0" + ".";
          else if(cObj.activeOperator == true){
             inputField.value = "0.";
             cObj.activeOperator = false;
          } else inputField.value += "."; 
        }
      }
      else if(e.target.textContent == "+/−"){
        if(!!inputField.value){
          var temp = [...inputField.value];
          temp[0] == "-" ? temp.shift() : temp.unshift("-");
          inputField.value = temp.join("");
        }
        else return false;
      }
      else if(e.target.textContent == "%") !!inputField.value == false ? false : inputField.value = _.round(+inputField.value / 100, 9);
      //This is the plus/minus/division section
      else{
        if(!!cObj.first == false) cObj.first = inputField.value;
        else if(!!cObj.first == true && !!cObj.second == false){
          if(cObj.activeOperator == true){
            cObj.evaluate();
          }
          else{
            cObj.second = inputField.value;
            cObj.evaluate();
            cObj.second = "";
          }
        }
        else{
          //Dette er når begge to er true this is addition after iteration
          if(cObj.iteratorMode == true){
              cObj.first = inputField.value;
              cObj.second = "";
            } else {
              alert("This part should never be reached, if you have, then fml. I think this means that variable 1 == false, and variable 2 == true, like in the case of console.log(!!.0); false console.log(!!\"0\"); true");
            }
        }
        cObj.activeOperator = true;
        cObj.iteratorMode = false;
        cObj.operator = e.target.textContent;
      }
    break;
    default:
    console.log("okay, this shouldn't actually happen, however if this has happened then it is caused by one or all of these reasons: 1. lodash wasn't loaded, 2. jquery wasn't loaded, or 3. you've used some strange calculator-calculation combo which I wasn't able to find or code for during the debugging.");
    break;
  }
  console.log(cObj);
}

//This object keeps track of the numbers, the selected operators and does the evaluation
var cObj = {
  first: "",
  second: "",
  operator: null,
  activeOperator: false,
  iteratorMode: false,
  evaluate(){
    if(this.first == "" && this.second == "") return false;
    else if(this.operator == "+") this.first = _.round(+this.first + +this.second, 6)+"";
    else if(this.operator == "−") this.first = _.round(+this.first - +this.second, 6)+"";
    else if(this.operator == "×") this.second == "" ? false : this.first = _.round(+this.first * +this.second, 6)+"";
    else if(this.operator == "÷") this.second == "" ? false : this.first = _.round(+this.first / +this.second, 6)+"";
    inputField.value = ""+this.first;
  },
}

//An iffe that updates the clock at the top of the screen and parses it
var updateTime = (function(){
  var time = new Date();
  var timeStamp = `${time.getHours()}:${time.getMinutes()}`;
  setInterval(function(){
    var time = new Date();
    var timeStamp = [...`${time.getHours()}:${time.getMinutes()}`];
    var colonIndex = timeStamp.indexOf(":");
    if(colonIndex == 2 && timeStamp.length == 4) timeStamp.splice(3,0,"0");
    else if (colonIndex = 1 && timeStamp.length == 4) timeStamp.splice(0,0,"0");
    else if (colonIndex = 1 && timeStamp.length == 3){
      timeStamp.splice(0,0,"0"); 
      timeStamp.splice(3,0,"0");
    }
    clock.textContent = timeStamp.join("");
  }, 80);
})()