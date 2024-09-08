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
    Alert.alert('Reported', 'The user has been reported to the moderators');
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between mx-3">
        <View className="w-10">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <Text className={`text-white font-bold text-2xl flex-1 text-center`}>{user?.username}</Text>
        <View className="w-10">
          <TouchableOpacity onPress={() => {
            Alert.alert('Report', 'Are you sure you want to report this user?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Report', onPress: report }
            ])
          }}>
            <Ionicons name="flag" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Profile user={user} />
    </SafeAreaView>
  );
}