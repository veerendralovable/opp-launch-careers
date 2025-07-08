
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/hooks/useChat';
import { useUserPresence } from '@/hooks/useUserPresence';
import { MessageCircle, Send, X, Minimize2, Maximize2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatWidgetProps {
  receiverId?: string;
  roomId?: string;
  title?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ receiverId, roomId, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useChat(roomId, receiverId);
  const { onlineUsers } = useUserPresence();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {onlineUsers.length > 0 && (
          <Badge className="absolute -top-2 -left-2 bg-green-500">
            {onlineUsers.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {title || 'Chat'}
            {onlineUsers.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                <Users className="h-3 w-3 mr-1" />
                {onlineUsers.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
