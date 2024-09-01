import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "people-sharp" : "people-outline"} size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: '',
          tabBarIcon: () => 
          <View className="absolute">
            <Ionicons name="add-circle" size={75} color="black" />
          </View>,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/camera');
          }
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
