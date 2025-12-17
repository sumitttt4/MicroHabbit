import React, { useState, useEffect } from 'react';
import { PenLine, Save, Trash2, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';

interface JournalEntry {
    id: string;
    date: string;
    content: string;
    mood?: 'happy' | 'neutral' | 'sad';
}

const JournalScreen: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntry, setNewEntry] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Load entries from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('microhabit_journal');
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntry = () => {
        if (!newEntry.trim()) return;

        const entry: JournalEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content: newEntry,
            mood: 'neutral'
        };

        const updatedEntries = [entry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('microhabit_journal', JSON.stringify(updatedEntries));
        setNewEntry('');
        setIsDialogOpen(false);
    };

    const deleteEntry = (id: string) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem('microhabit_journal', JSON.stringify(updated));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold">Reflections</h2>
                    <p className="text-muted-foreground">Capture your thoughts.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PenLine className="w-4 h-4 mr-2" /> Write
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            placeholder="What's on your mind?"
                            className="min-h-[200px] resize-none font-serif text-lg leading-relaxed bg-muted/20"
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveEntry}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ScrollArea className="h-[500px] pr-4">
                {entries.length === 0 ? (
                    <Card className="border-dashed bg-transparent shadow-none">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <PenLine className="w-12 h-12 opacity-20 mb-4" />
                            <p>Journal is empty.</p>
                            <Button variant="link" onClick={() => setIsDialogOpen(true)}>Start writing</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {entries.map(entry => (
                            <Card key={entry.id} className="group transition-all hover:bg-muted/50">
                                <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarIcon className="w-4 h-4" />
                                        {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-destructive" onClick={() => deleteEntry(entry.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="text-base font-serif leading-relaxed whitespace-pre-wrap">
                                    {entry.content}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default JournalScreen;
