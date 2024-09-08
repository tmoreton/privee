import React from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export const AuthContext = React.createContext({
  user: null,
  signIn: async (email: string, password: string) => {},
  signUp: async (username: string, email: string, password: string) => {},
  signOut: async () => {},
  likes: [],
  getLikes: async (userId: string) => {},
  following: [],
  getFollowing: async (userId: string) => {},
  followers: [],
  getFollowers: async (userId: string) => {},
  friends: [],
  getFriends: async () => {},
  deleteAccount: async () => {},
});

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState(null);
  const router = useRouter();
  const [likes, setLikes] = React.useState([]);
  const [following, setFollowing] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    getFriends()
  }, [following, followers])

  const getFriends = async () => {
    const followingIds = following.map(f => f.follower_user_id)
    const followerIds = followers.map(f => f.user_id)
    const duplicates = followingIds.filter(id => followerIds.includes(id))
    setFriends(duplicates)
  }

  const getLikes = async (userId: string) => {
    if(!userId) return

    const { data, error } = await supabase.from('Like').select('*').eq('user_id', userId);
    setLikes(data)
  }

  const getFollowing = async (userId: string) => {
    if(!userId) return

    const { data, error } = await supabase
      .from('Follower')
      .select(`*, following:User!follower_user_id(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    if(!error) setFollowing(data)
  }

  const getFollowers = async (userId: string) => {
    if(!userId) return

    const { data, error } = await supabase
      .from('Follower')
      .select(`*, follower:User!user_id(*)`)
      .eq('follower_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    if(!error) setFollowers(data)
  }

  const getUser = async (id: string) => {
    const { data, error } = await supabase.from('User').select('*').eq('id', id).single();
    if(error) {
      await supabase.auth.signOut();
      return Alert.alert("User not found")
    };

    setUser(data);
    getLikes(data.id)
    getFollowing(data.id)
    getFollowers(data.id)
    router.push('/(tabs)');
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if(error) return Alert.alert(error.message);
    getUser(data.user.id);
  };

  const signUp = async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if(error) return Alert.alert(error.message);

    const { data: userData, error: userError } = await supabase
      .from('User')
      .upsert({
        id: data?.user?.id,
        username: username,
        email: email,
      })
      .select();
    if(userError) return console.error(userError);
    setUser(userData[0]);
    router.back()
    router.push('/(tabs)');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.back()
    router.replace('/(auth)');
  };

  const deleteAccount = async () => {
    if(!user) return

    const { error } = await supabase.from('User').delete().eq('id', user?.id);
    if(error) return console.error(error);

    signOut()
  }

  React.useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
      if(!session) return router.push('/(auth)');

      getUser(session?.user?.id);
    });
    return () => {
      authData.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ 
    user, 
    signIn, 
    signUp, 
    signOut, 
    likes, 
    getLikes, 
    following, 
    getFollowing, 
    followers, 
    getFollowers,
    friends,
    getFriends,
    deleteAccount
  }}>
    {children}
  </AuthContext.Provider>
}
