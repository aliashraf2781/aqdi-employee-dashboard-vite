export function EmptyState({ message = 'لا توجد بيانات للعرض' }) {
  return <div className="py-12 text-center text-sm text-muted-foreground">{message}</div>;
}
