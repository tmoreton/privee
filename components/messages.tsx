import React from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ({
  messages,
  addMessage
}: {
  messages: any[],
  addMessage: (message: any) => void
}) {
  const [text, setText] = React.useState<string>('');
  const { user } = useAuth();
  const router = useRouter()

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center bg-black">
          <View className="flex-row items-center justify-between mx-3">
            <View className="w-10">
              <TouchableOpacity onPress={() => {
                Alert.alert('Report', 'Are you sure you want to report this content?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Report', onPress: () => {
                    console.log('Reported')
                  } }
                ])
              }}>
                <Ionicons name="flag" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-white font-bold text-2xl flex-1 text-center">Messages</Text>
            <View className="w-10">
              <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome name="remove" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </View>
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
              className="flex-1 bg-zinc-800 p-4 rounded-xl text-white text-base"
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