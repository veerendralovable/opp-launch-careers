
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
  const subscriptionRef = useRef<any>(null);
  
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useChat(roomId, receiverId);
  const { onlineUsers } = useUserPresence();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up ChatWidget subscription');
        subscriptionRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg hover:scale-110 transition-all duration-300 bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        {onlineUsers.length > 0 && (
          <Badge className="absolute -top-2 -left-2 bg-green-500 animate-pulse">
            {onlineUsers.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 max-h-[28rem] sm:max-h-96 animate-scale-in">
      <Card className="shadow-xl border-2 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-sm flex items-center gap-2 truncate">
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{title || 'Chat'}</span>
            {onlineUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white">
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
              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0">
            <div className="h-48 sm:h-64 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {loading ? (
                <div className="text-center text-gray-500 py-8 animate-pulse">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="mt-2">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex animate-fade-in ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t bg-white flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border-gray-200 focus:border-blue-500 transition-colors duration-200"
                disabled={loading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                disabled={!message.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
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
