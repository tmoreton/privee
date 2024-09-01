# Welcome to TikTok Clone

In this tutorial, we will be building a TikTok clone with Expo 51 (React Native) and Supabase.

## Getting Started

## Create a new React Native Expo project
```
npx create-expo-app@latest
npx expo start -c
```
EXPO Docs: https://docs.expo.dev/router/installation/


## Add to Github repo
```
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/GITHUB_ACCOUNT/tiktok.git
git push -u origin main
```

## Adding Nativewind
```
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```

Run `npx tailwindcss init` to create a `tailwind.config.js` file.
```ts
// tailwind.config.ts
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `babel.config.js` to use `nativewind/babel`:
```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

** Remember to restart the expo server after making changes to the babel config. **

Note: Typescript will throw and error on className so add the file `nativewind-env.d.ts` to the root of the project:
```ts
// nativewind-env.d.ts
/// <reference types="nativewind/types" /> 
```


## Add Expo Router
If using the latest expo install version expo router is included. If not you can add it with:
```
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```
```json
// package.json
{
  "main": "expo-router/entry"
}
```


## Add Empty Pages
Our routes will be as follows:
- app
  - index.tsx
  - _layout.tsx
  - (auth)
    - login.tsx
    - signup.tsx
  - (tabs)
    - index.tsx
    - _layout.tsx
    - home.tsx
    - friends.tsx
    - camera.tsx
    - inbox.tsx
    - profile.tsx
  - activity.tsx
  - chat.tsx
  - comment.tsx
  - followers.tsx
  - search.tsx
  - user.tsx

## Other folders
- assets
- components
- hooks
- prisma
- provider
- utils


## Adding Expo Icons
On our inital install the library is already added but if you want to add it later you can do so with:
```
npx expo install @expo/vector-icons
```

To see all the icons you have access to with expo icons you can use: https://icons.expo.fyi
```tsx
// _layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';

<Ionicons size={28} name="home" color={color} />
```


## Add Tab Navigation
```tsx
// (tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
    }}
  />
</Tabs>
```


## Adding Supabase
Next, install the `supabase` package:
```
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

Head over to https://database.new to create a new Supabase project.

Get the Project URL and anon key from the API settings:
1. Go to the API settings page in the Dashboard.
2. Find your Project URL, anon, and service_role keys on this page.
3. Copy these keys and paste them into your .env file.

EXPO Docs: https://docs.expo.dev/guides/using-supabase/


You can get <project-id> from your project's dashboard URL: https://supabase.com/dashboard/project/<project-id>
```
supabase link --project-ref <project-id>
supabase db pull
```
OR Add Manually to your .env file:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL="postgresql://postgres.USERNAME:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.USERNAME:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```


Then, create a `utils/supabase.ts` file in the root directory:
```ts
// utils/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Prisma & DB Structure
Add Prisma locally to manage schema
```
npm install prisma --save-dev
npx prisma init --datasource-provider postgresql
npx prisma generate
npx prisma migrate dev --name dev OR npx prisma db push
npx prisma format
```

### Prisma ORM
```sql
// prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DIRECT_URL")
  extensions = [uuidOssp(map: "uuid-ossp")]
}

model User {
  id         String     @id @unique
  username   String     @unique
  email      String     @unique
  created_at DateTime   @default(now())
  videos     Video[]
  likes      Like[]
  followers  Follower[]
  comments   Comment[]
  chats      Chat[]
}

model Video {
  id         String     @id @default(dbgenerated("uuid_generate_v4()"))
  title      String
  uri        String
  user_id    String
  user       User       @relation(fields: [user_id], references: [id], onDelete: Cascade)
  like       Like[]
  created_at DateTime   @default(now())
  Comment    Comment[]
}

model Like {
  id            String   @id @default(dbgenerated("uuid_generate_v4()"))
  user_id       String
  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  video_id      String
  video         Video    @relation(fields: [video_id], references: [id], onDelete: Cascade)
  video_user_id String
  created_at    DateTime @default(now())
}

model Follower {
  id               String   @id @default(dbgenerated("uuid_generate_v4()"))
  user_id          String
  user             User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  follower_user_id String
  created_at       DateTime @default(now())
}

model Comment {
  id            String   @id @default(dbgenerated("uuid_generate_v4()"))
  user_id       String
  user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  video_id      String
  video         Video    @relation(fields: [video_id], references: [id], onDelete: Cascade)
  video_user_id String
  text          String
  created_at    DateTime @default(now())
}

model Chat {
  id           String   @id @default(dbgenerated("uuid_generate_v4()"))
  user_id      String
  user         User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  chat_user_id String
  users_key    String
  text         String
  created_at   DateTime @default(now())
}
```

### HOW TO: Manually Create Tables in Supabase 
Create new tables in supabase SQL Editor:

```sql
create table
  User (
    id text primary key,
    username text not null,
    email text not null,
    created_at timestamp with time zone default current_timestamp
  );
```

#### Errors
```
permission denied for schema ****
```

Run the following in supabase SQL Editor:
```sql
grant usage on schema "public" to anon;
grant usage on schema "public" to authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "public" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "public" TO anon;
```

## Add Authentication Prodvider

```ts
// utils/supabase.ts
import { AppState } from 'react-native';
// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
```

```tsx
// provider/AuthProvider.tsx
import React from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

export const AuthContext = React.createContext({
	user: null,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = React.useState(null);
  const router = useRouter();

	const signUp = async (email: string, password: string, username: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if(error) return console.log(error)

    await supabase.from('User').insert({
      id: data.user?.id,
      email,
      username
    })
	};

	const getUser = async (user_id: string) => {
		const { data, error } = await supabase.from('User').select('*').eq('id', user_id).single()
		if(error) return console.log(error);
    setUser(data)
		router.push('/tabs')
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
	};

	React.useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      getUser(session?.user?.id)
		});
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	const value = React.useMemo(() => {
    const context: AuthContextProps = {
      user,
			signUp,
			signIn,
			signOut,
    };
    return context;
  }, [user]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};
```

## Add Camera Functionality
```
npx expo install expo-camera expo-media-library
```

Update app.json to include the camera permission:
```json
"plugins": [
  [
    "expo-camera",
    {
      "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
      "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
      "recordAudioAndroid": true
    }
  ],
  [
    "expo-media-library",
    {
      "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
      "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
      "isAccessMediaLocationEnabled": true
    }
  ]
]
```

EXPO Docs: https://docs.expo.dev/versions/latest/sdk/camera/

Functions to record and save videos:
```ts
const recordVideo = async () => {
  if (cameraRef.current) {
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      if (video?.uri) saveVideo(video?.uri);
    }
  }
}

const saveVideo = async (uri: string) => {
  const formData = new FormData();
  const fileName = videoUri?.split('/').pop()
  formData.append("Video", {
    name: fileName,
    type: "video/mov",
    uri: videoUri,
  });

  const { data, error } = await supabase.storage
    .from(`videos/${user?.id}`)
    .upload(fileName, formData, {
      cacheControl: '3600000',
      upsert: false
    });

  const { error: videoError } = await supabase.from('Video').insert({
    title: value,
    uri: `${user?.id}/${fileName}`,
    user_id: user?.id 
  })
}
```

### Displaying videos in a Home Feed
```
npx expo install expo-av
```

Add permission to app.json:
```json
[
  "expo-av",
  {
    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
  }
]
```

### Adding a profile
Create a reusable component for the profile:
```
npx expo install expo-image-picker
```

Update app.json to include the image picker permission:
```json
[
  "expo-image-picker",
  {
    "photosPermission": "The app accesses your photos to let you share them with your friends."
  }
]
```

### ERROR: Storage Bucket

##### New row policy errror;

```sql
CREATE POLICY "Give users access to own folder 1livt5k_1" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'videos' AND (select auth.uid()::text) = (storage.foldername(name))[1]);
```

### Tanstack Query 

```
npx expo install @tanstack/react-query
```

```ts
// hooks/getVideos.tsx
import { supabase } from "@/utils/supabase";
import { useQuery } from '@tanstack/react-query';

const getVideos = async () => {
  const { 
    data, 
    error 
  } = await supabase
    .from('Video')
    .select(`
      *,
      User (
        username
      )
    `)
    .order('created_at', { ascending: false })
    .limit(3)
  if(error) return console.error(error)
  return data
};

const getSignedUrl = async (videos: any[]) => {
  if(videos?.length < 1) return

  const { 
    data, 
    error 
  } = await supabase
    .storage
    .from('videos')
    .createSignedUrls(videos?.map((item) => item.uri), 60 * 60 * 24 * 365)

  let videoUrls = videos?.map((item) => {
    item.signedUrl = data?.find((signedUrl) => signedUrl.path === item.uri)?.signedUrl
    return item
  })
  if (error) return console.error(error)
    
  return videoUrls
}

export function useVideos(users?: any[]) {
  const {
    data: videos = [],
    refetch,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const videos = await getVideos()
      return await getSignedUrl(videos)
    },
    staleTime: 10000,
  });

  return {
    videos,
    refetch,
    error,
    isLoading,
  };
}
```
