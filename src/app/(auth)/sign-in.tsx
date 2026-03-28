import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@constants';

/**
 * Sign-in screen — email / password authentication form.
 *
 * Navigates to the main app on successful submission.
 * Auth provider integration replaces direct navigation in Step 3.
 */
export default function SignInScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0;

  const handleSignIn = () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '800',
                color: Colors.textPrimary,
                letterSpacing: 2,
              }}
            >
              CoM-PTT
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                marginTop: 8,
              }}
            >
              City of Melbourne — Parking Enforcement
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <TextInput
              style={{
                backgroundColor: Colors.bgSurface,
                color: Colors.textPrimary,
                fontSize: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.textSecondary + '33',
              }}
              placeholder="Email address"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <TextInput
              style={{
                backgroundColor: Colors.bgSurface,
                color: Colors.textPrimary,
                fontSize: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.textSecondary + '33',
              }}
              placeholder="Password"
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            <Pressable
              onPress={handleSignIn}
              disabled={!isFormValid || isSubmitting}
              style={({ pressed }) => ({
                backgroundColor: isFormValid
                  ? Colors.accentGreen
                  : Colors.textSecondary + '33',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
                marginTop: 8,
              })}
            >
              <Text
                style={{
                  color: Colors.textPrimary,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                {isSubmitting ? 'Signing in\u2026' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
