import React from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Alert, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';

export default function App() {
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = React.useState(false);
  const cameraRef = React.useRef<CameraView>(null);
  const videoRef = React.useRef<Video>(null);
  const [videoUri, setVideoUri] = React.useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = React.useState({ isLoaded: false, isPlaying: false });
  const isFocused = useIsFocused()

  React.useEffect(() => {
    if(!isFocused) setVideoUri(null);
  }, [isFocused])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white font-bold text-xl text-center w-2/3">We need your permission to show the camera</Text>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white p-3 px-6 rounded-lg my-4"
          onPress={requestPermission}
        >
          <Ionicons name="camera" size={24} color="black" />
          <Text className="ml-3 text-black font-bold text-lg text-center">Access Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  React.useEffect(() => {
    if(videoUri) {
      videoRef.current?.playAsync()
    }
  }, [videoUri])

  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef.current?.stopRecording();
    } else {
      setIsRecording(true);
      const video = await cameraRef.current?.recordAsync();
      setVideoUri(video?.uri);
    }
  }

  const saveVideo = async () => {
    const formData = new FormData();
    const fileName = videoUri?.split('/').pop();
    formData.append('file', {
      uri: videoUri,
      type: `video/${fileName?.split('.').pop()}`,
      name: fileName
    });
    router.back();
    const { data, error } = await supabase.storage
      .from(`videos/${user?.id}`)
      .upload(fileName, formData, {
        cacheControl: '3600000000',
        upsert: false
      });
    if(error) Alert.alert(error.message);

    const { error: videoError } = await supabase.from('Video').insert({
      title: "Test title here!",
      uri: `${user?.id}/${fileName}`,
      user_id: user?.id
    });
    if(videoError) Alert.alert(videoError.message);
  }

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    if(!result?.assets) return setVideoUri(null);
    setVideoUri(result?.assets?.[0]?.uri);
  };

  return (
    <View className="flex-1">
      {videoUri ? (
        <View className="flex-1">
          <TouchableOpacity className="absolute bottom-10 left-36 z-10" onPress={saveVideo}>
            <Ionicons name="checkmark-circle" size={100} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1" onPress={() => status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()}>
            <Video
              ref={videoRef}
              style={{ 
                flex: 1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
              }}
              source={{
                uri: videoUri
              }}
              resizeMode={ResizeMode.COVER}
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </TouchableOpacity>
        </View>
      )
      :
      <CameraView mode="video" ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute bottom-16 left-0 right-0 z-20">
          <View className="flex-row items-center justify-around">
            <TouchableOpacity className="items-end justify-end" onPress={pickVideo}>
              <Ionicons name="aperture" size={50} color="white" />
            </TouchableOpacity>
            {videoUri ? (
              <TouchableOpacity className="items-end justify-end" onPress={saveVideo}>
                <Ionicons name="checkmark-circle" size={100} color="white" />
              </TouchableOpacity>
            ): (
              <TouchableOpacity className="items-end justify-end" onPress={recordVideo}>
                { !isRecording ? <Ionicons name="radio-button-on" size={100} color="white" /> : <Ionicons name="pause-circle" size={100} color="red" />}
              </TouchableOpacity>
            )}
            <TouchableOpacity className="items-end justify-end" onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      }
    </View>
  );
}