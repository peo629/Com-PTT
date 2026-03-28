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
import { useAuth } from '@/providers/auth-provider';
import { AuthError, isAllowedEmailDomain } from '@/services/auth-service';

/**
 * Sign-in screen — email / password authentication form.
 *
 * Validates email domain against .gov.au restriction client-side.
 * Calls auth provider's signIn method on submission.
 * AuthGate handles navigation to (main) on successful authentication.
 */
export default function SignInScreen(): React.JSX.Element {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = email.length > 0 && isAllowedEmailDomain(email);
  const isFormValid = isEmailValid && password.length > 0;

  const handleSignIn = async (): Promise<void> => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
      // AuthGate handles navigation on successful auth state change
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  const emailBorderColor =
    email.length > 0 && !isAllowedEmailDomain(email)
      ? Colors.accentRed + '88'
      : Colors.textSecondary + '33';

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

          {error ? (
            <View
              style={{
                backgroundColor: Colors.accentRed + '22',
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}
              testID="error-banner"
            >
              <Text
                style={{
                  color: Colors.accentRed,
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <View style={{ gap: 16 }}>
            <View>
              <TextInput
                style={{
                  backgroundColor: Colors.bgSurface,
                  color: Colors.textPrimary,
                  fontSize: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: emailBorderColor,
                }}
                placeholder="Email address"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                testID="email-input"
              />
              {email.length > 0 && !isAllowedEmailDomain(email) ? (
                <Text
                  style={{
                    color: Colors.accentRed,
                    fontSize: 12,
                    marginTop: 4,
                    marginLeft: 4,
                  }}
                  testID="email-domain-error"
                >
                  Use a .gov.au email address
                </Text>
              ) : null}
            </View>

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
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={() => void handleSignIn()}
              testID="password-input"
            />

            <Pressable
              onPress={() => void handleSignIn()}
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
              testID="sign-in-button"
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
