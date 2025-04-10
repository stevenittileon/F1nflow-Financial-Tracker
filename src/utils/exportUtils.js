export const exportToCSV = (data, filename) => {
  // Convert data to CSV format
  const csvContent = convertToCSV(data);
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const convertToCSV = (data) => {
  // If data is an array of objects, convert it to CSV
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
  
  // If data is a single object, convert it to CSV
  const headers = Object.keys(data);
  const values = headers.map(header => {
    const value = data[header];
    return typeof value === 'string' && value.includes(',') 
      ? `"${value}"` 
      : value;
  });
  
  return [headers.join(','), values.join(',')].join('\n');
};

export const exportToExcel = (data, filename) => {
  // Convert data to CSV format
  const csvContent = convertToCSV(data);
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set the link attributes
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 