
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { answerInquiry } from '@/ai/flows/customer-support-flow';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export function SupportChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const openChat = () => {
        if (messages.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages([{ id: 1, text: "Hi! I'm Alex, your personal support agent. How can I help you today?", sender: 'bot' }]);
                setIsLoading(false);
            }, 1000);
        }
        setIsOpen(true);
    };
    
    const closeChat = () => setIsOpen(false);

    useEffect(() => {
        const trigger = document.querySelector('[data-chatbot-trigger]');
        if (trigger) {
            const handleClick = () => openChat();
            trigger.addEventListener('click', handleClick);
            return () => {
                trigger.removeEventListener('click', handleClick);
            }
        }
    }, [messages.length]);


    useEffect(() => {
        if (isOpen && scrollAreaRef.current) {
            setTimeout(() => {
                 if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTo({
                        top: scrollAreaRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponseText = await answerInquiry(inputValue);
            const botMessage: Message = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error getting bot response:", error);
            const errorMessage: Message = { id: Date.now() + 1, text: "I'm having a little trouble connecting right now. Please try again in a moment.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        layoutId="chatbot-window"
                        key="chatbot"
                        className="w-[90vw] max-w-sm h-[70vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border origin-bottom-right"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400" data-ai-hint="support agent" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold">Alex @ inTesters</h3>
                                    <p className="text-xs text-primary-foreground/80 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeChat} className="rounded-full hover:bg-primary/80">
                                <X className="h-5 w-5" />
                            </Button>
                        </header>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex items-end gap-2",
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        )}
                                    >
                                        {message.sender === 'bot' && (
                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400" />
                                                <AvatarFallback>A</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "p-3 rounded-2xl max-w-[80%] text-sm",
                                                message.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                            )}
                                        >
                                            {message.text}
                                        </motion.div>
                                         {message.sender === 'user' && (
                                            <Avatar className="w-8 h-8 flex-shrink-0">
                                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-end gap-2 justify-start">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400" />
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                        <div className="p-3 rounded-2xl bg-secondary rounded-bl-none">
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Form */}
                        <footer className="p-4 border-t">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    autoComplete="off"
                                />
                                <Button type="submit" size="icon" disabled={isLoading}>
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </footer>
                    </motion.div>
                ) : (
                    <motion.button
                        layoutId="chatbot-window"
                        key="button"
                        onClick={openChat}
                        className="flex items-center gap-3 p-3 pl-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all group origin-bottom-right"
                    >
                        <div className="flex items-center gap-2">
                             <Avatar className="w-8 h-8 border-2 border-primary-foreground/50">
                                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400" data-ai-hint="support agent" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">Chat with Alex</span>
                        </div>
                        <div className="bg-primary-foreground/20 rounded-full p-2 group-hover:scale-110 transition-transform">
                             <MessageSquare className="w-5 h-5" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
