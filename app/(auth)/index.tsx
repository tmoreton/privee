import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function () {
  const router= useRouter();
  const [email, setEmail] = React.useState('hello@reactnativenerd.com');
  const [password, setPassword] = React.useState('1234567890');
  const { signIn } = useAuth()

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="w-full p-4">
        <Image
          source={require('@/assets/images/icon.png')}
          className="w-72 h-40 mx-auto"
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-black p-4 rounded-lg border border-gray-500 w-full mb-4 text-base text-white"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          className="bg-black p-4 rounded-lg border border-gray-500 w-full mb-4 text-base text-white"
        />
        <TouchableOpacity
          className="bg-white px-4 py-2 rounded-lg my-4"
          onPress={() => signIn(email, password)}
        >
          <Text className="text-black font-bold text-xl text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/signup')}
        >
          <Text className="text-white font-semibold text-base text-center">Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}