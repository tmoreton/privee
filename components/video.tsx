import React from 'react';
import {  Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function ({ video, isViewable }: { video: any, isViewable: boolean }) {
  const videoRef = React.useRef<Video>(null);

  React.useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync()
    } else {
      videoRef.current?.pauseAsync()
    }
  }, [isViewable])

  return (
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
  );
}