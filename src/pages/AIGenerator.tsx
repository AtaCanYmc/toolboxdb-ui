import React, {useState, useRef, useEffect} from 'react';
import {Card, CardContent} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {Sparkles, Send, Bot, User, Loader2} from 'lucide-react';
import {toast} from 'react-hot-toast';
import {useTranslation} from 'react-i18next';
import {sendChatMessage} from '../lib/api';
import type {ChatMessage, ChatResponse} from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AIGenerator() {
    const {t} = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = sessionStorage.getItem('ai_chat_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }
        return [
            {
                role: 'assistant',
                content: 'Hello! I am your AI Hardware Consultant. Let me know what kind of project you want to build or if you need help optimizing your BOM.'
            }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        sessionStorage.setItem('ai_chat_history', JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');

        // Optimistically update UI
        const newMessages: ChatMessage[] = [...messages, {role: 'user', content: userMsg}];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Backend payload expects current message + history.
            // We pass the history prior to the current message so the backend appends the user message automatically.
            const res: ChatResponse = await sendChatMessage({
                message: userMsg,
                history: messages
            });

            setMessages(prev => [...prev, {role: 'assistant', content: res.response}]);
        } catch (err) {
            console.error(err);
            toast.error('Failed to communicate with AI');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend().catch(err => console.error("Error in handleSend", err));
        }
    };

    const handleClear = () => {
        const initial: ChatMessage[] = [{
            role: 'assistant',
            content: 'Hello! I am your AI Hardware Consultant. Let me know what kind of project you want to build or if you need help optimizing your BOM.'
        }];
        setMessages(initial);
        sessionStorage.removeItem('ai_chat_history');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[850px] space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-indigo-500"/>
                    {t('ai.title', 'Hardware Consultant')}
                </h1>
                <Button variant="outline" onClick={handleClear}>Clear Chat</Button>
            </div>

            <Card className="flex flex-col flex-1 overflow-hidden border shadow-sm">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx}
                             className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div
                                    className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="h-5 w-5 text-indigo-600"/>
                                </div>
                            )}

                            <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                                msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                            }`}>
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                ) : (
                                    <div
                                        className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div
                                    className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="h-5 w-5 text-gray-600"/>
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div
                                className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="h-5 w-5 text-indigo-600"/>
                            </div>
                            <div
                                className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400"/>
                                <span className="ml-3 text-sm font-medium text-gray-500">Consultant is typing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-1"/>
                </CardContent>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tell me what you'd like to build..."
                            disabled={loading}
                            className="flex-1 bg-white"
                        />
                        <Button onClick={handleSend} disabled={!input.trim() || loading} className="gap-2 px-6">
                            <Send className="h-4 w-4"/>
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
