"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminLogs,
  fetchAdminLogContent,
  deleteAdminLog,
  deleteAdminLogsBatch,
  deleteAdminLogEntry,
} from "@/lib/apiCalls";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  Trash2,
  FileText,
  AlertCircle,
  Terminal,
  MoreHorizontal,
  Eye,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogFile {
  filename: string;
  size: number;
  mtime: string;
}

interface LogEntry {
  level?: string;
  message: string;
  timestamp?: string;
  service?: string;
  stack?: string;
  [key: string]: any;
}

export default function LogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogFile[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogFile | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entrySearchQuery, setEntrySearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<number[]>([]);

  const loadLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const data = await fetchAdminLogs();
      setLogs(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load logs",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const parseLogContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
    return lines.map((line) => {
      try {
        return JSON.parse(line) as LogEntry;
      } catch (e) {
        return { message: line } as LogEntry;
      }
    });
  };

  const loadLogContent = async (file: LogFile) => {
    try {
      setIsLoadingContent(true);
      setSelectedLog(file);
      setIsViewModalOpen(true);
      setExpandedEntries([]);
      
      if (file.filename.endsWith(".gz")) {
        setLogEntries([{ message: "Cannot preview compressed (.gz) logs in browser." }]);
        return;
      }
      
      const data = await fetchAdminLogContent(file.filename);
      const parsed = parseLogContent(data.content || "");
      setLogEntries(parsed);
    } catch (error) {
      setLogEntries([{ message: `Error loading content: ${error instanceof Error ? error.message : "Failed"}` }]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load log entries",
      });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!window.confirm(`Delete entire file ${filename}?`)) return;
    try {
      setIsDeleting(filename);
      await deleteAdminLog(filename);
      toast({ title: "Success", description: "File deleted" });
      setLogs((prev) => prev.filter((l) => l.filename !== filename));
      setSelectedFileNames((prev) => prev.filter((n) => n !== filename));
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Delete failed" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteEntry = async (index: number) => {
    if (!selectedLog) return;
    try {
      // Optistic update
      const entryToDelete = logEntries[index];
      const newEntries = [...logEntries];
      newEntries.splice(index, 1);
      setLogEntries(newEntries);

      await deleteAdminLogEntry(selectedLog.filename, index);
      toast({
        title: "Entry Deleted",
        description: "The specific log line was removed from the file server-side.",
      });
    } catch (error) {
      // Revert if failed
      loadLogContent(selectedLog);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete entry",
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedFileNames.length === 0) return;
    if (!window.confirm(`Delete ${selectedFileNames.length} files?`)) return;
    try {
      setIsDeleting("batch");
      await deleteAdminLogsBatch(selectedFileNames);
      toast({ title: "Success", description: "Batch deleted" });
      setLogs((prev) => prev.filter((l) => !selectedFileNames.includes(l.filename)));
      setSelectedFileNames([]);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Batch delete failed" });
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      log.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  const filteredEntries = useMemo(() => {
    return logEntries
      .map((entry, index) => ({ ...entry, originalIndex: index }))
      .filter((entry) =>
        entry.message.toLowerCase().includes(entrySearchQuery.toLowerCase()) ||
        (entry.level && entry.level.toLowerCase().includes(entrySearchQuery.toLowerCase()))
      );
  }, [logEntries, entrySearchQuery]);

  const toggleExpand = (index: number) => {
    setExpandedEntries((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "error": return "bg-red-500/20 text-red-500 border-red-500/50";
      case "warn": return "bg-amber-500/20 text-amber-500 border-amber-500/50";
      case "info": return "bg-emerald-500/20 text-emerald-500 border-emerald-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 gap-6 dark:bg-slate-950">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground text-sm">Advanced server log management & surgical entry deletion.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadLogs} disabled={isLoadingLogs}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingLogs && "animate-spin")} />
            Refresh
          </Button>
          {selectedFileNames.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBatchDelete} disabled={isDeleting === "batch"}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete {selectedFileNames.length} Files
            </Button>
          )}
        </div>
      </div>

      <div className="bg-background rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4 items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter logs..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={filteredLogs.length > 0 && selectedFileNames.length === filteredLogs.length}
                  onCheckedChange={(checked) => setSelectedFileNames(checked ? filteredLogs.map(l => l.filename) : [])}
                />
              </TableHead>
              <TableHead>Filename</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Modified</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingLogs ? (
               <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
            ) : filteredLogs.map((log) => (
              <TableRow key={log.filename}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedFileNames.includes(log.filename)}
                    onCheckedChange={() => setSelectedFileNames(prev => prev.includes(log.filename) ? prev.filter(n => n !== log.filename) : [...prev, log.filename])}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold">{log.filename}</TableCell>
                <TableCell className="text-right text-xs tabular-nums text-muted-foreground">{(log.size / 1024).toFixed(1)} KB</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{format(new Date(log.mtime), "MMM d, HH:mm")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => loadLogContent(log)}><Eye className="w-4 h-4 mr-2" />View Entries</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFile(log.filename)}><Trash2 className="w-4 h-4 mr-2" />Delete File</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border shadow-2xl">
          <DialogHeader className="p-6 border-b shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-xl font-mono flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                  {selectedLog?.filename}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-mono text-xs">
                  JSON Lines Parsing Enabled • Individual Entry Deletion Active
                </DialogDescription>
              </div>
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search inside log entries..."
                  className="pl-9 h-9 border-muted"
                  value={entrySearchQuery}
                  onChange={(e) => setEntrySearchQuery(e.target.value)}
                />
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full">
              {isLoadingContent ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                  <p className="font-mono text-sm animate-pulse">PARSING_ENTRIES...</p>
                </div>
              ) : (
                <div className="p-6 space-y-2">
                  {filteredEntries.length === 0 ? (
                    <div className="p-20 text-center text-muted-foreground font-mono text-sm opacity-50">
                      NO_ENTRIES_MATCHING_FILTER
                    </div>
                  ) : (
                    filteredEntries.map((entry) => (
                      <div key={entry.originalIndex} className="group relative flex flex-col bg-muted/20 border rounded-lg overflow-hidden transition-all hover:bg-muted/40">
                        <div className="flex items-center gap-4 p-3 pr-10">
                          <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 py-0", getLevelColor(entry.level))}>
                            {entry.level || "LOG"}
                          </Badge>
                          <span className="text-[10px] tabular-nums font-mono text-muted-foreground shrink-0">
                            {entry.timestamp ? format(new Date(entry.timestamp), "HH:mm:ss.SS") : `LINE_${entry.originalIndex + 1}`}
                          </span>
                          <p className="text-xs font-mono font-medium truncate flex-1 opacity-90">{entry.message}</p>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleExpand(entry.originalIndex)}>
                              {expandedEntries.includes(entry.originalIndex) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteEntry(entry.originalIndex)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {expandedEntries.includes(entry.originalIndex) && (
                          <div className="px-3 pb-3 border-t bg-black/5 dark:bg-black/20">
                            <pre className="mt-2 text-[10px] font-mono whitespace-pre-wrap break-all leading-tight text-muted-foreground">
                              {JSON.stringify(entry, null, 2)}
                            </pre>
                            {entry.stack && (
                               <pre className="mt-3 p-2 bg-destructive/5 rounded border border-destructive/10 text-[10px] text-destructive/80 font-mono italic">
                                 {entry.stack}
                               </pre>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="p-4 border-t bg-muted/10 flex justify-between items-center px-8">
             <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex gap-4">
                <span>Showing: {filteredEntries.length} of {logEntries.length}</span>
                <span>•</span>
                <span>Mode: NDJSON</span>
             </div>
             <p className="text-[10px] text-muted-foreground italic hidden sm:block">Click chevron to inspect metadata</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
