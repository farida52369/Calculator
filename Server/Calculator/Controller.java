package Calculator;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class Controller {

    public Model model;

    public Controller() {
        model = new Model();
    }

    @PostMapping(value = "/Basic")
    public String basicOperation(@RequestBody BasicExpression expression) {
        return model.basicOperation(expression.getFirstOperand(), expression.getOperator(),
                expression.getSecondOperand());
    }

    @PostMapping(value = "/Single")
    public String singleOperation(@RequestParam String expression) {
        return model.singleOperation(expression);
    }
}
