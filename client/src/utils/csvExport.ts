export const csvExport = (rows: Array<Record<string, string | number | boolean | null | undefined>>, fileName: string): void => {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchorElement = document.createElement('a');
  anchorElement.href = downloadUrl;
  anchorElement.download = `${fileName}.csv`;
  anchorElement.style.display = 'none';
  document.body.appendChild(anchorElement);
  anchorElement.click();
  document.body.removeChild(anchorElement);
  URL.revokeObjectURL(downloadUrl);
};
