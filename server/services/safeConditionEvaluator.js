/**
 * services/safeConditionEvaluator.js
 * 
 * Safe condition evaluator for dynamic task auto-completion rules.
 * Replaces dangerous `new Function('$val', ...)` and `eval()` execution
 * with a strictly sandboxed, deterministic parser.
 */

const DANGEROUS_IDENTIFIERS = /(process|require|import|global|window|document|constructor|__proto__|prototype|Function|eval|child_process|fs|path|os|exec|spawn)\b/i;

/**
 * Safely evaluates a boolean condition string against a given input value ($val).
 * Returns true if condition is met, false otherwise.
 * 
 * Supported condition formats:
 * - "$val" (truthy check)
 * - "Boolean($val)" (truthy check)
 * - "$val === 'literal'" or "$val == 'literal'"
 * - "$val !== 'literal'" or "$val != 'literal'"
 * - "$val > number", "$val >= number", "$val < number", "$val <= number"
 * 
 * @param {string} condition - Expression string containing $val
 * @param {*} val - The field value being tested
 * @returns {boolean}
 */
export function safeEvaluateCondition(condition, val) {
  if (!condition || typeof condition !== 'string') return false;
  const trimmed = condition.trim();
  if (!trimmed) return false;

  // 1. Strict AST security boundary: Reject any dynamic code injection keywords
  if (DANGEROUS_IDENTIFIERS.test(trimmed)) {
    console.warn('[Security Warning] Blocked hazardous condition evaluation expression:', trimmed);
    return false;
  }

  // Also block semicolons, curly braces, and backticks to prevent compound statements
  if (/[;{}`]/.test(trimmed)) {
    console.warn('[Security Warning] Blocked prohibited characters in condition expression:', trimmed);
    return false;
  }

  // 2. Truthy checks
  if (trimmed === '$val' || trimmed === 'Boolean($val)') {
    return Boolean(val) && val !== '' && val !== 'false';
  }

  // 3. Comparison expressions: $val (operator) (operand)
  const compRegex = /^\$val\s*(===|==|!==|!=|>=|<=|>|<)\s*(['"]?)(.*?)\2$/;
  const match = trimmed.match(compRegex);

  if (match) {
    const [_, operator, isQuoted, rawTarget] = match;
    let target = rawTarget.trim();

    // Parse operand types
    let parsedTarget = target;
    if (!isQuoted) {
      if (target === 'true') parsedTarget = true;
      else if (target === 'false') parsedTarget = false;
      else if (target === 'null') parsedTarget = null;
      else if (target === 'undefined') parsedTarget = undefined;
      else if (!isNaN(Number(target)) && target !== '') parsedTarget = Number(target);
    }

    // Determine value to compare
    let compareVal = val;
    if (typeof parsedTarget === 'number' && !isNaN(Number(val)) && val !== '' && val !== null) {
      compareVal = Number(val);
    }

    switch (operator) {
      case '===':
      case '==':
        if (typeof parsedTarget === 'string' && typeof compareVal === 'string') {
          return compareVal.toLowerCase() === parsedTarget.toLowerCase();
        }
        return compareVal === parsedTarget;

      case '!==':
      case '!=':
        if (typeof parsedTarget === 'string' && typeof compareVal === 'string') {
          return compareVal.toLowerCase() !== parsedTarget.toLowerCase();
        }
        return compareVal !== parsedTarget;

      case '>':
        return Number(compareVal) > Number(parsedTarget);

      case '>=':
        return Number(compareVal) >= Number(parsedTarget);

      case '<':
        return Number(compareVal) < Number(parsedTarget);

      case '<=':
        return Number(compareVal) <= Number(parsedTarget);

      default:
        return false;
    }
  }

  // 4. Default literal match
  return String(val).trim().toLowerCase() === trimmed.toLowerCase();
}

