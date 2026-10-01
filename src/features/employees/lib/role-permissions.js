/** ["orders.view", "orders.edit"] -> { orders: ["view", "edit"] }  (the API's permission_matrix) */
export function buildPermissionMatrix(permissionNames) {
  const matrix = {};
  permissionNames.forEach((name) => {
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex === -1) return;
    const section = name.slice(0, dotIndex);
    const action = name.slice(dotIndex + 1);
    matrix[section] = [...(matrix[section] ?? []), action];
  });
  return matrix;
}

/** Inverse of buildPermissionMatrix: { orders: ["view"] } -> Set(["orders.view"]) */
export function permissionNamesFromMatrix(matrix) {
  const names = new Set();
  if (!matrix || typeof matrix !== 'object') return names;

  Object.entries(matrix).forEach(([section, actions]) => {
    if (!Array.isArray(actions)) return;
    actions.forEach((action) => names.add(`${section}.${action}`));
  });
  return names;
}

/** Hides retired permission groups such as "مصاريف (قديم)". */
export function withoutLegacyModules(modules = []) {
  return modules.filter((module) => !String(module?.section_label_ar ?? '').includes('(قديم)'));
}

export function listPermissionNames(modules) {
  return modules.flatMap((module) => module.actions.map((action) => action.permission_name));
}

export function countPermissions(modules) {
  return modules.reduce((count, module) => count + (module.actions?.length ?? 0), 0);
}
