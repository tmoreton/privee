import React from 'react';
import {  View, Text, Dimensions, TouchableOpacity, Share, Image, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import sendNotification from '@/hooks/send-notification';

export default function ({ video, isViewable }: { video: any, isViewable: boolean }) {
  const { user, likes, getLikes, following, getFollowing } = useAuth();
  const videoRef = React.useRef<Video>(null);
  const router = useRouter();
  const path = usePathname();
  const [comment, setComment] = React.useState<any>(null)

  React.useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync()
      getComment()
    } else {
      videoRef.current?.pauseAsync()
    }
  }, [isViewable])

  const getComment = async () => {
    const { data, error } = await supabase
      .from('Comment')
      .select('*, User(*)')
      .eq('video_id', video.id)
      .order('created_at', { ascending: false })
      .limit(1)
    if(!error) setComment(data[0])
  }

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
    if(!error) {
      getLikes(user?.id)
      if(video.User?.token) sendNotification(video.User.token, 'New Like', `${user?.username} liked your video`)
    }
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
    if(user?.id === video.User.id) return;
    
    const { error } = await supabase
      .from('Follower')
      .insert({
        user_id: user?.id,
        follower_user_id: video.User.id
      })
    if(!error) {
      getFollowing(user?.id)
      if(video.User?.token) sendNotification(video.User.token, 'New Follower', `${user?.username} started following you`)
    }
  }

  const unFollowerUser = async () => {
    const { error } = await supabase
      .from('Follower')
      .delete()
      .eq('user_id', user?.id)
      .eq('follower_user_id', video.User.id)
    if(!error) getFollowing(user?.id)
  }

  const createAlert = () => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: deleteVideo},
    ]);
  }

  const deleteVideo = async () => {      
    const { error } = await supabase
      .from('Video')
      .delete()
      .eq('id', video.id)
    if(!error) router.back()
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
        { path === '/profile' && <LinearGradient
          colors={['transparent', '#000']}
          style={{
            position: 'absolute',
            bottom: -125,
            left: 0,
            right: 0,
            height: 400,
          }}
        /> }
        <View className="flex-1 justify-between">
          <View className={`flex-row items-center justify-between mt-14 mx-4 ${path === '/profile' ? 'mt-0' : 'mt-14'}`}>
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
              <TouchableOpacity onPress={() => router.push(`/user?user_id=${video.User.id}`)}>
                <Text className="text-white text-2xl font-bold ml-3">{video.User.username}</Text>
              </TouchableOpacity>
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
          {
            path === '/profile' && (
              <View className="flex-row items-center justify-end mx-6">
                <TouchableOpacity onPress={createAlert}>
                <Ionicons name="settings" size={40} color="white" />
                </TouchableOpacity>
              </View>
            )
          }
          {
            path !== '/profile' && comment && (
              <TouchableOpacity onPress={() => router.push(`/comment?video_id=${video.id}&video_user_id=${comment.User.id}`)}>
                <View className='flex-row gap-2 items-center m-3 bg-black/50 px-2 pb-2 rounded-xl'>
                  <Image 
                    source={{ uri: `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${comment.User?.id}/avatar.jpg` }} 
                    className="w-10 h-10 rounded-full bg-black"
                  />
                  <View>
                    <Text className='font-bold text-base text-white'>{comment.User?.username}</Text>
                    <Text className='text-white'>{comment?.text}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </View>
  );
}