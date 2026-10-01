import { useTenantRoles } from '../../hooks/use-reference-data';
import { roleInputLabel } from '../../lib/financial-display';
import { resolveOtherConditionsList, resolveTenantRoleDetails } from '../../lib/contract-terms-display';
import { getOrderFinancialStep } from '../../lib/order-detail-steps';
import { Field } from './detail-fields';

function RolesList({ roles }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-muted-foreground">صلاحيات المستأجر</p>
      <ul className="space-y-1.5">
        {roles.map((role) => {
          const inputLabel = roleInputLabel(role.inputLabel);
          return (
            <li key={role.id ?? role.label} className="rounded-xl bg-muted px-3 py-2 text-xs">
              <p className="font-bold">{role.label}</p>
              {role.value && <p className="mt-0.5 font-medium text-muted-foreground">{inputLabel ? `${inputLabel}: ${role.value}` : role.value}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Tenant permissions, guarantee amount and the other conditions saved on the order. */
export function SavedTerms({ order, orderData }) {
  const { items: rolesCatalog } = useTenantRoles(Boolean(orderData));
  const financial = order.financial ?? {};
  const step = orderData ? getOrderFinancialStep(orderData) : {};

  const roles = orderData ? resolveTenantRoleDetails(orderData, rolesCatalog) : (financial.tenant_roles ?? []);
  const otherConditions = orderData ? resolveOtherConditionsList(orderData) : (financial.other_conditions ?? []);
  const guarantee = financial.guarantee_amount || step.Guarantee_amount || step.guarantee_amount;

  if (roles.length === 0 && otherConditions.length === 0 && !guarantee) return null;

  return (
    <div className="space-y-2.5 border-t border-border pt-2">
      <p className="text-xs font-bold text-muted-foreground">الصلاحيات والالتزامات</p>
      {roles.length > 0 && <RolesList roles={roles} />}
      <Field label="مبلغ الضمان" value={guarantee} />
      {otherConditions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground">شروط أخرى</p>
          <ol className="list-inside list-decimal space-y-1 text-xs font-bold">
            {otherConditions.map((item, index) => (
              <li key={`${index}-${item}`} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
