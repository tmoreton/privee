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

  const search = async () => {
    const { data, error } = await supabase.from('User').select('*').eq('username', text)
    setResults(data)
  }

  return (
    <SafeAreaView>
      <Header title="Search" color="black" goBack />
      <View className='flex-row gap-2 mt-5 mx-2'>
        <TextInput
          className="flex-1 bg-white p-4 rounded-3xl border border-gray-300"
          placeholder="Search"
          onChangeText={(i) => setText(i)}
          value={text}
        />
        <TouchableOpacity onPress={search}>
          <Ionicons name="arrow-forward-circle" size={50} color="red" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        renderItem={({ item: user }) => 
          <TouchableOpacity onPress={() => router.push(`/user?user_id=${user.id}`)}>
            <View className='flex-row gap-2 items-center w-full m-3'>
              <Image 
                source={{ uri: 'https://placehold.co/40x40' }} 
              className="w-10 h-10 rounded-full bg-black"
            />
              <Text className='font-bold text-base'>{user?.username}</Text>
            </View>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}