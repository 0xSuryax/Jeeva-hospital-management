import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert('Login failed', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={signInWithEmail}
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={loading}
          >
            {loading ? <ActivityIndicator animating color="white" /> : 'Sign In'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
    backgroundColor: '#f9f9f9',
  },
  card: {
    width: '100%',
    borderRadius: moderateScale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    elevation: 4,
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#555',
    marginBottom: verticalScale(20),
  },
  input: {
    marginBottom: verticalScale(15),
  },
  button: {
    marginTop: verticalScale(10),
    borderRadius: moderateScale(10),
  },
  buttonContent: {
    paddingVertical: verticalScale(8),
  },
});
