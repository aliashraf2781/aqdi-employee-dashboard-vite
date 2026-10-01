export function EmptyNote({ children = 'لا توجد بيانات في هذه الفترة.' }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
