import { nonZero, randVariableTerm, randVariable, randInclusive, sign } from "../randutils.js";
import { Term, TermSum, SimpleFraction, Power } from "../algebra.js";

export function generateBinomial() {
    const result = {
        prompt: `Expand`,
        steps: [],
        explanation: `(a±b)^2 = a^2 ± 2ab + b^2`,
    };

    const t1 = new Term(nonZero(-3, 3), randVariableTerm(1, 3));
    const t2 = new Term(nonZero(-3, 3), randVariableTerm(1, 3));

    const terms = new TermSum([t1, t2]);
    result.problem = `(${terms.render()})^(2)`;

    if (terms.canSimplify()) {
        if (terms.simplify().isZero()) {
            result.solution = `0`;
            return result;
        }
        result.steps.push(`${terms.simplify().terms[0].renderAsBase()}^(2)`);
        result.solution = `${new Power(terms.simplify().terms[0], new Term(2, '')).simplify().render()}`;
        return result;
    }

    const sum = new TermSum([
        t1.multiply(t1),
        t1.multiply(t2).multiply(new Term(2, '')),
        t2.multiply(t2),
    ]);

    result.solution = `${sum.render()}`;
    return result;
}

export function generateBinomial2() {
    const result = {
        prompt: `Expand`,
        steps: [],
        explanation: `(a+b)(a-b) = a^2 - b^2`,
    };

    const terms = TermSum.generate(2, () => new Term(nonZero(-3, 3), randVariableTerm(1, 2)), true);
    const terms2 = new TermSum([terms.terms[0], terms.terms[1].multiply(new Term(-1, ''))]);
    result.problem = `${terms.renderAsFactor()}${terms2.renderAsFactor()}`;
    result.solution = `${terms.multiply(terms2).simplify().render()}`;
    return result;
}
