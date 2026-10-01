import { FileDown, FileText, Mail, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { downloadReportPdf, exportPanelTablesToCsv, printReportPanel } from '../lib/export-report';

/** Print / PDF / CSV buttons for whatever the `getPanel` callback returns (the visible report). */
export function ReportExportMenu({ getPanel, reportName }) {
  const handlePrint = () => {
    if (!printReportPanel(getPanel())) toast.error('تعذر تجهيز التقرير للطباعة');
  };

  const handlePdf = async () => {
    toast.message('جاري تجهيز ملف PDF...');
    if (!(await downloadReportPdf(getPanel(), reportName))) toast.error('تعذر تصدير التقرير كـ PDF');
  };

  const handleCsv = () => {
    if (!exportPanelTablesToCsv(getPanel(), reportName)) toast.message('لا توجد بيانات جدولية في هذا التقرير للتصدير');
  };

  // TODO: emailing a report needs a backend endpoint that does not exist yet.
  const handleEmail = () => toast.message('إرسال التقرير بالبريد يتطلب دعم من الخادم — قيد التطوير');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="size-4" />
        طباعة
      </Button>
      <Button variant="outline" size="sm" onClick={handlePdf}>
        <FileText className="size-4" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleCsv}>
        <FileDown className="size-4" />
        تصدير CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleEmail}>
        <Mail className="size-4" />
        بريد
        <Badge tone="warning">قيد التطوير</Badge>
      </Button>
    </div>
  );
}
