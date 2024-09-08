import React from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import sendNotification from '@/hooks/send-notification';

export default function ({ 
  user, 
}: { 
  user: any, 
}) {
  const { user: authUser, following: myFollowing, getFollowing } = useAuth();
  const [profilePicture, setProfilePicture] = React.useState<string>('');
  const [videos, setVideos] = React.useState<any[]>([]);
  const videoRef = React.useRef<Video>(null);
  const router = useRouter()

  React.useEffect(() => {
    getVideos()
  }, [user])

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
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

  const pickImage = async () => {
    if(authUser?.id !== user?.id) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    setProfilePicture(result.assets[0].uri);
    saveImage(result.assets[0].uri);
  };
  
  const saveImage = async (uri: string) => {
    const formData = new FormData();
    const fileName = uri?.split('/').pop();
    const extension = fileName?.split('.').pop();
    formData.append('file', {
      type: `image/${extension}`,
      name: `avatar.${extension}`,
      uri
    });

    const { data, error } = await supabase.storage
      .from(`avatars/${user?.id}`)
      .upload(`avatar.${extension}`, formData, {
        cacheControl: '3600000000',
        upsert: true
      });
    if(error) console.error(error);
  }

  const followerUser = async () => {
    if(authUser?.id === user?.id) return;

    const { error } = await supabase
      .from('Follower')
      .insert({
        user_id: authUser?.id,
        follower_user_id: user?.id
      })
    if(!error) {
      getFollowing(authUser?.id)
      if(user?.token) sendNotification(user.token, 'New Follower', `${authUser?.username} started following you`)
    }
  }

  const unFollowerUser = async () => {
    const { error } = await supabase
      .from('Follower')
      .delete()
      .eq('user_id', authUser?.id)
      .eq('follower_user_id', user?.id)
    if(!error) getFollowing(authUser?.id)
  }

  return (
    <View className="flex-1 items-center bg-black">
      <TouchableOpacity onPress={pickImage}>
        <Image 
          source={{ uri: profilePicture || `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${user?.id}/avatar.jpg` }} 
          className="w-24 h-24 rounded-full bg-white my-3"
        />
      </TouchableOpacity>
      <View className={user?.id !== authUser?.id ? 'flex' : 'hidden'}>
      {
        myFollowing.filter((u: any) => u.follower_user_id === user?.id).length > 0 ? (
          <TouchableOpacity className="absolute bottom-0 right-0 bg-red-600 rounded-full items-center justify-center m-5" onPress={unFollowerUser}>
            <Ionicons name="remove" size={30} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="absolute bottom-0 right-0 bg-red-600 rounded-full items-center justify-center m-5" onPress={followerUser}>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        )
      }
      </View>
      { videos?.length > 0 && (
        <TouchableOpacity className="pt-10 flex-1 items-center justify-center" onPress={() => router.push(`/view?user_id=${user?.id}`)}>
          <Video
            ref={videoRef}
            style={{ 
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              borderRadius: 15,
            }}
            source={{ uri: videos[0]?.signedUrl }}
            resizeMode={ResizeMode.COVER}
            isLooping
          />
          <View className="absolute items-center justify-center bg-black/50 w-full h-full">
            <View className="bg-black py-3 px-6 rounded-lg">
              <Text className="text-white text-xl font-bold">View More</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}