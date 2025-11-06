// Helper function to convert an array of objects to a CSV string.
const convertToCSV = (objArray: any[]): string => {
    if (objArray.length === 0) return '';
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    // Header
    for (const index in objArray[0]) {
        row += index + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';

    // Data
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
            if (line !== '') line += ',';
            
            let value = array[i][index];
            if (Array.isArray(value)) {
                // Join array values into a single string, e.g., for tags
                value = `"${value.join('; ')}"`;
            } else if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                // Quote strings with commas or newlines
                value = `"${value.replace(/"/g, '""')}"`;
            }
            line += value;
        }
        str += line + '\r\n';
    }
    return str;
};

// Triggers a browser download for a file with the given content.
const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

export const exportToCsv = (data: any[], fileName: string) => {
    if (!fileName.endsWith('.csv')) fileName += '.csv';
    const csvString = convertToCSV(data);
    downloadFile(csvString, fileName, 'text/csv;charset=utf-8;');
};

export const exportToJson = (data: any, fileName: string) => {
    if (!fileName.endsWith('.json')) fileName += '.json';
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, fileName, 'application/json;charset=utf-8;');
};
