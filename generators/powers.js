import { nonZero, randVariableTerm, randVariable, randInclusive, sign } from "../randutils.js";
import { Term, TermSum, SimpleFraction, Power } from "../algebra.js";

export function generateExponentMultiplication() {
    const result = {
        prompt: `Simplify`,
        steps: [],
        explanation: `a^x * a^y = a^(x+y)`,
    };

    const term1 = new Term(nonZero(-3, 3), randVariable(0).repeat(randInclusive(2, 4)));
    const term2 = new Term(nonZero(-3, 3), randVariable(0).repeat(randInclusive(2, 4)));

    result.problem = `${term1.renderAsFactor(true)} * ${term2.renderAsFactor()}`;
    result.solution = term1.multiply(term2).render();
    return result;
}

export function generateExponentExponentiation() {
    const result = {
        prompt: `Simplify`,
        steps: [],
        explanation: `(a^x)^y = a^(x*y)`,
    };

    const term1 = Term.generateSingleValue();
    const term2 = new Term(nonZero(-3, 3), randVariable(1));
    const term3 = new Term(nonZero(-3, 3), randVariable(2));

    const power = new Power(term1, term2);

    result.problem = `(${power.render()})^(${term3.render()})`;
    result.solution = power.exponentiate(term3).simplify().render();
    return result;
}

export function generateMultiplicationExponentiation() {
    const result = {
        prompt: `Write without brackets`,
        steps: [],
        explanation: `(a*b)^x = a^x * b^x`,
    };

    const term1 = new Term(1, randVariable(0));
    const term2 = new Term(1, randVariable(1));
    const exponent = Term.generateSingleValue();

    result.problem = `(${term1.renderAsFactor(true)} * ${term2.renderAsFactor()})^(${exponent.render()})`;

    if (exponent.isOne()) {
        result.solution = `${term1.renderAsFactor(true)} * ${term2.renderAsFactor()}`;
        return result;
    }

    result.solution = `${term1.renderAsBase()}^(${exponent.render()}) * ${term2.renderAsBase()}^(${exponent.render()})`;
    return result;
}
