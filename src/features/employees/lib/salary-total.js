/** basic - deduction + bonus; empty or invalid fields count as 0. Returns "" if nothing is computable. */
export function calculateSalaryTotal({ basic_salary, deduction, bonus }) {
  const total = (parseFloat(basic_salary) || 0) - (parseFloat(deduction) || 0) + (parseFloat(bonus) || 0);
  return Number.isNaN(total) ? '' : String(total);
}
