import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { supabase } from '@/utils/supabase';
import VideoPlayer from '@/components/video';
import Header from '@/components/header';

export default function () {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [ activeIndex, setActiveIndex ] = React.useState<number | null>(null)

  React.useEffect(() => {
    getVideos()
  }, [])

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
      .order('created_at', { ascending: false })
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
    <View className="flex-1 items-center justify-center bg-white">
      <View className="absolute top-16 left-0 right-0 z-10">
        <Header title="For You" color="white" search />
      </View>
      <FlatList 
        data={videos} 
        snapToInterval={Dimensions.get('window').height}
        snapToStart
        decelerationRate="fast"
        onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
        renderItem={({ item }) => <VideoPlayer video={item} isViewable={activeIndex === item.id}/>} 
      />
    </View>
  );
}