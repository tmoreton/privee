import React from 'react';
import {  View, Text, Dimensions, TouchableOpacity, Share, Image, SafeAreaView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';

export default function ({ video, isViewable }: { video: any, isViewable: boolean }) {
  const { user, likes, getLikes, following, getFollowing } = useAuth();
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

  const likeVideo = async () => {
    const { error } = await supabase
      .from('Like')
      .insert({
        user_id: user?.id,
        video_id: video.id,
        video_user_id: video.User.id
      })
    if(!error) getLikes(user?.id)
  }

  const unLikeVideo = async () => {
    const { error } = await supabase
      .from('Like')
      .delete()
      .eq('user_id', user?.id)
      .eq('video_id', video.id)
    if(!error) getLikes(user?.id)
  }

  const followerUser = async () => {
    const { error } = await supabase
      .from('Follower')
      .insert({
        user_id: user?.id,
        follower_user_id: video.User.id
      })
    if(!error) getFollowing(user?.id)
  }

  const unFollowerUser = async () => {
    const { error } = await supabase
      .from('Follower')
      .delete()
      .eq('user_id', user?.id)
      .eq('follower_user_id', video.User.id)
    if(!error) getFollowing(user?.id)
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
        <View className="absolute bottom-28 left-0 right-0 top-0">
        <LinearGradient
          colors={['#000', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 400,
          }}
        />
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between mt-14 mx-4">
            <TouchableOpacity onPress={() => router.push(`/comment?video_id=${video.id}&video_user_id=${video.User.id}`)}>
              <Ionicons name="chatbubble-ellipses" size={40} color="white" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <View>
                <TouchableOpacity onPress={() => router.push(`/user?user_id=${video.User.id}`)}>
                  <Image 
                    source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${video.User?.id}/avatar.jpg` }} 
                    className="w-10 h-10 rounded-full bg-black"
                  />
                </TouchableOpacity>
                {
                  following.filter((following: any) => following.follower_user_id === video.User.id).length > 0 ? (
                    <TouchableOpacity className="absolute -bottom-1 -right-1 bg-red-600 rounded-full items-center justify-center" onPress={unFollowerUser}>
                      <Ionicons name="remove" size={21} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity className="absolute -bottom-1 -right-1 bg-red-600 rounded-full items-center justify-center" onPress={followerUser}>
                      <Ionicons name="add" size={21} color="white" />
                    </TouchableOpacity>
                  )
                }
              </View>
              <Text className="text-white text-2xl font-bold ml-3">{video.User.username}</Text>
            </View>
            <View>
              {likes.filter((like: any) => like.video_id === video.id).length > 0 ? (
                <TouchableOpacity onPress={unLikeVideo}>
                  <Ionicons name="heart" size={40} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={likeVideo}>
                  <Ionicons name="heart-outline" size={40} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}