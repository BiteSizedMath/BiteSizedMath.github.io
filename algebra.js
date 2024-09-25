import { nonZero, randVariableTerm, randVariable, randInclusive, sign, randInt } from "./randutils.js";

export class Term {
    constructor(factor, variables) {
        this.factor = factor;
        this.variables = variables.split("").sort().join("");
    }

    static one = new Term(1, '');

    static generateSingleValue(positive = false) {
        if (randInt(3) == 0)
            return new Term(positive ? nonZero(-3, 3) : nonZero(1, 3), '');
        else
            return new Term(1, randVariableTerm(1, 2));
    }

    static generateSimple(baseFactor = Term.one) {
        return new Term(nonZero(-3, 3) * baseFactor.factor, randVariableTerm(1, 2) + baseFactor.variables);
    }

    static generate(baseFactor = Term.one) {
        return new Term(nonZero(-3, 3) * baseFactor.factor, randVariableTerm(2, 3) + baseFactor.variables);
    }

    static gcd(a, b) {
        if (b == 0)
            return a;
        return Term.gcd(b, a % b);
    }

    renderAsBase() {
        if (this.factor > 0 && this.variables.length == 0
            || this.factor == 1 && this.variables.length <= 1)
            return this.render();
        return `(${this.render()})`;
    }

    renderAsFactor(firstFactor = false) {
        if (this.factor < 0 && !firstFactor)
            return `(${this.render()})`;
        return this.render();
    }

    render(asOperand = false) {
        if (this.factor == 0)
            return '';
        if (this.variables.length == 0) {
            if (asOperand)
                return this.factor < 0 ? `- ${-this.factor}` : `+ ${this.factor}`;
            return `${this.factor}`;
        }

        let result = `${this.factor}`;
        if (this.factor == 1)
            result = '';
        if (this.factor == -1)
            result = '-';

        if (asOperand) {
            if (result.startsWith('-'))
                result = '- ' + result.substring(1);
            else
                result = '+ ' + result;
        }

        let prevVar = this.variables[0];
        let count = 0;
        for (let curVar of this.variables) {
            if (prevVar == curVar) {
                count++;
            } else {
                result += ` ${prevVar}`;
                if (count > 1)
                    result += `^${count}`;
                count = 1;
            }
            prevVar = curVar;
        }
        result += ` ${prevVar}`;
        if (count > 1)
            result += `^${count}`;

        return result;
    }

    add(term) {
        if (term.variables != this.variables)
            return null;
        return new Term(this.factor + term.factor, this.variables);
    }

    multiply(term) {
        return new Term(this.factor * term.factor, this.variables + term.variables);
    }

    divide(term) {
        const result = new Term(this.factor / term.factor, this.variables);
        for (let curVar of term.variables) {
            if (!result.variables.includes(curVar))
                return null;
            result.variables = result.variables.replace(curVar, '');
        }
        return result;
    }

    abs() {
        return new Term(Math.abs(this.factor), this.variables);
    }

    lcm(term) {
        return this.multiply(term).abs().divide(this.gcd(term));
    }

    gcd(term) {
        const commonFactor = Term.gcd(Math.abs(this.factor), Math.abs(term.factor));
        let commonVariables = '';
        let othertermVariables = term.variables;

        for (let curVar of this.variables) {
            if (othertermVariables.includes(curVar)) {
                commonVariables += curVar;
                othertermVariables = othertermVariables.replace(curVar, '');
            }
        }
        return new Term(commonFactor, commonVariables);
    }

    isZero() {
        return this.factor == 0;
    }

    isOne() {
        return this.factor == 1 && this.variables.length == 0;
    }
}

export class TermSum {
    constructor(terms = []) {
        this.terms = terms.filter(t => t.factor != 0);
    }

    static generate(n, termGenerator, uniqueTerms = false) {
        let result = new TermSum();
        while (result.terms.length < n) {
            result.push(termGenerator());
            if (uniqueTerms)
                result = result.simplify();
        }
        return result;
    }

    push(term) {
        if (term.factor != 0)
            this.terms.push(term);
    }

    add(termSum) {
        const result = new TermSum(this.terms);
        for (let term of termSum.terms) {
            result.push(term);
        }
        return result
    }

    subtract(termSum) {
        const result = new TermSum(this.terms);
        for (let term of termSum.terms) {
            result.push(new Term(-term.factor, term.variables));
        }
        return result
    }

    renderAsFactor(firstFactor = false) {
        if (this.isZero())
            return '0';
        if (this.terms.length == 1) {
            return this.terms[0].renderAsFactor(firstFactor);
        }
        return `(${this.render()})`;
    }

    render() {
        if (this.isZero())
            return '0';
        let asOperand = false;
        let result = '';
        for (let term of this.terms) {
            result += ` ${term.render(asOperand)}`;
            asOperand = true;
        }
        return result;
    }

    renderFactoredOut(commonTerm = null) {

        if (commonTerm == null)
            commonTerm = this.gcd();
        else
            commonTerm = commonTerm.gcd(this.gcd());

        if (commonTerm.isOne() || this.terms.length <= 1)
            return this.render();

        return `${commonTerm.render()}(${this.divide(commonTerm).render()})`;
    }

    canSimplify() {
        return this.terms.length > this.simplify().terms.length;
    }

    simplify(steps = []) {
        const result = [];
        for (let term of this.terms) {
            let found = false;
            for (let j = 0; j < result.length; j++) {
                if (result[j].add(term)) {
                    result[j] = result[j].add(term);
                    found = true;
                    break;
                }
            }
            if (!found)
                result.push(term);
        }
        if (result.length < this.terms.length) {
            steps.push(`${this.render()}`)
            steps.push(`${new TermSum(result).render()}`)
        }
        return new TermSum(result);
    }

    canFactorOut() {
        return !this.gcd().isOne() && this.terms.length > 1;
    }

    gcd() {
        if (this.terms.length == 0)
            return new Term(1, '');
        let commonterm = new Term(Math.abs(this.terms[0].factor), this.terms[0].variables);
        for (let term of this.terms) {
            commonterm = commonterm.gcd(term);
        }
        return commonterm;
    }

    divide(divisor) {
        const result = new TermSum();
        for (let term of this.terms) {
            result.push(term.divide(divisor));
        }
        return result;
    }

    multiply(termSum) {
        const result = new TermSum();
        for (let term1 of this.terms) {
            for (let term2 of termSum.terms) {
                result.push(term1.multiply(term2));
            }
        }
        return result;
    }

    multiplyTerm(term) {
        const result = new TermSum();
        for (let term1 of this.terms) {
            result.push(term1.multiply(term));
        }
        return result;
    }

    isZero() {
        return this.terms.length == 0;
    }
}

export class SimpleFraction {
    constructor(numerator, denominator, sign = '') {
        this.numerator = numerator;
        this.denominator = denominator;
        this.sign = sign;
    }

    render() {
        if (this.isZero())
            return '0';
        if (this.denominator.factor == 1 && this.denominator.variables.length == 0) {
            if (this.numerator.terms.length == 1 && this.numerator.terms[0].factor > 0)
                return this.sign + this.numerator.render();
            else
                return `${this.sign}(${this.numerator.render()})`;
        }

        return `${this.sign}(${this.numerator.render()}) / (${this.denominator.render()})`;
    }

    renderFactoredOut() {
        return `${this.sign}(${this.numerator.renderFactoredOut()}) / (${this.denominator.render()})`;
    }

    simplifyNumerator(steps = []) {
        const result = new SimpleFraction(this.numerator.simplify(), this.denominator, this.sign);
        if (this.numerator.canSimplify()) {
            steps.push(`${this.render()}`)
            steps.push(`${result.render()}`)
        }
        return result;
    }

    canReduce() {
        return !this.numerator.gcd().gcd(this.denominator).isOne();
    }

    reduce(steps = []) {
        let num = new TermSum(this.numerator.terms.map(t => new Term(t.factor, t.variables)));
        let den = new Term(this.denominator.factor, this.denominator.variables);

        let sign = this.sign;
        if (num.terms.length == 1) {
            if (sign == '-')
                sign = num.terms[0].factor * den.factor < 0 ? '+' : '-';
            else
                sign = num.terms[0].factor * den.factor < 0 ? '-' : this.sign;
            num.terms[0].factor = Math.abs(num.terms[0].factor);
            den.factor = Math.abs(den.factor);
        }

        if (!this.canReduce()) {
            return new SimpleFraction(num, den, sign);
        }
        const commonterm = this.numerator.gcd().gcd(this.denominator);
        if (!commonterm.isOne()) {
            steps.push(`${this.render()}`)
            steps.push(`${this.renderFactoredOut()}`)
        }
        num = num.divide(commonterm);
        den = den.divide(commonterm);

        const result = new SimpleFraction(num, den, sign);

        if (result.numerator.canFactorOut()) {
            steps.push(`${result.renderFactoredOut()}`)
            steps.push(`${result.render()}`)
        }

        return result;
    }

    isZero() {
        return this.numerator.isZero();
    }
}

export class Power {
    constructor(base, exponent) {
        this.base = base;
        this.exponent = exponent;
    }

    exponentiate(exponent) {
        return new Power(this.base, this.exponent.multiply(exponent));
    }

    simplify() {
        if (this.base.isOne() || this.exponent.isZero())
            return new Power(new Term(1, ''), new Term(0, ''));
        if (this.base.isZero())
            return new Power(new Term(0, ''), new Term(1, ''));

        return new Power(this.base, this.exponent);
    }

    moveToFactorBase() {
        if (this.base.variables.length > 0 || this.exponent.factor == 1)
            return new Power(this.base, this.exponent);

        const base = new Term(Math.pow(this.base.factor, this.exponent.factor), '');
        const exponent = new Term(1, this.exponent.variables);

        return new Power(base, exponent);

    }

    render() {
        if (this.base.isOne() && this.exponent.isZero())
            return '1';
        if (this.exponent.isOne())
            return `${this.base.render()}`;
        return `${this.base.renderAsBase()}^(${this.exponent.render()})`;
    }
}