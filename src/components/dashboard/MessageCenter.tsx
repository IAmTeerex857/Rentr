import { useState, useEffect, useRef } from 'react';
import { User, Send, ArrowLeft, Clock, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getUserConversations, 
  getConversationMessages, 
  sendMessage, 
  markConversationAsRead,
  Conversation as ConversationType,
  Message as MessageType,
  subscribeToMessages,
  subscribeToConversations,
  unsubscribeFromChannel,
  getUnreadMessageCount
} from '../../supabase/messageService';
import { fetchPropertyById } from '../../supabase/propertiesService';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define our local interface that extends the imported type
interface ConversationWithParticipant extends ConversationType {
  participant_id: string;
  participant_name: string;
}

const MessageCenter = () => {
  const [conversations, setConversations] = useState<ConversationWithParticipant[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithParticipant | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageChannelRef = useRef<RealtimeChannel | null>(null);
  const conversationsChannelRef = useRef<RealtimeChannel | null>(null);
  const { user } = useAuth();

  const loadConversations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await getUserConversations(user.id);
      
      // Enhance conversations with property details and participant info
      const enhancedConversations = await Promise.all(data.map(async (conv) => {
        try {
          // Find the other participant (not the current user)
          const otherParticipantId = conv.participants.find(id => id !== user.id) || '';
          
          // Create our enhanced conversation object with participant info
          const enhancedConv: ConversationWithParticipant = {
            ...conv,
            participant_id: otherParticipantId,
            participant_name: conv.other_user_name || 'Unknown User'
          };
          
          if (conv.property_id) {
            const property = await fetchPropertyById(conv.property_id);
            enhancedConv.property_title = property.title;
            enhancedConv.property_image = property.images?.[0] || null;
          }
          
          return enhancedConv;
        } catch (err) {
          console.error(`Error enhancing conversation:`, err);
          // Return a basic conversation with required fields
          return {
            ...conv,
            participant_id: conv.participants.find(id => id !== user.id) || '',
            participant_name: conv.other_user_name || 'Unknown User'
          } as ConversationWithParticipant;
        }
      }));
      
      setConversations(enhancedConversations);
      setLoading(false);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (user) {
      try {
        const count = await getUnreadMessageCount(user.id);
        setTotalUnread(count);
      } catch (err) {
        console.error('Error loading unread count:', err);
      }
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await getConversationMessages(conversationId);
      setMessages(data);
      scrollToBottom();
      
      // Mark messages as read
      if (user) {
        await markConversationAsRead(conversationId, user.id);
        setHasNewMessage(false);
        loadUnreadCount();
      }
      
      // Subscribe to new messages for this conversation
      if (messageChannelRef.current) {
        unsubscribeFromChannel(messageChannelRef.current);
      }
      
      const messageChannel = subscribeToMessages(conversationId, (newMessage) => {
        // Add the new message to our list
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // If the message is from someone else, mark it as unread
        if (newMessage.sender_id !== user?.id) {
          setHasNewMessage(true);
        }
        
        // Scroll to bottom to show new message
        scrollToBottom();
      });
      
      messageChannelRef.current = messageChannel;
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUnreadCount();
      
      // Subscribe to conversation updates
      const conversationsChannel = subscribeToConversations(user.id, (updatedConversation) => {
        // Update the conversations list when a conversation changes
        setConversations(prevConversations => {
          // Check if this conversation already exists in our list
          const existingIndex = prevConversations.findIndex(c => c.id === updatedConversation.id);
          
          if (existingIndex >= 0) {
            // Update the existing conversation
            const updatedConversations = [...prevConversations];
            updatedConversations[existingIndex] = {
              ...updatedConversations[existingIndex],
              ...updatedConversation,
            };
            return updatedConversations;
          } else {
            // This is a new conversation, add it to the list
            // We need to enhance it with participant info first
            const otherParticipantId = updatedConversation.participants.find(id => id !== user.id) || '';
            const enhancedConv = {
              ...updatedConversation,
              participant_id: otherParticipantId,
              participant_name: updatedConversation.other_user_name || 'Unknown User'
            } as ConversationWithParticipant;
            
            return [enhancedConv, ...prevConversations];
          }
        });
        
        // Update unread count
        setHasNewMessage(true);
        loadUnreadCount();
      });
      
      conversationsChannelRef.current = conversationsChannel;
      
      return () => {
        // Clean up subscriptions when component unmounts
        if (conversationsChannelRef.current) {
          unsubscribeFromChannel(conversationsChannelRef.current);
        }
        if (messageChannelRef.current) {
          unsubscribeFromChannel(messageChannelRef.current);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !selectedConversation || !newMessage.trim()) return;
    
    try {
      setSending(true);
      
      // Send message
      const message = await sendMessage(selectedConversation.id, user.id, selectedConversation.participant_id, newMessage);
      
      // Add message to list
      setMessages(prev => [...prev, message]);
      
      // Update conversation last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id ? {
            ...conv,
            last_message: newMessage,
            last_message_time: new Date().toISOString()
          } : conv
        )
      );
      
      setNewMessage('');
      setSending(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return formatTime(dateString);
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      <div className="flex-none p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Messages
          {totalUnread > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 flex items-center">
              {totalUnread}
            </span>
          )}
        </h2>
        {hasNewMessage && !selectedConversation && (
          <div className="flex items-center text-sm text-blue-600">
            <Bell className="h-4 w-4 mr-1" />
            New messages
          </div>
        )}
      </div>
      
      {/* Conversations List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(600px-64px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {conversation.property_image ? (
                      <img
                        src={conversation.property_image}
                        alt={conversation.property_title}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.last_message_time && formatDate(conversation.last_message_time)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conversation.property_title}
                    </p>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate ${
                        conversation.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                      }`}>
                        {conversation.last_message || 'No messages yet'}
                      </p>
                      
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-600 text-xs font-medium text-white">
                          {conversation.unread_count}
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
      
      {/* Messages */}
      <div className={`w-full md:w-2/3 flex flex-col ${selectedConversation ? 'block' : 'hidden md:block'}`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button
                className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              
              <div className="flex items-center flex-1">
                {selectedConversation.property_image ? (
                  <img
                    src={selectedConversation.property_image}
                    alt={selectedConversation.property_title}
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {selectedConversation.participant_name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.property_title}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-2" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender_id === user?.id
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`text-xs mt-1 flex items-center ${
                            message.sender_id === user?.id ? 'text-rose-200' : 'text-gray-500'
                          }`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-rose-600 text-white px-4 py-2 rounded-r-md hover:bg-rose-700 disabled:bg-rose-300 flex items-center justify-center"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
};



export default MessageCenter;
