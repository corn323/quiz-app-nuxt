import katex from 'katex';

export async function convertLatexToMathML(latex: string): Promise<string> {
    try {
        const cleanLatex = latex.replace(/(^\$+)|(\$+$)/g, '').trim();

        const html = katex.renderToString(cleanLatex, {
            throwOnError: false,
            displayMode: false
        });

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent ?? cleanLatex;

    } catch (error) {
        console.error('KaTeX conversion error:', error);
        throw error;
    }
}

export function convertLatexToUnicodeEquation(latex: string): string {
    let cleaned = latex.replace(/(^\$+)|(\$+$)/g, '').trim();

    const conversions: Array<[RegExp, string | ((match: string, ...groups: string[]) => string)]> = [
        [/\\times/g, '×'],
        [/\*/g, '×'],

        [/\\sqrt\{([^}]+)\}/g, '√($1)'],
        [/\\sqrt\s*([a-zA-Z0-9]+)/g, '√$1'],
        [/\\sqrt(\d+)/g, '√$1'],

        [/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)'],

        [/\^\{([^}]+)\}/g, (match, group) => toSuperscript(group)],
        [/\^([0-9a-zA-Z])/g, (match, group) => toSuperscript(group)],

        [/_\{([^}]+)\}/g, (match, group) => toSubscript(group)],
        [/_([0-9a-zA-Z])/g, (match, group) => toSubscript(group)],

        [/\\alpha/g, 'α'], [/\\beta/g, 'β'], [/\\gamma/g, 'γ'], [/\\delta/g, 'δ'],
        [/\\epsilon/g, 'ε'], [/\\theta/g, 'θ'], [/\\lambda/g, 'λ'], [/\\mu/g, 'μ'],
        [/\\pi/g, 'π'], [/\\sigma/g, 'σ'], [/\\phi/g, 'φ'], [/\\omega/g, 'ω'],

        [/\\pm/g, '±'], [/\\mp/g, '∓'], [/\\div/g, '÷'], [/\\neq/g, '≠'],
        [/\\leq/g, '≤'], [/\\geq/g, '≥'], [/\\approx/g, '≈'], [/\\equiv/g, '≡'],
        [/\\infty/g, '∞'], [/\\sum/g, '∑'], [/\\prod/g, '∏'], [/\\int/g, '∫'],

        [/\\left\(/g, '('], [/\\right\)/g, ')'],
        [/\\left\[/g, '['], [/\\right\]/g, ']'],
        [/\\left\{/g, '{'], [/\\right\}/g, '}'],

        [/(\d+)\\sqrt\{?(\d+)\}?/g, '$1√$2'],
        [/(\d+)\\sqrt(\d+)/g, '$1√$2'],

        [/\\\s+/g, ''],
        [/\s+/g, ' ']
    ];

    for (const [pattern, replacement] of conversions) {
        if (typeof replacement === 'string') {
            cleaned = cleaned.replace(pattern, replacement);
        } else {
            cleaned = cleaned.replace(pattern, replacement as any);
        }
    }

    return cleaned.trim();
}

function toSuperscript(text: string): string {
    const map: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
        'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
        'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ',
        't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
    };
    return text.split('').map(char => map[char] || char).join('');
}

function toSubscript(text: string): string {
    const map: { [key: string]: string } = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
        'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ',
        'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
    };
    return text.split('').map(char => map[char] || char).join('');
}

export async function convertMathExpression(latex: string, preferMathML: boolean = false): Promise<string> {
    return convertLatexToUnicodeEquation(latex);
}
