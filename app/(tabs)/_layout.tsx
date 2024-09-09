import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Device from 'expo-device';

export default function TabLayout() {
  const router = useRouter();
  const isTablet = Device.DeviceType.TABLET === 2

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        headerShown: false,
        tabBarLabelStyle: {
          color: "#fff",
        },
        tabBarStyle: {
          backgroundColor: "transparent",
          position: 'absolute',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['transparent', '#000']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
        )
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "people-sharp" : "people-outline"} size={35} color="#fff" style={{ height: 35, width: 35 }} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "search" : "search-outline"} size={35} color="#fff" style={{ height: 35, width: 35 }} />,
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: '',
          tabBarIcon: () => 
          <View className="absolute">
            <Ionicons name="add-circle" size={75} color="#fff"  style={{ height: 75, width: 75 }}/>
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
          title: '',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={35} color="#fff" style={{ height: 35, width: 35 }} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={35} color="#fff" style={{ height: 35, width: 35 }} />,
        }}
      />
    </Tabs>
  );
}
