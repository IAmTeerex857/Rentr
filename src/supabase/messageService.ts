import { supabase } from './client';
import { Tables } from './database.types';
import { RealtimeChannel } from '@supabase/supabase-js';

export type Message = Tables<'messages'>;

export type Conversation = Tables<'conversations'> & {
  participants: string[];
  last_message: string;
  last_message_time: string;
  unread_count: number;
  property_title?: string;
  property_image?: string | null;
  other_user_name?: string;
  other_user_avatar?: string | null;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      created_at,
      updated_at,
      property_id,
      last_message,
      last_message_time,
      participants,
      unread_count,
      properties:property_id (title, images)
    `)
    .contains('participants', [userId])
    .order('last_message_time', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw new Error(error.message);
  }

  // Fetch user details for the other participant in each conversation
  const conversations = await Promise.all(
    data.map(async (conversation) => {
      const otherUserId = conversation.participants.find((id: string) => id !== userId);
      
      if (otherUserId) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', otherUserId)
          .single();
          
        if (userError) {
          console.error('Error fetching user details:', userError);
        }
        
        return {
          ...conversation,
          property_title: conversation.properties?.title || 'No property',
          property_image: conversation.properties?.images?.[0] || null,
          other_user_name: userData ? `${userData.first_name} ${userData.last_name}` : 'Unknown User',
          other_user_avatar: userData?.avatar_url || null
        };
      }
      
      return conversation;
    })
  );

  return conversations as Conversation[];
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw new Error(error.message);
  }

  return data as Message[];
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  userId: string,
  recipientId: string,
  propertyId?: string,
  initialMessage?: string
): Promise<Conversation> => {
  // First check if conversation already exists between these users
  const { data: existingConversation, error: searchError } = await supabase
    .from('conversations')
    .select('id')
    .contains('participants', [userId, recipientId])
    .maybeSingle();

  if (searchError) {
    console.error('Error searching for existing conversation:', searchError);
    throw new Error(searchError.message);
  }

  // If conversation exists, return it
  if (existingConversation) {
    // If there's an initial message, add it to the existing conversation
    if (initialMessage) {
      await sendMessage(existingConversation.id, userId, recipientId, initialMessage);
      
      // Update the conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message: initialMessage,
          last_message_time: new Date().toISOString(),
          unread_count: 1 // Increment unread count
        })
        .eq('id', existingConversation.id);
    }
    
    // Get the full conversation details
    const { data: fullConversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', existingConversation.id)
      .single();
      
    if (error) {
      console.error('Error fetching existing conversation:', error);
      throw new Error(error.message);
    }
    
    return fullConversation as Conversation;
  }

  // Create new conversation
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert({
      property_id: propertyId || undefined,
      last_message: initialMessage || '',
      last_message_time: new Date().toISOString(),
      participants: [userId, recipientId],
      unread_count: initialMessage ? 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (createError) {
    console.error('Error creating conversation:', createError);
    throw new Error(createError.message);
  }

  // If there's an initial message, add it
  if (initialMessage) {
    await sendMessage(newConversation.id, userId, recipientId, initialMessage);
  }

  return newConversation as Conversation;
};

/**
 * Send a message in a conversation
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  recipientId: string,
  content: string
): Promise<Message> => {
  // Insert the message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      created_at: new Date().toISOString(),
      read: false
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw new Error(error.message);
  }

  // Update the conversation's last message
  const { data: currentConv, error: fetchError } = await supabase
    .from('conversations')
    .select('unread_count')
    .eq('id', conversationId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching conversation:', fetchError);
    throw new Error(fetchError.message);
  }
    
  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      last_message: content,
      last_message_time: new Date().toISOString(),
      unread_count: (currentConv?.unread_count || 0) + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  if (updateError) {
    console.error('Error updating conversation:', updateError);
    throw new Error(updateError.message);
  }

  return message as Message;
};

/**
 * Mark all messages in a conversation as read
 */
export const markConversationAsRead = async (conversationId: string, userId: string): Promise<void> => {
  // Mark messages as read
  const { error: messageError } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .eq('recipient_id', userId)
    .eq('read', false);

  if (messageError) {
    console.error('Error marking messages as read:', messageError);
    throw new Error(messageError.message);
  }

  // Reset unread count
  const { error: conversationError } = await supabase
    .from('conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId);

  if (conversationError) {
    console.error('Error resetting unread count:', conversationError);
    throw new Error(conversationError.message);
  }
};

/**
 * Get unread message count for a user
 */
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('unread_count')
    .contains('participants', [userId]);

  if (error) {
    console.error('Error fetching unread count:', error);
    throw new Error(error.message);
  }

  return data.reduce((total, conversation) => total + (conversation.unread_count || 0), 0);
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`messages:conversation=${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        // Get the new message details
        const newMessage = payload.new as Message;
        
        // Call the callback with the new message
        callback(newMessage);
      }
    )
    .subscribe();
    
  return channel;
};

/**
 * Subscribe to conversation updates (unread count, last message)
 */
export const subscribeToConversations = (userId: string, callback: (conversation: Conversation) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`conversations:user=${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{\"${userId}\"}` // Filter for conversations that include this user
      },
      (payload) => {
        // Get the updated conversation
        const updatedConversation = payload.new as Conversation;
        
        // Call the callback with the updated conversation
        callback(updatedConversation);
      }
    )
    .subscribe();
    
  return channel;
};

/**
 * Unsubscribe from a channel when no longer needed
 */
export const unsubscribeFromChannel = (channel: RealtimeChannel): void => {
  supabase.removeChannel(channel);
};
