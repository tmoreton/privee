import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function () {
  const router= useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const { signUp } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="w-full p-4">
        <Text className="text-black font-bold text-3xl text-center mb-4">Signup</Text>
        <TextInput
          placeholder="Username"
          className="bg-white p-4 rounded-lg border border-gray-300 w-full mb-4"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Email"
          className="bg-white p-4 rounded-lg border border-gray-300 w-full mb-4"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          className="bg-white p-4 rounded-lg border border-gray-300 w-full mb-4"
        />
        <TouchableOpacity
          className="bg-black px-4 py-2 rounded-lg"
          onPress={() => signUp(username, email, password)}
        >
          <Text className="text-white font-bold text-lg text-center">Signup</Text>
        
        </TouchableOpacity>
      </View>
    </View>
  );
}