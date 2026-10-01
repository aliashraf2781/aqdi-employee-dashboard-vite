export const clientsKeys = {
  all: ['clients'],
  list: (params) => ['clients', 'list', params],
  detail: (clientId) => ['clients', 'detail', String(clientId)],
  coupons: (clientId) => ['clients', 'coupons', String(clientId)],
};
