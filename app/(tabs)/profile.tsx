import { useAuth } from '@/providers/AuthProvider';
import Profile from '@/components/profile';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/header';

export default function () {
  const { user } = useAuth();
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Header title={user?.username} settings={true} color='white' />
      <Profile user={user} />
    </View>
  )
}