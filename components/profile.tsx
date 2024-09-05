import React from 'react';
import { Text, View, TouchableOpacity, Image, SafeAreaView, Dimensions, FlatList} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

export default function ({ 
  user, 
  following, 
  followers, 
}: { 
  user: any, 
  following: any, 
  followers: any, signOut: any 
}) {
  const { user: authUser, signOut, following: myFollowing, getFollowing } = useAuth();
  const [profilePicture, setProfilePicture] = React.useState<string>('');
  const [videos, setVideos] = React.useState<any[]>([]);
  const videoRef = React.useRef<Video>(null);
  const [likes, setLikes] = React.useState<any[]>([]);
  const router = useRouter()

  React.useEffect(() => {
    getVideos()
    getLikes()
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

  const getLikes = async () => {
    const { data, error } = await supabase
      .from('Like')
      .select('*')
      .eq('video_user_id', user?.id)
    setLikes(data)
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
    // No permissions request is necessary for launching the image library
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
    const { error } = await supabase
      .from('Follower')
      .insert({
        user_id: authUser?.id,
        follower_user_id: user?.id
      })
    if(!error) getFollowing(authUser?.id)
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
    <SafeAreaView className="flex-1 items-center bg-black">
      <TouchableOpacity onPress={pickImage}>
        <Image 
          source={{ uri: profilePicture || `${process.env.EXPO_PUBLIC__BUCKET}/avatars/${user?.id}/avatar.jpg` }} 
          className="w-20 h-20 rounded-full bg-white my-3"
        />
      </TouchableOpacity>
      <Text className="text-2xl font-bold my-3 text-white">@{user?.username}</Text>
      <View className="flex-row items-center justify-around w-full my-3">
        <View className="w-1/3 items-center">
          <Text className="text-md font-semibold text-white">Following</Text>
          <Text className="text-md text-white">{following.length}</Text>
        </View>
        <View className="w-1/3 items-center">
          <Text className="text-md font-semibold text-white">Followers</Text>
          <Text className="text-md text-white">{followers.length}</Text>
        </View>
        <View className="w-1/3 items-center">
          <Text className="text-md font-semibold text-white">Likes</Text>
          <Text className="text-md text-white">{likes.length}</Text>
        </View>
      </View>
      { 
        authUser?.id === user?.id ? (
          <TouchableOpacity className="bg-black px-4 py-2 rounded-lg m-3" onPress={signOut}>
            <Text className="text-white font-bold text-lg text-center">Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <View>
            {
              myFollowing.filter((u: any) => u.follower_user_id === user?.id).length > 0 ? (
                <TouchableOpacity className="bg-red-400 px-4 py-2 rounded-lg w-full m-3" onPress={unFollowerUser}>
                  <Text className="text-white font-bold text-lg text-center">Unfollow</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="bg-red-400 px-4 py-2 rounded-lg w-full m-3" onPress={followerUser}>
                  <Text className="text-white font-bold text-lg text-center">Follow</Text>
                </TouchableOpacity>
              )
            }
          </View>
        )
      }
      <TouchableOpacity className="pt-10" onPress={() => router.push(`/view?user_id=${user?.id}`)}>
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
      </TouchableOpacity>
    </SafeAreaView>
  );
}