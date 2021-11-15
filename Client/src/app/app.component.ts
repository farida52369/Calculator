import { Component, OnInit } from '@angular/core';
import { CalService, Expression } from './services/cal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private calService: CalService) { }

  title : string = "Calculator";
  // has all the operations untill Now
  input: string = '';
  result: string = '';

  checkSingleOperation: boolean = false;
  checkOperation: boolean = false;
  checkEqual: boolean = false;
  checkBackSpace: boolean = false;

  //Pressing a num after operation 
  // lastCheck manage when we have square root, 1/X ..
  lastCheck: boolean = false;

  err: string = "Error!";

  // What in my Hand NOW
  temp: string = '';
  // sending them to the SERVER
  firstOperand: string = '';
  operator: string = '';
  secondOperand = '';

  checkValid() {
    // If The press Operator through an error 
    // Division by Zero then clear all Then start from the Begining ..
    if (this.result === this.err) {
      this.clearAll();
    }
  }

  equality() {
    this.input = '';
    this.temp = this.result;
    this.operator = '';
    this.firstOperand = '';
    this.secondOperand = '';
  }

  pressNum(num: string) {
    this.checkValid();

    if (this.checkBackSpace) {
      let lenInp = this.input.length;
      let lenTemp = this.temp.length;
      let lastChar = this.input.charAt(lenInp - lenTemp - 1);
      if (lastChar == '√') {
        this.input = this.input.substring(0, lenInp - lenTemp - 1);
      } else if (lastChar == '/') {
        this.input = this.input.substring(0, lenInp - lenTemp - 2);
      } else {
        this.input = this.input.substring(0, lenInp - lenTemp);
      }
      this.temp = '';
      this.lastCheck = true;
    }
    // We will get an error if the operand has more than one (dot)
    // So using (if Condition) to check 
    // if the last char is a dot || the operand has already a dot
    if (num == '.' && this.temp != '' && this.temp.includes('.')) {
      return;
    }

    // The operation will be a little difficult if the first characters in the operand are Zeros
    // So Checking if the num == '0' and if the temp String is empty 
    // return null
    if (num == '0' && this.temp == '' && this.result == '' && this.input == '') {
      return;
    }

    // ELSE
    // add the value to the desired strings
    if (this.temp == '0') {
      this.temp = num;
    } else {
      // Temp will be updated continously
      this.temp += num;
    }
    // Make the Result like in the standard Calculator
    this.result = this.temp;
    this.checkBackSpace = false;
    // console.warn("Hello: " + this.input);
  }

  checkTempIfHaveSingleOperation() {
    if (this.temp.includes('/') || this.temp.includes('²') || this.temp.includes('√')) {
      return true;
    }
    return false;
  }
  pressOperator(op: string) {
    this.checkValid();

    // When have a module % :)))))
    // if checkSingleOperation is true then we have a single operation
    // Do the next operation when pressing operator
    if (this.checkSingleOperation) {
      this.sendBackend();
      this.checkSingleOperation = false;
      this.input += op;
      this.secondOperand = '';
      this.temp = '';
      this.operator = op;
      return;
    }

    // two consecutive operators mean NOTHING 
    const lastChar = this.input.charAt(this.input.length - 1);
    if ((lastChar == '-' || lastChar == '÷' || lastChar == '+' || lastChar == '×') && this.temp == '') {
      return;
    }

    // Pressing operator update the input
    if (((this.temp != '' && !this.checkOperation) || this.lastCheck) && !this.checkTempIfHaveSingleOperation()) {
      this.input += this.temp + op;
      this.lastCheck = false;
    } else if (this.temp != '' && this.checkOperation) {
      this.input += op;
      this.checkOperation = false;
    }

    // If the input was empty and we pressed for an operator 
    // then the first operand is ZERO
    if (this.input == '') {
      this.temp = '0';
      this.input = '0' + op;
      this.result = '0';
    }

    // Through temp String we could make first and second Operand
    // To make it easy to send to the BACKEND
    if (this.temp != '') {
      if (this.firstOperand == '') {
        this.firstOperand = this.temp;
        this.temp = '';
        this.operator = op;
      } else if (this.firstOperand != '') {
        this.secondOperand = this.temp;
        this.temp = '';
      }
    }

    if (this.operator != '' && this.firstOperand != '' && this.secondOperand != '') {
      console.warn(this.firstOperand + this.operator + this.secondOperand);
      // BACKEND OPERATION
      this.sendBackend();
      this.secondOperand = '';
      this.operator = op;
    }
    // console.warn("Hello: " + this.input);
  }

  plusMinus() {
    this.checkValid();
    if (this.result == '') {
      return;
    }
    let lenRes = this.result.length;
    if (this.result.charAt(0) == '-') {
      this.result = this.result.substring(1, lenRes);
    } else {
      this.result = '-' + this.result;
    }
    // Make the result equal the temp
    this.temp = this.result;
  }

  clearAll() {
    this.firstOperand = '';
    this.operator = '';
    this.secondOperand = '';
    this.temp = '';
    this.input = '';
    this.result = '';
    this.checkEqual = false;
    this.checkOperation = false;
    this.checkSingleOperation = false;
    this.checkBackSpace = false;
    this.lastCheck = false;
  }

  clearCE() {
    this.result = '0';
    this.temp = '0';
  }

  pressModule() {
    this.checkValid();
    if (this.firstOperand == '') {
      this.clearAll();
    } else if (this.temp != '') {
      this.temp = this.temp + '%';
      this.secondOperand = this.temp;
      this.sendBackend();
    }
  }

  lastIndexOfChar() {
    let list = ['+', '-', '÷', '×'];
    let index = 0;
    for (let i = 0; i < 4; i++) {
      if (this.input.lastIndexOf(list[i]) > index) {
        index = this.input.lastIndexOf(list[i]);
      }
    }
    return index;
  }

  pressSquarePow() {
    this.checkValid();
    if (this.result != '') {
      var index = this.lastIndexOfChar();
      if (index == 0) {
        this.input = this.input.substring(0, index) + '(' + this.result + ')²';
      } else {
        this.input = this.input.substring(0, index + 1) + '(' + this.result + ')²';
      }

      this.result += '²';
      this.temp = this.result;
      this.checkOperation = true;
      this.sendBackendSingle();
    }
  }

  pressOneOverX() {
    this.checkValid();
    if (this.result != '' && this.result != '0') {
      var index = this.lastIndexOfChar();
      if (index == 0) {
        this.input = this.input.substring(0, index) + '1/(' + this.result + ')';
      } else {
        this.input = this.input.substring(0, index + 1) + '1/(' + this.result + ')';
      }
      this.result = '1/' + this.result;
      this.temp = this.result;
      this.checkOperation = true;
      this.sendBackendSingle();
    }
  }

  pressSquareRoot() {
    this.checkValid();
    if (this.result != '') {
      var index = this.lastIndexOfChar();
      if (index == 0) {
        this.input = this.input.substring(0, index) + '√(' + this.result + ')';
      } else {
        this.input = this.input.substring(0, index + 1) + '√(' + this.result + ')';
      }
      this.result = '√' + this.result;
      this.temp = this.result;
      this.checkOperation = true;
      this.sendBackendSingle();
    }
  }

  pressSpaceBack() {
    if (this.temp != '' && !this.checkBackSpace) {
      this.temp = this.temp.substring(0, this.temp.length - 1);
      this.result = this.temp;
    }
  }

  pressEqual() {
    if (this.result === this.err) {
      this.clearAll();
    } else if (this.input != '') {
      if (this.operator != '' && this.firstOperand != '') {
        this.secondOperand = this.result;
        this.checkEqual = true;
        this.sendBackend();
      } else {
        this.equality();
      }
    }
  }

  sendBackendSingle() {
    this.calService.sendRequestSingle(this.result).subscribe(
      (response) => {
        let temp_res: any = response.body;
        this.result = temp_res;
        this.result = this.result.toString();
      },
      (error) => {
        this.result = this.err;
        console.error("Error :)");
      });
    this.checkBackSpace = true;
  }

  sendBackend() {
    this.calService.sendRequestBasic(new Expression(this.firstOperand, this.operator, this.secondOperand)).subscribe(
      (response) => {

        let temp_res: any = response.body;
        this.result = temp_res;
        this.result = this.result.toString();

        if (this.secondOperand != '' && this.secondOperand.charAt(this.secondOperand.length - 1) == '%') {
          this.input = this.input + this.result;
          this.secondOperand = this.result;
          this.temp = '';
          this.checkSingleOperation = true;
        } else if (this.checkEqual) {
          this.equality();
          this.checkEqual = false;
        } else {
          this.firstOperand = this.result;
        }
      },
      (error) => {
        this.result = this.err;
        console.error("Error :)");
      });
    this.checkBackSpace = true;
  }

}
