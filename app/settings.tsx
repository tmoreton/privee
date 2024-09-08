import React from 'react';
import { SafeAreaView, Text, View, Switch, TouchableOpacity, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import * as Device from 'expo-device';
import Header from '@/components/header';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';

export default function Settings() {
  const [enableNotifications, setEnableNotifications] = React.useState(false);
  const { user, signOut, deleteAccount } = useAuth();

  React.useEffect(() => {
    getPermissions();
  }, []);


const registerDevice = async (token: string, type: string, userId: string) => {
  if (!token || !userId) return null;

  const { error } = await supabase
    .from('User')
    .update({ token })
    .eq('id', userId)

  if (error) Alert.alert('Error', error.message);
};

const registerForPushNotificationsAsync = async (userId: string) => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return finalStatus;

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EAS_PROJECT_ID,
        })
      ).data;
      await registerDevice(pushTokenString, Platform.OS, userId);
      return finalStatus;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  }
};

  const getPermissions = React.useCallback(async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      setEnableNotifications(true);
    } else {
      setEnableNotifications(false);
    }
  }, [enableNotifications]);

  const toggleNotifications = async () => {
    if (!user) return;

    if (!enableNotifications) {
      const status = await registerForPushNotificationsAsync(user.id);
      setEnableNotifications(status === 'granted');
    } else {
      // TODO: Create API to update device status === "inactive"
      setEnableNotifications(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-between">
      <View className="my-3">
        <Header title="Settings" goBack={true} color='white'/>
        <View className="m-3 flex-row items-center justify-between mt-5">
          <View className="flex-row items-center">
            <FontAwesome name="bell" size={22} color="white" />
            <Text className="text-white font-semibold text-lg ml-5">
              Allow Notifications
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#181818', true: '#3d3d3d' }}
            thumbColor={true ? '#181818' : '#3d3d3d'}
            ios_backgroundColor="#3d3d3d"
            onValueChange={toggleNotifications}
            value={enableNotifications}
          />
        </View>
        <TouchableOpacity 
          className="m-3 flex-row items-center justify-between"
          onPress={() => {
            Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: deleteAccount},
            ]);
          }}>
          <View className="flex-row items-center">
            <Ionicons name="person" size={22} color="white" />
            <Text className="text-white font-semibold text-lg ml-5">
              Delete Account
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut} className="m-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={28} color="white" />
            <Text className="text-white font-semibold text-lg ml-5">
              Log out
            </Text>
          </View>
          <FontAwesome name="chevron-right" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
