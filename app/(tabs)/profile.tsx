import { useAuth } from '@/providers/AuthProvider';
import Profile from '@/components/profile';
import Header from '@/components/header';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, Alert, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function () {
  const { user, following, followers, deleteAccount, signOut } = useAuth();
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between mx-3">
        <View className="w-10">
          <TouchableOpacity onPress={() =>{
            Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: deleteAccount},
            ]);
          }}>
            <Ionicons name="settings" size={28} color="white" />
          </TouchableOpacity>        
        </View>
        <Text className={`text-white font-bold text-2xl flex-1 text-center`}>{user?.username}</Text>
        <View className="w-10">
          <TouchableOpacity onPress={signOut}>
            <MaterialIcons name="logout" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Profile 
        user={user}
        following={following}
        followers={followers}
      />
    </View>
  )
}