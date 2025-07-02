import { useState, useEffect, useRef } from 'react';
import { 
  Send, ArrowLeft, Phone, Video, Info, 
  Image as ImageIcon, Paperclip, Smile 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getUserConversations, 
  getConversationMessages, 
  sendMessage, 
  markConversationAsRead,
  Conversation,
  Message
} from '../../supabase/messageService';

interface MessageCenterProps {
  propertyId?: string;
  ownerId?: string;
  onClose?: () => void;
  initialMessage?: string;
}

const MessageCenter = ({ propertyId, ownerId, onClose, initialMessage }: MessageCenterProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState(initialMessage || '');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userConversations = await getUserConversations(user.id);
        setConversations(userConversations);
        
        // If there's an ownerId passed (for new conversation), don't auto-select
        if (!ownerId && userConversations.length > 0) {
          setActiveConversation(userConversations[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user?.id, ownerId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      
      try {
        const conversationMessages = await getConversationMessages(activeConversation.id);
        setMessages(conversationMessages);
        
        // Mark messages as read
        if (user?.id) {
          await markConversationAsRead(activeConversation.id, user.id);
        }
        
        // Scroll to bottom
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, [activeConversation, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !activeConversation) return;
    
    try {
      const otherUserId = activeConversation.participants.find(id => id !== user.id);
      if (!otherUserId) return;
      
      // Add message optimistically to UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: activeConversation.id,
        sender_id: user.id,
        recipient_id: otherUserId,
        content: newMessage,
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Send to server
      await sendMessage(
        activeConversation.id,
        user.id,
        otherUserId,
        newMessage
      );
      
      // Update conversation list
      const updatedConversations = conversations.map(conv => 
        conv.id === activeConversation.id
          ? { ...conv, last_message: newMessage, last_message_time: new Date().toISOString() }
          : conv
      );
      
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error - maybe revert the optimistic update
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Handle keypress for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversation List */}
      <div className={`w-1/3 border-r border-gray-200 ${activeConversation ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  activeConversation?.id === conversation.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {conversation.other_user_avatar ? (
                      <img
                        src={conversation.other_user_avatar}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {conversation.other_user_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    {conversation.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 truncate max-w-[120px]">
                        {conversation.other_user_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatConversationTime(conversation.last_message_time)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                        {conversation.last_message}
                      </p>
                      {conversation.property_title && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                          Property
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Message Area */}
      <div className={`${activeConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {activeConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button 
                className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setActiveConversation(null)}
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              
              <div className="flex items-center flex-1">
                {activeConversation.other_user_avatar ? (
                  <img
                    src={activeConversation.other_user_avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {activeConversation.other_user_name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    {activeConversation.other_user_name}
                  </h3>
                  {activeConversation.property_title && (
                    <p className="text-xs text-gray-500">
                      Re: {activeConversation.property_title}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Info className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === user?.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-rose-200' : 'text-gray-500'
                      } text-right`}
                    >
                      {formatMessageTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                  <Smile className="h-5 w-5 text-gray-500" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="Type a message..."
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                
                <button
                  className={`ml-2 p-2 rounded-full ${
                    newMessage.trim()
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageIcon className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-500 mb-4">
                Select a conversation or start a new one
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Message icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default MessageCenter;
