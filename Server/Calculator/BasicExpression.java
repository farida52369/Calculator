package Calculator;

public class BasicExpression {

    private String firstOperand;
    private String operator;
    private String secondOperand;

    public BasicExpression(String firstOperand, String operator, String secondOperand) {
        this.firstOperand = firstOperand;
        this.operator = operator;
        this.secondOperand = secondOperand;
    }


    public String getFirstOperand() {
        return firstOperand;
    }

    public void setFirstOperand(String firstOperand) {
        this.firstOperand = firstOperand;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getSecondOperand() {
        return secondOperand;
    }

    public void setSecondOperand(String secondOperand) {
        this.secondOperand = secondOperand;
    }
}
