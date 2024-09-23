import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import Profile from '@/components/profile';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function () {
  const [ user, setUser ] = React.useState(null);
  const params = useLocalSearchParams();
  const router = useRouter()

  React.useEffect(() => {
    getUser();
  }, [params.user_id]);

  const getUser = async () => {
    const { data, error } = await supabase.from('User').select('*').eq('id', params.user_id).single();
    if(error) return console.error(error);
    setUser(data);
  }

  const report = async () => {
    const { error } = await supabase.from('Report').insert({
      user_id: user?.id,
    })
    if(error) return console.error(error);
    Alert.alert('Blocked', 'This user has been blocked');
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between mx-2">
        <View className="w-10">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <Text className={`text-white font-bold text-xl flex-1 text-center`}>{user?.username}</Text>
        <View className="w-10">
          <TouchableOpacity onPress={() => {
            Alert.alert('Block User', 'Please confirm abusive behavior from this user', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Block', onPress: report }
            ])
          }}>
            <Ionicons name="flag" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Profile user={user} />
    </SafeAreaView>
  );
}