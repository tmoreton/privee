import React from 'react';
import { View, FlatList, Dimensions, SafeAreaView, Text } from 'react-native';
import { supabase } from '@/utils/supabase';
import VideoPlayer from '@/components/video';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ({ ids }: { ids: string[] }) {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [ activeIndex, setActiveIndex ] = React.useState<number | null>(null)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    getVideos()
  }, [ids])

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
      .in('user_id', ids)
      .order('created_at', { ascending: false })
    if(error) return console.log(error)
      
    getSignedUrls(data)
  }

  const getSignedUrls = async (videos: any[]) => {
    const { data, error } = await supabase
      .storage
      .from('videos')
      .createSignedUrls(videos.map((video) => video.uri), 60 * 60 * 24 * 7)
      let videosUrls = videos?.map((item) => {
        item.signedUrl =  data?.find((signedUrl) => signedUrl.path === item.uri)?.signedUrl
        return item
      })
      setVideos(videosUrls)
  }

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <FlatList 
        data={videos} 
        snapToInterval={Dimensions.get('window').height}
        snapToStart
        decelerationRate="fast"
        onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
        renderItem={({ item }) => <VideoPlayer video={item} isViewable={activeIndex === item.id && isFocused}/>} 
        ListEmptyComponent={
          <SafeAreaView className="flex-1 items-center justify-center bg-black h-screen">
            <Ionicons name='sad' size={50} color='white' />
            <Text className="text-white text-2xl font-bold">No Friends Yet</Text>
          </SafeAreaView>
        }
      />
    </View>
  );
}