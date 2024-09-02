import { Text, View } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import Videos from '@/components/videos';

export default function () {
  const { user } = useAuth();
  return <Videos />
}