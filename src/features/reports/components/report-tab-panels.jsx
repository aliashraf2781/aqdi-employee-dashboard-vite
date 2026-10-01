import { CustomersPanel } from './panels/customers-panel';
import { EmployeesPanel } from './panels/employees-panel';
import { MarketingPanel } from './panels/marketing-panel';
import { OperatingExpensesPanel } from './panels/operating-expenses-panel';
import { OrdersPanel } from './panels/orders-panel';
import { PerformancePanel } from './panels/performance-panel';
import { ProfitsPanel } from './panels/profits-panel';
import { SalesPanel } from './panels/sales-panel';

const PANELS = {
  orders: OrdersPanel,
  sales: SalesPanel,
  profits: ProfitsPanel,
  'operating-expenses': OperatingExpensesPanel,
  employees: EmployeesPanel,
  customers: CustomersPanel,
  marketing: MarketingPanel,
  performance: PerformancePanel,
};

/** Renders the analysis panel that belongs to `tabId`. */
export function ReportTabPanel({ tabId, filters }) {
  const Panel = PANELS[tabId];
  return <Panel filters={filters} />;
}
