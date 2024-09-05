import React from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';

export default function ({
  messages,
  addMessage
}: {
  messages: any[],
  addMessage: (message: any) => void
}) {
  const [text, setText] = React.useState<string>('');
  const { user } = useAuth();

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center bg-black">
          <Text className="text-white font-bold text-2xl">Chat</Text>
          <FlatList 
            className='flex-1 w-full'
            data={messages}
            renderItem={({ item }) =>   {
              return (
                <View className='flex-row gap-2 items-center w-full m-1'>
                  <Image 
                    source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${item.User?.id}/avatar.jpg` }} 
                    className="w-10 h-10 rounded-full bg-black"
                  />
                  <View>
                    <Text className='font-bold text-base text-white'>{item.User.username}</Text>
                    <Text className='text-white'>{item.text}</Text>
                  </View>
                </View>
              )
            }
          }
          />
          <View className='flex-row gap-2 w-full mx-3 mb-16'>
            <TextInput
              className="flex-1 bg-gray-800 p-4 rounded-full text-white text-base"
              placeholder="Add a comment"
              placeholderTextColor="white"
              onChangeText={(i) => setText(i)}
              value={text}
            />
            <TouchableOpacity onPress={() => {
              setText('')
              Keyboard.dismiss()
              addMessage(text)
            }}>
              <Ionicons name="arrow-forward-circle" size={60} color="white" />
            </TouchableOpacity>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}