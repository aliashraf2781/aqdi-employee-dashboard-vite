import { describe, expect, it } from 'vitest';
import { buildCreateRolePayload, buildUpdateRolePayload, roleToFormValues } from './role-form';

const ALL = ['orders.view', 'orders.edit', 'roles.view'];

describe('role form helpers', () => {
  it('sends every permission when "activate all" is on', () => {
    const payload = buildCreateRolePayload(
      { name: ' key ', title_ar: ' عنوان ', description: '', activate_all: true, permissions: [] },
      ALL,
    );
    expect(payload.permission_matrix).toEqual({ orders: ['view', 'edit'], roles: ['view'] });
    expect(payload.name).toBe('key');
    expect(payload.description).toBeNull();
    expect(payload.activate_all_permissions).toBe(true);
  });

  it('sends only the selected permissions otherwise', () => {
    const payload = buildCreateRolePayload(
      { name: 'k', title_ar: 't', description: 'd', activate_all: false, permissions: ['orders.view'] },
      ALL,
    );
    expect(payload.permission_matrix).toEqual({ orders: ['view'] });
  });

  it('converts the employee id for updates', () => {
    const values = { title_ar: 't', description: '', activate_all: false, permissions: ['roles.view'], is_active: false, employee_id: '7' };
    expect(buildUpdateRolePayload(values, ALL, { title_en: 'x' })).toMatchObject({
      employee_id: 7,
      is_active: false,
      title_en: 'x',
    });
  });

  it('detects full access from the matrix', () => {
    const role = { title_ar: 't', permission_matrix: { orders: ['view', 'edit'], roles: ['view'] } };
    expect(roleToFormValues(role, ALL).activate_all).toBe(true);
    expect(roleToFormValues({ ...role, permission_matrix: { orders: ['view'] } }, ALL).activate_all).toBe(false);
  });
});
