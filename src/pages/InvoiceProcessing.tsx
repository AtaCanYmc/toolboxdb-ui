import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import type { InvoiceExtractedItem } from '../types';
import { uploadInvoice, approveInvoice } from '../lib/api';

export function InvoiceProcessing() {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<InvoiceExtractedItem[]>([]);

  const [activeInvoiceId, setActiveInvoiceId] = useState<string>('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        try {
          setIsParsing(true);
          const response = await uploadInvoice(droppedFile);
          setActiveInvoiceId(response.id);
          setParsedItems(response.items || []);
        } catch (error) {
          console.error("Upload failed", error);
        } finally {
          setIsParsing(false);
        }
      }
    }
  };

  const handleApprove = async () => {
    if (!activeInvoiceId) return;
    try {
      await approveInvoice(activeInvoiceId);
      alert('Fatura başarıyla onaylandı ve stoğa işlendi!');
      setFile(null);
      setParsedItems([]);
      setActiveInvoiceId('');
    } catch (err) {
      console.error("Approve failed", err);
      alert('Fatura onaylanırken bir hata oluştu.');
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceExtractedItem, value: string | number) => {
    setParsedItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Processing & Staging</h1>
        {parsedItems.length > 0 && (
          <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white border-0">
            <CheckCircle className="mr-2 h-4 w-4" />
            Faturayı Onayla ve Stoğa İşle
          </Button>
        )}
      </div>

      {!file ? (
        <div 
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/30 hover:bg-card/50 transition-colors cursor-pointer min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <UploadCloud className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Invoice PDF</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Drag and drop your supplier invoice here to let our AI automatically extract and categorize the components.
          </p>
          <Button variant="outline">Select File</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Left Panel: PDF Summary */}
          <div className="col-span-1 lg:col-span-4 flex flex-col h-full">
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-blue-500" />
                  <span>{file.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center h-full text-center border border-dashed border-border">
                  {/* Simulate PDF Preview placeholder */}
                  <File className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">PDF Preview / Metadata View</p>
                  <p className="text-xs text-muted-foreground mt-2">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Data Extraction & Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col h-full">
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader>
                <CardTitle>AI Extracted Components</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {isParsing ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground animate-pulse">AI is parsing the invoice...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0">
                      <TableRow>
                        <TableHead>Raw Name</TableHead>
                        <TableHead>Clean Name</TableHead>
                        <TableHead className="w-24">Qty</TableHead>
                        <TableHead className="w-48">Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                            {item.raw_name}
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.clean_name} 
                              onChange={(e) => handleItemChange(item.id, 'clean_name', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <select 
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              value={item.category}
                              onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                            >
                              <option value="Microcontrollers">Microcontrollers</option>
                              <option value="Passives">Passives</option>
                              <option value="Sensors">Sensors</option>
                              <option value="Power">Power</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
