import React from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = React.useRef<CameraView>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef.current?.stopRecording();
    } else {
      setIsRecording(true);
      const video = await cameraRef.current?.recordAsync();
      setVideoUri(video.uri);
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

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, formData, {
        cacheControl: '3600000000',
        upsert: false
      });
    if(error) console.error(error);

    const { error: videoError } = await supabase.from('Video').insert({
      title: "Test title here!",
      uri: data.path,
      user_id: user?.id
    });
    if(videoError) console.error(videoError);
    router.back();
  }

  return (
      <CameraView mode="video" ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="flex-1 justify-end">
          <View className="flex-row items-center justify-around mb-10">
            <TouchableOpacity className="items-end justify-end" onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={50} color="transparent" />
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
  );
}