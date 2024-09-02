import React from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function () {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [comments, setComments] = React.useState<any[]>([]);
  const [text, setText] = React.useState<string>('');

  React.useEffect(() => {
    getComments()
  }, [])

  const getComments = async () => {
    const { data, error } = await supabase
      .from('Comment')
      .select('*, User(*)')
      .eq('video_id', params.video_id)
    if(error) return console.log(error)
    setComments(data)
  }

  const addComment = async () => {
    const { error } = await supabase.from('Comment').insert({
      user_id: user.id,
      video_id: params.video_id,
      text,
      video_user_id: params.video_user_id
    });
    if(error) return console.log(error)
    setText('')
    Keyboard.dismiss()
    getComments()
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-black font-semibold text-xl text-center mt-5">Comments</Text>
          <FlatList 
            className='flex-1 w-full'
            data={comments}
            renderItem={({ item }) =>   {
              return (
                <View className='flex-row gap-2 items-center w-full m-1'>
                  <Image 
                    source={{ uri: 'https://placehold.co/40x40' }} 
                    className="w-10 h-10 rounded-full bg-black"
                  />
                  <View>
                    <Text className='font-bold text-base'>{item.User.username}</Text>
                    <Text>{item.text}</Text>
                  </View>
                </View>
              )
            }
          }
          />
          <View className='flex-row gap-2 w-full mx-3 mb-16'>
            <TextInput
              className="flex-1 bg-white p-4 rounded-3xl border border-gray-300"
              placeholder="Add a comment"
              onChangeText={(i) => setText(i)}
              value={text}
            />
            <TouchableOpacity onPress={addComment}>
              <Ionicons name="arrow-forward-circle" size={50} color="red" />
            </TouchableOpacity>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}