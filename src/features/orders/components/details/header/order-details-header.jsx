import { getOrderContractUuid } from '../../../lib/order-contact';
import { HEADER_ACTIONS } from '../../../lib/order-header-rules';
import {
  AddNoteButton,
  BackLink,
  ContractTypeBadge,
  ContractTypeChip,
  DateChip,
  DocumentationDeadlineChip,
  OrderNumberButton,
  PaidBadge,
  PhoneChips,
  ReceiverChip,
  SourceChip,
} from './header-chips';
import { HeaderActionPills } from './header-action-pills';
import { HeaderActionsMenu } from './header-actions-menu';
import { HeaderStatusSelect } from './header-status-select';

/**
 * Top card of the order details page: order number, status menu, customer, payment, dates and actions.
 * `actions` maps each HEADER_ACTIONS id to its handler; `view` is the mapped order and `orderData` the API order.
 */
export function OrderDetailsHeader({ view, orderData, back, statuses, canChangeStatus, isStatusPending, actions, onOpenNotes, payLink }) {
  const orderUuid = view.uuid || getOrderContractUuid(orderData) || '';

  return (
    <div className="space-y-3 rounded-card bg-surface px-5 py-3 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <BackLink href={back.href} label={back.label} />
        <OrderNumberButton uuid={view.uuid} />
        <ContractTypeChip view={view} />
        <HeaderStatusSelect
          view={view}
          orderData={orderData}
          statuses={statuses}
          disabled={!canChangeStatus || isStatusPending}
          onStatusChange={actions.changeStatus}
          onSendDraft={actions[HEADER_ACTIONS.SEND_DRAFT]}
          onEjarDocumentation={actions[HEADER_ACTIONS.EJAR_DOCUMENTATION]}
        />
        <ReceiverChip employeeName={view.employee_name} />
        <PhoneChips mobile={view.user_mobile} />
        <ContractTypeBadge contractType={view.contract_type} />
        <PaidBadge isPaid={view.is_paid} />
        <DateChip value={view.received_at} />
        <DocumentationDeadlineChip value={view.documentation_deadline_at} />
        <SourceChip source={view.app_or_web} />
        {onOpenNotes && <AddNoteButton onClick={onOpenNotes} />}
        <HeaderActionsMenu
          orderData={orderData}
          orderUuid={orderUuid}
          isCopyingPayLink={payLink.isCopying}
          onCopyPayLink={() => payLink.copy(orderUuid)}
          onSms={actions.sms}
          onSendSectionError={actions.sendSectionError}
        />
      </div>

      <HeaderActionPills view={view} orderData={orderData} handlers={actions} />

      {view.banner && <div className="rounded-xl bg-warning-soft px-4 py-2.5 text-sm font-bold text-warning">{view.banner}</div>}
    </div>
  );
}
