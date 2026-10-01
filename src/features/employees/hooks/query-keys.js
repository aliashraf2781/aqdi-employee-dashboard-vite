/** One place for every query key so invalidation never drifts from the queries. */
export const employeeKeys = {
  all: ['allEmployees'],
  list: (page, search) => ['allEmployees', page, search],
  detail: (id) => ['employee', String(id)],
  roleOptions: ['roles-list'],
};

export const roleKeys = {
  all: ['roles'],
  list: (page) => ['roles', page],
  detail: (id) => ['role', String(id)],
  modules: ['roles-create'],
  employeeChoices: ['employees-list-role'],
};

export const kpiKeys = {
  board: (period, dateFrom, dateTo) => ['employee-kpis-board', period, dateFrom, dateTo],
  employee: (id, period, dateFrom, dateTo) => ['employee-kpis-detail', id, period, dateFrom, dateTo],
};
