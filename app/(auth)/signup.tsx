import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import Feather from '@expo/vector-icons/Feather';
import Checkbox from 'expo-checkbox';

export default function () {
  const router= useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [isChecked, setChecked] = React.useState(false);
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
        <Image
          source={require('@/assets/images/icon.png')}
          className="w-72 h-20 mx-auto mb-5"
        />
        <TextInput
          placeholder="Username"
          autoCapitalize="none"
          placeholderTextColor="gray"
          className="bg-zinc-800 p-4 rounded-xl w-full mb-4 text-base text-white"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="gray"
          className="bg-zinc-800 p-4 rounded-xl w-full mb-4 text-base text-white"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="gray"
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          className="bg-zinc-800 p-4 rounded-xl w-full mb-4 text-base text-white"
        />
        <View className="flex-row items-center ml-2">
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color="#6D6D6D"
          />
          <Text className="text-white font-semibold mx-2 text-md">
            I agree to the
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/terms')}
          >
            <Text className="text-white font-semibold text-md">
              Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-white px-4 py-2 rounded-lg my-4"
          onPress={() => {
            if(isChecked) {
              signUp(username, email, password)
            } else {
              Alert.alert('Please accept the terms of service')
            }
          }}
        >
          <Text className="text-black font-bold text-xl text-center">Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}