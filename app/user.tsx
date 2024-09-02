import { Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/header';

export default function () {
  const params = useLocalSearchParams();
  console.log(params);
  return (
    <SafeAreaView>
      <Header title="Username" color="black" goBack />
      <Text className="text-black font-bold text-xl text-center">Profile here</Text>
    </SafeAreaView>
  );
}