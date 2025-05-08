/**
 * Convert expenses to CSV format and trigger download
 */
export function downloadExpensesAsCSV(expenses, filename = 'expenses.csv') {
    const headers = ['ID', 'Title', 'Amount', 'Category', 'Date'];
    
    const csvRows = [
      headers.join(','),
      ...expenses.map(expense => {
        return [
          expense.id,
          `"${expense.title.replace(/"/g, '""')}"`,
          expense.amount,
          expense.category,
          expense.date
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Generate a timestamped filename for the CSV
   */
  export function generateCSVFilename(prefix = 'expenses') {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${prefix}_${timestamp}.csv`;
  }