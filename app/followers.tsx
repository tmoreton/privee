import React from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/header';

export default function () {
  const router = useRouter();
  const { followers, following } = useAuth();
  const [people, setPeople] = React.useState<any[]>([]);

  const sortByDate = () => {
    const people = [...followers, ...following];
    people.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setPeople(people);
  }

  React.useEffect(() => {
    sortByDate()
  }, [followers, following]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header title='Followers' goBack color='white' />
      <FlatList
        className='mt-5'
        data={people}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            key={index}
            onPress={() => router.push(`/user?user_id=${item.following?.id || item.follower?.id}`)}
            className='flex-row items-center w-full m-2'
          >
            <View className='flex-row justify-between w-full items-center pr-5'>
              <View className='flex-row gap-2'>
                <Image 
                  source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${item.following?.id || item.follower?.id}/avatar.jpg` }} 
                  className="w-12 h-12 rounded-full bg-black"
                />
                {
                  item.following ? (
                    <View className="flex-row items-center">
                      <Text className='text-white'>You are following</Text>
                      <Text className='font-bold text-white ml-1'>{item.following.username}</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center">
                      <Text className='font-bold text-white'>{item.follower.username}</Text>
                      <Text className='text-white ml-1'>started following you</Text>
                    </View>
                  )
                }
              </View>
              <Ionicons name='chevron-forward' size={20} color='white' />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}