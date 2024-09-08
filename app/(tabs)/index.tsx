import { useAuth } from '@/providers/AuthProvider';
import VideoFlatList from '@/components/video-flatlist';

export default function () {
  const { friends } = useAuth();

  return <VideoFlatList ids={friends} />
}