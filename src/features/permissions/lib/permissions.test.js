import { describe, expect, it } from 'vitest';
import { canAccess, isSuperAdmin, normalizeUserPermissions } from './permissions';

describe('permissions', () => {
  it('reads permissions from the permission_matrix when no list is present', () => {
    const user = { permission_matrix: { orders: ['view', 'edit'] } };
    expect(normalizeUserPermissions(user)).toEqual(['orders.view', 'orders.edit']);
  });

  it('prefers `permissions` over `permission_names`', () => {
    const user = { permissions: ['a.view'], permission_names: ['b.view'] };
    expect(normalizeUserPermissions(user)).toEqual(['a.view']);
  });

  it('grants everything to a system admin only', () => {
    expect(isSuperAdmin({ is_system_admin: true })).toBe(true);
    expect(isSuperAdmin({ role: { name: 'admin' } })).toBe(false);
    expect(canAccess([], { is_system_admin: true }, 'roles', 'delete')).toBe(true);
  });

  it('treats an array of sections as any-of and a wildcard as all actions', () => {
    expect(canAccess(['blogs.view'], {}, ['faqs', 'blogs'])).toBe(true);
    expect(canAccess(['roles.*'], {}, 'roles', 'delete')).toBe(true);
    expect(canAccess([], {}, 'roles')).toBe(false);
  });
});
