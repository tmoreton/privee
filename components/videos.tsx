import React from 'react';
import { Button, Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { supabase } from '@/utils/supabase';

export default function App() {
  const videoRef = React.useRef<Video>(null);
  const [status, setStatus] = React.useState({ isLoaded: false, isPlaying: false });
  const [videos, setVideos] = React.useState([]);

  React.useEffect(() => {
    getVideo();
  }, []);

  const getVideo = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*')
      .order('created_at', { ascending: false })
      getSignedUrl(data);
  }

  const getSignedUrl = async (videos: any) => {
    if (videos?.length === 0) return;
    const { data, error } = await supabase
      .storage
      .from('videos')
      .createSignedUrls(
        videos.map((video: any) => video.uri), 
        60
      );

    let signedUrls = videos.map((video: any) => {
      video.signedUrl = data?.find((item: any) => item.path === video.uri)?.signedUrl;
      return video;
    });
    setVideos(signedUrls);
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      style={{ flex: 1 }}
      disableIntervalMomentum={true}
      snapToInterval={Dimensions.get('window').height}
      snapToAlignment='center'
      decelerationRate='fast'
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={e => console.log(e)}
      renderItem={({ item }) => (
        <Video
          ref={videoRef}
          style={{ 
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
          source={{
            uri: item.signedUrl,
          }}
          resizeMode={ResizeMode.COVER}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      )}
    />
  );
}