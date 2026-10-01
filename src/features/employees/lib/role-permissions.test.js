import { describe, expect, it } from 'vitest';
import {
  buildPermissionMatrix,
  countPermissions,
  listPermissionNames,
  permissionNamesFromMatrix,
  withoutLegacyModules,
} from './role-permissions';

describe('role permissions helpers', () => {
  it('groups permission names by section', () => {
    expect(buildPermissionMatrix(['orders.view', 'orders.edit', 'roles.create', 'bad'])).toEqual({
      orders: ['view', 'edit'],
      roles: ['create'],
    });
  });

  it('round-trips through the matrix', () => {
    const names = new Set(['orders.view', 'roles.create']);
    expect(permissionNamesFromMatrix(buildPermissionMatrix([...names]))).toEqual(names);
  });

  it('ignores invalid matrices', () => {
    expect(permissionNamesFromMatrix(null).size).toBe(0);
    expect(permissionNamesFromMatrix({ a: 'x' }).size).toBe(0);
  });

  it('hides legacy modules and counts the rest', () => {
    const modules = [
      { section_label_ar: 'طلبات', actions: [{ permission_name: 'orders.view' }, { permission_name: 'orders.edit' }] },
      { section_label_ar: 'مصاريف (قديم)', actions: [{ permission_name: 'x.view' }] },
    ];
    const visible = withoutLegacyModules(modules);
    expect(visible).toHaveLength(1);
    expect(countPermissions(visible)).toBe(2);
    expect(listPermissionNames(visible)).toEqual(['orders.view', 'orders.edit']);
  });
});
