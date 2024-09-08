import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/providers/AuthProvider';

export default function Header({ 
  title, 
  color, 
  goBack = false, 
  search = false,
}: { 
  title: string, 
  color: string, 
  goBack?: boolean, 
  search?: boolean,
}) {
  const router = useRouter()
  return (
    <View className="flex-row items-center justify-between mx-3">
      <View className="w-10">
        {goBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={32} color={color} />
          </TouchableOpacity>
        )}
      </View>
      <Text className={`text-${color} font-bold text-2xl flex-1 text-center`}>{title}</Text>
      <View className="w-10">
        {search && (
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Ionicons name="search" size={28} color={color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}