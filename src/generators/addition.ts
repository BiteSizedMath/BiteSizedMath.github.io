import { nonZero, randVariableTerm, randVariable } from "../randutils.js";
import { Term, TermSum } from "../algebra.js";
import { GeneratorResult } from "./problemgenerators.js";

export function generateCombineSum(): GeneratorResult {
    let a = new Term(nonZero(-3, 3), randVariable(0));
    let b = new Term(nonZero(-3, 3), randVariable(0));
    return {
        prompt: `Simplify`,
        problem: `${a.render()} ${b.render(true)}`,
        solution: `${a.add(b)!.render()}`,
        explanation: `2x + 3x = (2+3)x = 5x`,
        steps: [],
    };
}

export function generateCombineSumN(): GeneratorResult {
    let terms = TermSum.generate(4, Term.generateSimple);

    return {
        prompt: `Simplify`,
        problem: terms.render(),
        solution: terms.simplify().render(),
        explanation: `2x + 3x + 5y - 2y = (2+3)x + (5-2)y = 5x + 3y`,
        steps: [],
    };
}

export function bracketedSubtraction(): GeneratorResult {
    let terms1 = TermSum.generate(2, () => new Term(nonZero(-3, 3), randVariableTerm(1, 1)), true);
    let terms2 = TermSum.generate(2, () => new Term(nonZero(-3, 3), randVariableTerm(1, 1)), true);

    return {
        prompt: `Simplify`,
        problem: `(${terms1.render()}) - (${terms2.render()})`,
        steps: [terms1.add(terms2.multiplyTerm(new Term(-1, ''))).render()],
        solution: terms1.add(terms2.multiplyTerm(new Term(-1, ''))).simplify().render(),
        explanation: `a - (b + c) = a - b - c`
    };
}