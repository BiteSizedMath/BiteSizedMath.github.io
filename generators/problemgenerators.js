import * as addition from './addition.js';
import * as binomials from './binomials.js';
import * as fractions from './fractions.js';
import * as multiplication from './multiplication.js';
import * as powers from './powers.js';

export const generatorConfig = {
    a: { generators: addition, name: "Addition and Subtraction" },
    m: { generators: multiplication, name: "Multiplication" },
    b: { generators: binomials, name: "Binomial Formulas" },
    f: { generators: fractions, name: "Fractions" },
    p: { generators: powers, name: "Powers and Exponents" },
};

export function generators() {
    const filter = getSelectedCategories().split('');

    const g = [];
    for (let key of filter) {
        if (generatorConfig[key]) {
            g.push(...Object.values(generatorConfig[key].generators));
        }
    }
    return g;
}

function initFilter() {
    const url = new URL(window.location.href);
    if (url.searchParams.get('filter')) {
        setSelectedCategories(url.searchParams.get('filter'));
    }
    url.searchParams.set('filter', getSelectedCategories());
    window.history.replaceState(getSelectedCategories(), '', url.toString());
}
initFilter();

export function getSelectedCategories() {
    let filter = new Set();
    for (let key of (Cookies.get('filter') ?? Object.keys(generatorConfig).join('')).split('')) {
        if (Object.keys(generatorConfig).includes(key))
            filter.add(key);
    }
    return [...filter].sort().join('');
}

export function setSelectedCategories(categories) {
    Cookies.set('filter', categories, { sameSite: 'strict', expires: 10000 });
    const url = new URL(window.location.href);
    url.searchParams.set('filter', getSelectedCategories());
    window.history.replaceState(getSelectedCategories(), '', url.toString());
}