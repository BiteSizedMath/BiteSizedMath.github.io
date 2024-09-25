import { nonZero, randVariableTerm, randVariable, randInclusive, sign } from "../randutils.js";
import { Term, TermSum, SimpleFraction, Power } from "../algebra.js";

export function generateFactorOut() {
    const result = {
        prompt: `Factor out the common factor`,
        steps: [],
        explanation: `ax ± bx = (a±b)x`,
    };

    let commonTerm = Term.generate();
    let terms = TermSum.generate(randInclusive(2, 3), () => Term.generate(commonTerm), true);

    result.problem = `${terms.render()}`;
    terms = terms.simplify(result.steps);
    result.solution = terms.renderFactoredOut();

    return result;
}

export function generateExpandFactoredTermSum() {
    let commonTerm = Term.generate();
    let sum = TermSum.generate(randInclusive(2, 3), () => Term.generate(commonTerm), true);

    return {
        prompt: `Expand`,
        problem: `${sum.renderFactoredOut()}`,
        solution: `${sum.render()}`,
        explanation: `(a±b)x = ax ± bx`
    };
}

export function generateExpandTermSumProduct() {
    const result = {
        prompt: `Expand`,
        steps: [],
        explanation: `(a+b)(c+d) = ac + ad + bc + bd`,
    }

    let sum1 = TermSum.generate(2, Term.generateSimple, true);
    let sum2 = TermSum.generate(2, Term.generateSimple, true);

    result.problem = `(${sum1.render()}) * (${sum2.render()})`;

    result.solution = `${sum1.multiply(sum2).simplify(result.steps).render()}`;

    return result;
}
