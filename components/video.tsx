import React from 'react';
import {  View, Text, Dimensions, TouchableOpacity, Share } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ({ video, isViewable }: { video: any, isViewable: boolean }) {
  const videoRef = React.useRef<Video>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync()
    } else {
      videoRef.current?.pauseAsync()
    }
  }, [isViewable])

  const shareVideo = () => {
    Share.share({
      message: `Check out this video: ${video.title}`
    })
  }

  return (
    <View>
      <Video
        ref={videoRef}
        style={{ 
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
        source={{ uri: video.signedUrl }}
        resizeMode={ResizeMode.COVER}
        isLooping
      />
      <View className="absolute bottom-28 left-0 right-0">
        <View className="flex-1 flex-row items-end justify-between m-4">
          <View>
            <Text className="text-white text-2xl font-bold mt-18">{video.User.username}</Text>
            <Text className="text-white text-xl font-semibold">{video.title}</Text>
          </View>
          <View>  
            <TouchableOpacity onPress={() => router.push(`/user?user_id=${video.User.id}`)}>
              <Ionicons name="person" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="mt-6" onPress={() => console.log('like')}>
              <Ionicons name="heart" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="mt-6" onPress={() => router.push(`/comment?video_id=${video.id}`)}>
              <Ionicons name="chatbubble-ellipses" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="mt-6" onPress={shareVideo}>
              <FontAwesome name="share" size={36} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}