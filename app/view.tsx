import VideoFlatList from '@/components/video-flatlist';
import { useLocalSearchParams } from 'expo-router';

export default function () {
  const param = useLocalSearchParams();

  return <VideoFlatList ids={[param?.user_id as string]} />
}