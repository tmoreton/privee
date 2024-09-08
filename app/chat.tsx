import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import Messages from '@/components/messages';
import sendNotification from '@/hooks/send-notification';

export default function () {
  const { user: authUser } = useAuth();
  const params = useLocalSearchParams();
  const [messages, setMessages] = React.useState<any[]>([]);
  const users_key = [authUser.id, params.chat_user_id].sort().join(':')
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    getMessages()
  }, [])

  React.useEffect(() => {
    getUser()
  }, [params.chat_user_id])

  const getUser = async () => {
    const { data, error } = await supabase.from('User').select('*').eq('id', params.chat_user_id).single()
    if(error) return console.log(error)
    setUser(data)
  }

  React.useEffect(() => {
    const channel = supabase.channel(users_key).on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'Chat',
      filter: `users_key=eq.${users_key}`
    }, (payload) => {
      getMessages()
    }).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [messages, setMessages, users_key])


  const getMessages = async () => {
    const { data, error } = await supabase
      .from('Chat')
      .select('*, User(*)')
      .eq('users_key',users_key)
    if(error) return console.log(error)
    setMessages(data)
  }

  const addMessage = async (text: string) => {
    const { error } = await supabase.from('Chat').insert({
      user_id: authUser.id,
      chat_user_id: params.chat_user_id,
      text,
      users_key
    });
    if(error) return console.log(error)

    if(user?.token) sendNotification(user.token, 'New Message', text)  
    getMessages()
  }

  return <Messages messages={messages} addMessage={addMessage} />
}