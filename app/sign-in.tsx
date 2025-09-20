import { IconSymbol } from '@/components/ui/icon-symbol'
import { Input } from '@/components/ui/input'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import "./globals.css"


export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
  }

  return (
    <SafeAreaView className="h-full flex flex-col gap-6 p-6 bg-white"> 
      <TouchableOpacity
        className="w-10 h-10 flex items-center justify-center rounded-2xl px-2 py-1"
        onPress={() => router.back()}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.left"
          color="black"
          size={18}
          weight="medium"
        />
      </TouchableOpacity>

      <View className="flex items-center">
        <Image 
          source={require('../assets/images/dog_whisperer_ai_logo.png')} 
          className="w-64 h-12"
          resizeMode="contain"
        />
        <Text className="text-md text-center text-gray-600 font-body">
          Welcome back to Dog Whisperer!
        </Text>
      </View>

      <View className="grid gap-4">
        <Input
          className="border border-black rounded-2xl px-4 py-1"
          label="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        
        <Input
          className="border border-black rounded-2xl px-4 py-1"
          label="Password"
          onChangeText={setPassword}
          value={password}
          showPasswordToggle
          autoCapitalize="none"
          autoComplete="password"
        />
      </View>

      <View>
        <Pressable
          className={`py-4 px-6 rounded-lg ${loading ? 'bg-gray-400' : 'bg-[#1F2747]'}`}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg font-button">
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Text>
        </Pressable>

        <Pressable
          className="mt-6 py-3"
          onPress={() => router.push('/sign-up')}
        >
          <Text className="text-gray-400 text-center text-base font-button">
             Don&apos;t have an account yet? Sign up
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}