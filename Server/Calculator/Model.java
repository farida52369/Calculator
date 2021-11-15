package Calculator;

import java.text.DecimalFormat;

public class Model {

    public Model() {}

    public boolean containSingleOperation(String x) {
        return (x.contains("²") || x.contains("√") || x.contains("/"));
    }

    public String basicOperation(String firstOperand, String operand, String secondOperand) {
        double result = 0;

        if (containSingleOperation(firstOperand))  {
            firstOperand = singleOperation(firstOperand);
        }

        if (containSingleOperation(secondOperand)) {
            secondOperand = singleOperation(secondOperand);
        }

        double first = Double.parseDouble(firstOperand);
        double second = 0;
        if (secondOperand.contains('%' + "")) {
            second = Double.parseDouble(secondOperand.substring(0, secondOperand.length() - 1));
            second = (Double) (second / 100) * first;
            return new DecimalFormat("#.##########").format(second);
        } 
        
        second = Double.parseDouble(secondOperand);
        switch (operand) {
            case "+":
                result = first + second;
                break;
            case "-":
                result = first - second;
                break;
            case "×":
                result = first * second;
                break;
            case "÷":
                if (second == 0) {
                    return "Error, Division by Zero!";
                }
                result = first / second;
                break;
        }
        return new DecimalFormat("#.############").format(result);
    }

    public String singleOperation(String expression) {
        double result = 0;
        double num = 0;
        if (expression.contains("²")) {
            num = Double.parseDouble(expression.substring(0, expression.length() - 1));
            result = num * num;
        } else if(expression.contains("/")) {
            num = Double.parseDouble(expression.substring(2, expression.length()));
            result = 1 / num;
        } else if (expression.contains("√")) {
            num = Double.parseDouble(expression.substring(1, expression.length()));
            if (num < 0) return "Invalid Input";
            result = Math.sqrt(num);
        }
        return new DecimalFormat("#.############").format(result);
    }
}
