import React from 'react';
import { View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Text, Image } from 'react-native';
import Header from '@/components/header';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

export default function () {
  const [text, setText] = React.useState('')
  const [ results, setResults ] = React.useState([])
  const router = useRouter()

  React.useEffect(() => {
    getRecent()
  }, [])

  const getRecent = async () => {
    const { data, error } = await supabase.from('User').select('*').order('created_at', { ascending: false }).limit(10)
    setResults(data)
  }

  const search = async () => {
    const { data, error } = await supabase.from('User').select('*').eq('username', text)
    setResults(data)
  }

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <Header title="Search" color="white" />
      <View className='flex-row gap-2 m-2 items-center'>
        <TextInput
          className="flex-1 text-white p-4 rounded-xl bg-zinc-800"
          placeholder="Search"
          placeholderTextColor='white'
          autoCapitalize='none'
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity onPress={search}>
          <Ionicons name="arrow-forward-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        renderItem={({ item: user }) => 
          <TouchableOpacity onPress={() => router.push(`/user?user_id=${user.id}`)}>
            <View className='flex-row gap-2 items-center w-full m-2'>
              <Image 
                source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${user.id}/avatar.jpg` || 'https://placehold.co/40x40' }} 
                className="w-10 h-10 rounded-full bg-white"
            />
              <Text className='font-bold text-base text-white'>{user?.username}</Text>
            </View>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}