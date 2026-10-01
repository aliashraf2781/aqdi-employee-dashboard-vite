/** Who a notification can be sent to, and which endpoint/extra fields each choice needs. */
export const NOTIFICATION_TARGETS = {
  'all-users': { value: 'all-users', label: 'جميع المستخدمين', endpoint: '/admin/notifications/all-users' },
  'all-employees': { value: 'all-employees', label: 'جميع الموظفين', endpoint: '/admin/notifications/all-employees' },
  user: { value: 'user', label: 'مستخدم محدد', endpoint: '/admin/notifications/user', needsUser: true },
  'custom-user': {
    value: 'custom-user',
    label: 'رسالة مخصصة لمستخدم',
    endpoint: '/admin/notifications/custom-user',
    needsUser: true,
  },
  employee: { value: 'employee', label: 'موظف محدد', endpoint: '/admin/notifications/employee', needsEmployee: true },
};

export const NOTIFICATION_TARGET_OPTIONS = Object.values(NOTIFICATION_TARGETS).map(({ value, label }) => ({ value, label }));

const toIdValue = (id) => Number(id) || id;

/** Form values -> `{ endpoint, payload }` for the chosen target. */
export function buildNotificationRequest(values) {
  const target = NOTIFICATION_TARGETS[values.target];
  if (!target) throw new Error('نوع الإشعار غير صالح');

  const payload = { title: values.title.trim(), body: values.body.trim() };
  if (target.needsUser) payload.user_id = toIdValue(values.userId);
  if (target.needsEmployee) payload.employee_id = toIdValue(values.employeeId);

  return { endpoint: target.endpoint, payload };
}
