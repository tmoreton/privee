import React from 'react';
import { Text, View, SafeAreaView, FlatList, Image } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import Header from '@/components/header';
import { supabase } from '@/utils/supabase';

export default function () {
  const { user } = useAuth();
  const [activity, setActivity] = React.useState([]);

  React.useEffect(() => {
    getComments()
  }, [])

  const getComments = async () => {
    const { data, error } = await supabase
      .from('Comment')
      .select('*, User(*)')
      .eq('video_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    if(error) return console.log(error)
    getLikes(data)
  }

  const getLikes = async (comments: any) => {
    const { data, error } = await supabase
      .from('Like')
      .select('*, User(*)')
      .eq('video_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    if(error) return console.log(error)
    setActivity(comments.concat(data))
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header title='Activity' goBack color='white' />
      <FlatList
        className='mt-6'
        data={activity}
        renderItem={({ item }) => (
          <View className='flex-row items-center my-2'>
            <Image 
              source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${item.User?.id}/avatar.jpg` }} 
              className="w-12 h-12 rounded-full bg-black m-2"
            />
            <View>
              <Text className='font-bold text-md text-white'>{item.User.username}</Text>
              <Text className='text-white leading-7'>{item.text || 'Liked your video'}</Text>
              <Text className='text-xs text-gray-400'>
              { new Date(item?.created_at).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
              })}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}