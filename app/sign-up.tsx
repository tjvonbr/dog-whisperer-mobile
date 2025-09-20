
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function RegisterScreen() {
  const { signUp } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dogName, setDogName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleAuth() {
    setIsLoading(true)

    const { data, error } = await signUp(email, password, {
      firstName,
      lastName,
      dogName,
    })

    if (error) {
      console.log("error")
      Alert.alert('Error', error.message)
    } else {
      console.log("Sign up successful", data)
      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/sign-in')
          }
        ]
      )
    }

    setIsLoading(false)
  }

  return (
    <SafeAreaView className="h-full w-full flex flex-col gap-6 px-6 bg-white">
      <View className="flex items-center">
        <Image 
          source={require('../assets/images/dog_whisperer_ai_logo.png')} 
          className="w-64 h-12"
          resizeMode="contain"
        />
      </View>

      <View className="grid gap-4">
        <Input
          className="border-2 border-gray-200 rounded-3xl px-4 py-1"
          label="First name"
          onChangeText={setFirstName}
          value={firstName}
          autoCapitalize="words"
          keyboardType="default"
          autoComplete="given-name"
        />

        <Input
          className="border-2 border-gray-200 rounded-3xl px-4 py-1"
          label="Last name"
          onChangeText={setLastName}
          value={lastName}
          autoCapitalize="words"
          keyboardType="default"
          autoComplete="family-name"
        />

        <Input
          className="border-2 border-gray-200 rounded-3xl px-4 py-1"
          label="Dog's name"
          onChangeText={setDogName}
          value={dogName}
          autoCapitalize="words"
          keyboardType="default"
        />

        <Input
          className="border-2 border-gray-200 rounded-3xl px-4 py-1"
          label="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        
        <Input
          className="border-2 border-gray-200 rounded-3xl px-4 py-1"
          label="Password"
          onChangeText={setPassword}
          value={password}
          showPasswordToggle
          autoCapitalize="none"
          autoComplete="password"
        />

        <View className="flex items-center">
          <Text className="text-center text-sm text-gray-600">
            By creating an account, I agree to the <Text className="underline text-blue-500">Terms of Service</Text> and acknowledge the <Text className="underline text-blue-500">Privacy Policy</Text>
          </Text>
        </View>
      </View>

      <View>
        <Pressable
          className='flex justify-center items-center py-4 px-6 rounded-full bg-[#1F2747]'
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg font-button">
              Sign up
            </Text>
          )}
        </Pressable>

        <Pressable
          className="mt-6 py-3"
          onPress={() => router.push('/sign-in')}
        >
          <Text className="text-gray-400 text-center text-base font-button">
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
