import { useMemo, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { MetricBar, PageHeader, StatusBadge } from '@/components/shared';
import type { TableColumnConfig, TableFieldConfig, TableRowData, TableValue } from '@/types';
import { cn } from '@/lib/utils';

interface ManagementStat {
  label: string;
  value: string;
  unit?: string;
}

interface ManagementPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  rows: TableRowData[];
  columns: TableColumnConfig[];
  fields: TableFieldConfig[];
  searchKeys: string[];
  statusOptions?: string[];
  createLabel: string;
  idPrefix: string;
  stats: ManagementStat[];
}

const PAGE_SIZE = 7;

function emptyForm(fields: TableFieldConfig[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, field.type === 'select' ? field.options?.[0] ?? '' : '']));
}

export function ManagementPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  rows: initialRows,
  columns,
  fields,
  searchKeys,
  statusOptions = [],
  createLabel,
  idPrefix,
  stats,
}: ManagementPageProps) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>(() => emptyForm(fields));

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !normalized || searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(normalized));
      const matchesStatus = statusFilter === 'all' || String(row.status ?? '') === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, rows, searchKeys, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditingIndex(null);
    setFormData(emptyForm(fields));
    setDialogOpen(true);
  };

  const openEdit = (row: TableRowData) => {
    const index = rows.indexOf(row);
    setEditingIndex(index);
    setFormData(Object.fromEntries(fields.map((field) => [field.key, String(row[field.key] ?? '')])));
    setDialogOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = fields.find((field) => field.required !== false && !formData[field.key]?.trim());
    if (missing) {
      toast.error(`请填写${missing.label}`);
      return;
    }

    const nextRow: TableRowData = { ...formData };
    fields.forEach((field) => {
      if (field.type === 'number') nextRow[field.key] = Number(formData[field.key] || 0);
    });
    if (!nextRow.id) nextRow.id = `${idPrefix}-${String(rows.length + 1).padStart(3, '0')}`;

    if (editingIndex === null) {
      setRows((current) => [nextRow, ...current]);
      toast.success(`${title}已新增`);
    } else {
      setRows((current) => current.map((row, index) => (index === editingIndex ? nextRow : row)));
      toast.success(`${title}已更新`);
    }
    setDialogOpen(false);
    setPage(1);
  };

  const handleDelete = (row: TableRowData) => {
    if (!window.confirm(`确认删除 ${String(row.name ?? row.id)}？`)) return;
    setRows((current) => current.filter((item) => item !== row));
    toast.success('记录已删除');
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={<Button onClick={openCreate} className="brand-gradient border-0 text-white shadow-lg shadow-brand-500/20"><Plus className="size-4" />{createLabel}</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="app-surface rounded-xl px-4 py-3">
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-mono text-xl font-semibold text-foreground">{stat.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{stat.unit}</span></p>
          </div>
        ))}
      </div>

      <section className="app-surface overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={`搜索${title}`} className="h-9 bg-background/60 pl-9 text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-brand-500/20 bg-brand-500/8 text-[10px] text-brand-700 dark:text-brand-200">共 {filteredRows.length} 条</Badge>
            {statusOptions.length > 0 && (
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                <SelectTrigger className="h-9 w-32 bg-background/60 text-xs"><SelectValue placeholder="全部状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {statusOptions.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-brand-500/6 dark:bg-brand-400/5">
              <TableRow className="border-border/60 hover:bg-transparent">
                {columns.map((column) => <TableHead key={column.key} style={{ width: column.width }} className="h-10 whitespace-nowrap text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{column.label}</TableHead>)}
                <TableHead className="w-14 text-right text-[10px] text-muted-foreground">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 1} className="h-32 text-center text-sm text-muted-foreground">暂无匹配记录</TableCell></TableRow>
              ) : currentRows.map((row) => (
                <TableRow key={String(row.id)} className="border-border/50 transition-colors hover:bg-brand-500/5">
                  {columns.map((column) => {
                    const value = row[column.key] as TableValue;
                    return (
                      <TableCell key={column.key} className={cn('whitespace-nowrap text-xs text-foreground/80', column.format === 'mono' && 'font-mono')}>
                        {column.format === 'status' ? <StatusBadge status={String(value)} /> : column.format === 'progress' ? (
                          <div className="flex min-w-28 items-center gap-2"><MetricBar value={Number(value)} /><span className="w-9 text-right font-mono text-[10px] text-muted-foreground">{value}%</span></div>
                        ) : column.format === 'number' ? Number(value).toLocaleString('zh-CN') : String(value)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-xs"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(row)}><Eye className="size-3.5" />查看 / 编辑</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(row)}><Pencil className="size-3.5" />快速编辑</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row)}><Trash2 className="size-3.5" />删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-[11px] text-muted-foreground">
          <span>第 {page} / {pageCount} 页</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="size-3.5" /></Button>
            <Button variant="outline" size="icon-xs" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight className="size-3.5" /></Button>
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-brand-500/20 bg-popover sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Icon className="size-4 text-brand-500" />{editingIndex === null ? createLabel : `编辑${title}`}</DialogTitle>
            <DialogDescription>本地 Mock 数据，保存后仅当前页面生效。</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className={cn('space-y-1.5', field.type === 'textarea' && 'sm:col-span-2')}>
                  <Label htmlFor={`field-${field.key}`} className="text-xs">{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select value={formData[field.key]} onValueChange={(value) => setFormData((current) => ({ ...current, [field.key]: value }))}>
                      <SelectTrigger id={`field-${field.key}`} className="w-full"><SelectValue placeholder={field.placeholder ?? `请选择${field.label}`} /></SelectTrigger>
                      <SelectContent>{field.options?.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea id={`field-${field.key}`} value={formData[field.key]} onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} />
                  ) : (
                    <Input id={`field-${field.key}`} type={field.type === 'number' ? 'number' : 'text'} value={formData[field.key]} onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder ?? `请输入${field.label}`} />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button type="submit" className="brand-gradient border-0 text-white">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
