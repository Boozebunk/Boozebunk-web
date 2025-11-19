'use client';

import { useRef, useState } from 'react';

import { AlertCircle, Download, Upload, X } from 'lucide-react';

import { stockTemplateFields } from '~/types/stock';

import { Alert, AlertDescription } from '../shadcn/alert';
import { Button } from '../shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../shadcn/table';

import type React from 'react';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVImportProps {
  onImport?: (data: string[][]) => Promise<void>;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate example CSV content
  const generateExampleCSV = () => {
    const headers = stockTemplateFields.map((field) => field.label);
    const exampleRows = [
      ['Johnnie Walker', 'Blue Label', 'Whiskey', 'Blended Scotch Whisky', '750ml', '12000'],
      ['Hennessy', 'Hennessy V.S', 'Brandy', 'Cognac', '1L', '1800'],
      ['Stolichnaya', 'Stolichnaya Premium Vodka', 'Vodka', 'Grain Vodka', '1.75L', '11000']
    ];

    const csvContent = [headers, ...exampleRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Download example CSV file
  const downloadExampleCSV = () => {
    const csvContent = generateExampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_template_example.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV content
  const parseCSV = (content: string): CSVData => {
    const lines = content.trim().split('\n');
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map((line) => parseCSVLine(line));

    return { headers, rows };
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = parseCSV(content);

        // Validate headers match template
        const expectedHeaders = stockTemplateFields.map((field) => field.label);
        const missingHeaders = expectedHeaders.filter(
          (header) => !parsedData.headers.includes(header)
        );

        if (missingHeaders.length > 0) {
          setError(`Missing required columns: ${missingHeaders.join(', ')}`);
          return;
        }

        setCsvData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  };

  // Clear uploaded file
  const clearFile = () => {
    setCsvData(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!csvData) return;

    setIsImporting(true);
    try {
      if (onImport) {
        // Filter data to only include relevant columns and non-empty rows
        const filteredHeaders = csvData.headers.filter((header) =>
          stockTemplateFields.some((field) => field.label === header)
        );
        const filteredRows = csvData.rows
          .filter((row) => row.some((cell) => cell && cell.trim() !== ''))
          .map((row) => {
            return filteredHeaders.map((header) => {
              const originalIndex = csvData.headers.indexOf(header);
              return row[originalIndex] || '';
            });
          });

        await onImport(filteredRows);
      } else {
        // Fallback behavior if no onImport prop provided
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert('Stock data imported successfully!');
      }

      // Reset form after successful import
      clearFile();
    } catch (err: unknown) {
      setError(`Failed to import data. Please try again. ${err}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-4">
          {/* Download Example */}
          {!fileName && (
            <div className="bg-muted/50 border-border flex flex-col gap-3 rounded-lg border p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-foreground text-lg font-semibold">Example Template</h3>
                <Button
                  onClick={downloadExampleCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Example
                </Button>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm sm:whitespace-nowrap">
                Download a sample CSV file with the correct format for easier setup
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 flex-1 text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
              />
              {fileName && (
                <Button onClick={clearFile} variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* CSV Preview */}
      {csvData && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvData.headers
                      .filter((header) =>
                        stockTemplateFields.some((field) => field.label === header)
                      )
                      .map((header, index) => (
                        <TableHead key={index} className="font-medium">
                          {header}
                          {stockTemplateFields.find((f) => f.label === header)?.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.rows
                    .filter((row) => row.some((cell) => cell && cell.trim() !== ''))
                    .slice(0, 10)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {csvData.headers
                          .filter((header) =>
                            stockTemplateFields.some((field) => field.label === header)
                          )
                          .map((header, cellIndex) => {
                            const originalIndex = csvData.headers.indexOf(header);
                            const cell = row[originalIndex] || '';
                            return (
                              <TableCell key={cellIndex} className="max-w-32 truncate">
                                {cell || (
                                  <span className="text-muted-foreground italic">empty</span>
                                )}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            {(() => {
              const filteredRows = csvData.rows.filter((row) =>
                row.some((cell) => cell && cell.trim() !== '')
              );
              return (
                filteredRows.length > 10 && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Showing first 10 rows of {filteredRows.length} total rows with data
                  </p>
                )
              );
            })()}

            <div className="mt-4 flex justify-end">
              <Button onClick={handleImport} disabled={isImporting} className="w-full sm:w-fit">
                {isImporting ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
