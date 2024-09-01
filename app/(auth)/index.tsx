import { Text, View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function () {
  const router= useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <TouchableOpacity
        className="bg-black px-4 py-2 rounded-lg"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-white font-bold text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
}