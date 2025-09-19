import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import {
  Card,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import {
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import {
  getCurrentBedAvailability,
  updateBedAvailability,
} from '../lib/supabase';

const Home = () => {
  const [bedsAvailable, setBedsAvailable] = useState('');
  const [totalBeds, setTotalBeds] = useState('');
  const [ctScanDate, setCtScanDate] = useState('');
  const [mriDate, setMriDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch current availability
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const data = await getCurrentBedAvailability();
      if (data && data !== 1) {
        setBedsAvailable(String(data.beds_available ?? ''));
        setTotalBeds(String(data.total_beds ?? ''));
        setCtScanDate(data.ct_scan_av_date ?? '');
        setMriDate(data.mri_av_date ?? '');
      } else if (data === 1) {
        Alert.alert('No hospital found for this account');
      }
      setFetching(false);
    };
    fetchData();
  }, []);

  // Save values
  const handleSave = async () => {
    if (!bedsAvailable || !totalBeds) {
      Alert.alert('Please fill Beds Available and Total Beds');
      return;
    }
    setLoading(true);
    const res = await updateBedAvailability(
      parseInt(bedsAvailable, 10),
      parseInt(totalBeds, 10),
      ctScanDate || null,
      mriDate || null,
    );
    if (res === true) {
      Alert.alert('✅ Success', 'Hospital info updated successfully!');
    } else if (res === 1) {
      Alert.alert('Error', 'No hospital found for this account');
    } else {
      Alert.alert('Error', 'Something went wrong');
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text style={styles.title}>🏥 Hospital Management</Text>
          <Text style={styles.subtitle}>
            Update bed and scan availability
          </Text>

          {/* Bed Availability Section */}
          <Text style={styles.sectionTitle}>🛏️ Bed Availability</Text>
          <TextInput
            label="Beds Available"
            mode="outlined"
            value={bedsAvailable}
            onChangeText={setBedsAvailable}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Total Beds"
            mode="outlined"
            value={totalBeds}
            onChangeText={setTotalBeds}
            keyboardType="numeric"
            style={styles.input}
          />

          <Divider style={styles.divider} />

          {/* Scan Availability Section */}
          <Text style={styles.sectionTitle}>🧪 Scan Availability</Text>
          <TextInput
            label="CT Scan Available Date (YYYY-MM-DD)"
            mode="outlined"
            value={ctScanDate}
            onChangeText={setCtScanDate}
            placeholder="e.g., 2025-09-25"
            style={styles.input}
          />
          <TextInput
            label="MRI Available Date (YYYY-MM-DD)"
            mode="outlined"
            value={mriDate}
            onChangeText={setMriDate}
            placeholder="e.g., 2025-10-01"
            style={styles.input}
          />

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            contentStyle={styles.buttonContent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator animating color="white" />
            ) : (
              '💾 Save Changes'
            )}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: moderateScale(20),
    backgroundColor: '#f5f7fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(12),
    elevation: 6,
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginBottom: verticalScale(6),
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#7f8c8d',
    marginBottom: verticalScale(18),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(10),
    color: '#34495e',
  },
  input: {
    marginBottom: verticalScale(14),
  },
  divider: {
    marginVertical: verticalScale(20),
  },
  button: {
    marginTop: verticalScale(14),
    borderRadius: moderateScale(12),
  },
  buttonContent: {
    paddingVertical: verticalScale(10),
  },
});
