import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../components/ui/Table';
import {Tags, Loader2, Trash2, Edit2, Plus, X, Check} from 'lucide-react';
import {toast} from 'react-hot-toast';
import {fetchCategories, createCategory, updateCategory, deleteCategory} from '../lib/api';
import type {Category} from '../types';

export function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData().catch(err => console.error("Error in loadData", err));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsSubmitting(true);
        try {
            await createCategory(newCategoryName.trim());
            setNewCategoryName('');
            await loadData();
        } catch (err) {
            console.error(err);
            toast.error('Kategori oluşturulurken bir hata oluştu veya yetkiniz yok.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        try {
            await deleteCategory(id);
            await loadData();
        } catch (err) {
            console.error(err);
            toast.error('Kategori silinirken bir hata oluştu veya yetkiniz yok.');
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const saveEdit = async (id: number) => {
        if (!editName.trim()) return;

        try {
            await updateCategory(id, editName.trim());
            setEditingId(null);
            await loadData();
        } catch (err) {
            console.error(err);
            toast.error('Kategori güncellenirken bir hata oluştu veya yetkiniz yok.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: Create Form */}
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Tags className="h-5 w-5 text-purple-500"/>
                                Yeni Kategori Ekle
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kategori Adı</label>
                                    <Input
                                        placeholder="Örn: Sensörler"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!newCategoryName.trim() || isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                                        <Plus className="mr-2 h-4 w-4"/>}
                                    Ekle
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: List */}
                <div className="col-span-1 md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Mevcut Kategoriler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    Hiç kategori bulunamadı.
                                </div>
                            ) : (
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Kategori Adı</TableHead>
                                                <TableHead>Oluşturulma Tarihi</TableHead>
                                                <TableHead className="text-right w-24">İşlemler</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((cat) => (
                                                <TableRow key={cat.id}>
                                                    <TableCell className="font-medium">
                                                        {editingId === cat.id ? (
                                                            <Input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                className="h-8 w-full max-w-sm"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') saveEdit(cat.id);
                                                                    if (e.key === 'Escape') cancelEdit();
                                                                }}
                                                            />
                                                        ) : (
                                                            cat.name
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {new Date(cat.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {editingId === cat.id ? (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button variant="ghost" size="icon"
                                                                        className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                                                        onClick={() => saveEdit(cat.id)}>
                                                                    <Check className="h-4 w-4"/>
                                                                </Button>
                                                                <Button variant="ghost" size="icon"
                                                                        className="h-8 w-8 text-muted-foreground"
                                                                        onClick={cancelEdit}>
                                                                    <X className="h-4 w-4"/>
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button variant="ghost" size="icon"
                                                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                                                        onClick={() => startEdit(cat)}>
                                                                    <Edit2 className="h-4 w-4"/>
                                                                </Button>
                                                                <Button variant="ghost" size="icon"
                                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                                        onClick={() => handleDelete(cat.id)}>
                                                                    <Trash2 className="h-4 w-4"/>
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
