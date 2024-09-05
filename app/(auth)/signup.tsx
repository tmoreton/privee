import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import Feather from '@expo/vector-icons/Feather';

export default function () {
  const router= useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const { signUp } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="w-full p-4">
        <View className="flex-row justify-between">
          <View className="w-1/2"></View>
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <Feather name="x" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white font-bold text-5xl text-center my-5">Signup</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor="gray"
          className="bg-black p-4 rounded-lg border border-gray-500 w-full mb-4 text-base"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          className="bg-black p-4 rounded-lg border border-gray-500 w-full mb-4 text-base"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          className="bg-black p-4 rounded-lg border border-gray-500 w-full mb-4 text-base"
        />
        <TouchableOpacity
          className="bg-white px-4 py-2 rounded-lg my-4"
          onPress={() => signUp(username, email, password)}
        >
          <Text className="text-black font-bold text-xl text-center">Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-base text-center">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}