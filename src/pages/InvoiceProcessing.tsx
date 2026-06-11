import React, {useState, useEffect} from 'react';
import {UploadCloud, File, CheckCircle, Trash2, Loader2, Plus} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../components/ui/Table';
import type {Invoice} from '../types';
import {
    uploadInvoice,
    approveInvoice,
    fetchInvoices,
    fetchInvoiceDetail,
    deleteInvoice,
    deleteInvoiceItem,
    updateInvoiceItem
} from '../lib/api';

export function InvoiceProcessing() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isApproving, setIsApproving] = useState(false);

    const loadInvoices = async () => {
        setIsLoadingList(true);
        try {
            const data = await fetchInvoices();
            setInvoices(data);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInvoices().catch(console.error);
    }, []);

    const handleSelectInvoice = async (id: string) => {
        try {
            const data = await fetchInvoiceDetail(id);
            setActiveInvoice(data);
        } catch (err) {
            console.error("Failed to fetch invoice details", err);
        }
    };

    const handleDeleteInvoice = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Bu faturayı silmek istediğinize emin misiniz?")) return;
        try {
            await deleteInvoice(id);
            if (activeInvoice?.id === id) setActiveInvoice(null);
            await loadInvoices();
        } catch (err) {
            console.error("Failed to delete invoice", err);
            toast.error("Silme başarısız.");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (file.type !== 'application/pdf') {
            toast.error("Lütfen bir PDF dosyası yükleyin.");
            return;
        }

        try {
            setIsUploading(true);
            const response = await uploadInvoice(file);
            setActiveInvoice(response);
            await loadInvoices();
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Fatura yüklenirken hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleApprove = async () => {
        if (!activeInvoice) return;
        try {
            setIsApproving(true);
            await approveInvoice(activeInvoice.id);
            toast.success('Fatura başarıyla onaylandı ve stoğa işlendi!');
            setActiveInvoice(null);
            await loadInvoices();
        } catch (err) {
            console.error("Approve failed", err);
            toast.error('Fatura onaylanırken bir hata oluştu.');
        } finally {
            setIsApproving(false);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!activeInvoice) return;
        if (!confirm("Bu öğeyi listeden çıkarmak istediğinize emin misiniz?")) return;
        try {
            await deleteInvoiceItem(itemId);
            // Refresh active invoice details
            await handleSelectInvoice(activeInvoice.id);
        } catch (err) {
            console.error("Delete item failed", err);
        }
    };

    const handleItemChange = async (itemId: string, field: 'clean_name' | 'quantity' | 'category_name', value: string | number) => {
        if (!activeInvoice) return;

        // Optistic UI update
        setActiveInvoice(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                items: prev.items.map(item => item.id === itemId ? {...item, [field]: value} : item)
            };
        });

        // Real API update
        try {
            await updateInvoiceItem(itemId, {[field]: value});
        } catch (err) {
            console.error("Failed to update item", err);
            // Revert in a real app, keeping it simple here
        }
    };

    const unprocessedItemsCount = activeInvoice?.items.filter(i => !i.is_processed).length || 0;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Invoice Processing & Staging</h1>
                {activeInvoice && unprocessedItemsCount > 0 && (
                    <Button onClick={handleApprove} disabled={isApproving}
                            className="bg-green-600 hover:bg-green-700 text-white border-0">
                        {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                            <CheckCircle className="mr-2 h-4 w-4"/>}
                        Faturayı Onayla ({unprocessedItemsCount} Öğeyi İşle)
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Left Sidebar: Invoices List */}
                <div className="col-span-1 lg:col-span-3 flex flex-col h-full space-y-4">
                    <Button
                        className="w-full"
                        variant={activeInvoice === null ? "default" : "outline"}
                        onClick={() => setActiveInvoice(null)}
                    >
                        <Plus className="mr-2 h-4 w-4"/> Yeni Fatura Yükle
                    </Button>

                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm">Geçmiş Faturalar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto p-0">
                            {isLoadingList ? (
                                <div className="p-4 flex justify-center"><Loader2
                                    className="h-6 w-6 animate-spin text-muted-foreground"/></div>
                            ) : invoices.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground text-center">Fatura bulunamadı.</div>
                            ) : (
                                <div className="flex flex-col divide-y">
                                    {invoices.map(inv => (
                                        <div
                                            key={inv.id}
                                            onClick={() => handleSelectInvoice(inv.id)}
                                            className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group ${activeInvoice?.id === inv.id ? 'bg-muted border-l-2 border-primary' : ''}`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium truncate">{inv.store_name}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                onClick={(e) => handleDeleteInvoice(inv.id, e)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Main Area */}
                <div className="col-span-1 lg:col-span-9 flex flex-col h-full min-h-[500px]">
                    {!activeInvoice ? (
                        // Upload UI
                        <div
                            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('invoice-upload')?.click()}
                        >
                            <input
                                id="invoice-upload"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                {isUploading ? <Loader2 className="h-10 w-10 text-primary animate-spin"/> :
                                    <UploadCloud className="h-10 w-10 text-primary"/>}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {isUploading ? "Yapay Zeka Faturayı Okuyor..." : "PDF Fatura Yükle"}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                {isUploading
                                    ? "Bu işlem fatura boyutuna göre birkaç saniye sürebilir."
                                    : "Tedarikçi faturanızı buraya sürükleyin veya seçmek için tıklayın. AI sistemimiz parçaları otomatik ayıklayacaktır."}
                            </p>
                            {!isUploading && <Button variant="outline">Dosya Seç</Button>}
                        </div>
                    ) : (
                        // Detail UI
                        <Card className="flex-1 flex flex-col h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <File className="h-5 w-5 text-blue-500"/>
                                        <span>{activeInvoice.store_name} Faturası</span>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Yüklenme: {new Date(activeInvoice.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Toplam
                                        Tutar: {activeInvoice.total_amount ? `₺${activeInvoice.total_amount}` : '-'}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-0 border-t">
                                {activeInvoice.items.length === 0 ? (
                                    <div className="flex justify-center items-center h-48 text-muted-foreground">Bu
                                        faturada işlenecek parça bulunamadı.</div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0">
                                            <TableRow>
                                                <TableHead>Raw Name</TableHead>
                                                <TableHead>Clean Name</TableHead>
                                                <TableHead className="w-24">Qty</TableHead>
                                                <TableHead className="w-48">Category</TableHead>
                                                <TableHead className="w-16"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {activeInvoice.items.map((item) => (
                                                <TableRow key={item.id}
                                                          className={item.is_processed ? "opacity-50 bg-muted/20" : ""}>
                                                    <TableCell
                                                        className="text-xs text-muted-foreground font-mono truncate max-w-[150px]"
                                                        title={item.raw_name}>
                                                        {item.raw_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={item.clean_name || ''}
                                                            onChange={(e) => handleItemChange(item.id, 'clean_name', e.target.value)}
                                                            disabled={item.is_processed}
                                                            className="h-8"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                            disabled={item.is_processed}
                                                            className="h-8 w-20"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={item.category_name || ''}
                                                            onChange={(e) => handleItemChange(item.id, 'category_name', e.target.value)}
                                                            disabled={item.is_processed}
                                                            className="h-8"
                                                            placeholder="Kategori Girin"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {!item.is_processed && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                                onClick={() => handleDeleteItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
