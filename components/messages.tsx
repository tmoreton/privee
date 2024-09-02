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
        <View className="flex-1 items-center justify-center bg-white">
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
            <TouchableOpacity onPress={() => {
              setText('')
              Keyboard.dismiss()
              addMessage(text)
            }}>
              <Ionicons name="arrow-forward-circle" size={50} color="red" />
            </TouchableOpacity>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}