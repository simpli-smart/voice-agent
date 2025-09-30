import React, { useRef, useEffect, memo } from 'react';
import { usePipecatConversation, Card } from "@pipecat-ai/voice-ui-kit";
import { MessageCircleMore } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ConversationView: React.FC = memo(() => {
  const { messages } = usePipecatConversation();
  const endRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    console.log('messages', messages);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full p-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
          <MessageCircleMore className="w-8 h-8 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">No messages yet</h3>
          <p className="text-sm text-muted-foreground">Start speaking to begin the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message: any, index: number) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                "max-w-[80%] flex gap-3",
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className= "text-xs font-medium bg-muted text-muted-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <Separator orientation="vertical" className="h-3" />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <Card 
                  rounded="xl"
                  className={cn(
                    "p-4 shadow-sm",
                    message.role === 'user' 
                      ? 'bg-primary text-active-foreground' 
                      : 'bg-background border'
                  )}>
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={endRef} />
    </ScrollArea>
  );
});
