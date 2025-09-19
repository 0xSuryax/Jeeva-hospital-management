import {AppState, Platform} from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient, processLock} from '@supabase/supabase-js';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '@env';

const supabaseUrl = SUPABASE_URL || '';
const supabaseAnonKey = SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? {storage: AsyncStorage} : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

export const fetchNearbyHospitals = async (
  lng: number,
  lat: number,
  radiusKm: number,
  pageSize = 10,
  pageNumber = 1,
) => {
  const {data, error} = await supabase.rpc('get_hospitals_nearby', {
    lng,
    lat,
    radius_km: radiusKm,
    page_size: pageSize,
    page_number: pageNumber,
  });

  if (error) {
    console.error('Error fetching hospitals:', error);
    return [];
  }
  return data;
};

export const updateBedAvailability = async (
  beds_available: number,
  total_beds: number,
  ct_scan_av_date: string | null,
  mri_av_date: string | null,
) => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      return null;
    }

    if (!user) {
      console.error('No authenticated user found.');
      return null;
    }

    const uid = user.id;

    // Check if hospital exists for this admin UID
    const { data: hospital, error: fetchError } = await supabase
      .from('hospitals')
      .select('id')
      .eq('hospital_admin_id', uid)
      .single();

    if (fetchError) {
      console.error('Error fetching hospital:', fetchError);
      return null;
    }

    if (!hospital) {
      // UID not found in hospitals table
      return 1;
    }

    // Update beds + scan availability
    const { error: updateError } = await supabase
      .from('hospitals')
      .update({
        beds_available,
        total_beds,
        ct_scan_av_date,
        mri_av_date,
      })
      .eq('hospital_admin_id', uid);

    if (updateError) {
      console.error('Error updating hospital:', updateError);
      return null;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error in updateBedAvailability:', err);
    return null;
  }
};

export const getCurrentBedAvailability = async () => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      return null;
    }

    if (!user) {
      console.error('No authenticated user found.');
      return null;
    }

    const uid = user.id;

    // Fetch hospital bed + scan availability
    const { data: hospital, error: fetchError } = await supabase
      .from('hospitals')
      .select('beds_available, total_beds, ct_scan_av_date, mri_av_date')
      .eq('hospital_admin_id', uid)
      .single();

    if (fetchError) {
      console.error('Error fetching bed availability:', fetchError);
      return null;
    }

    if (!hospital) {
      // UID not found in hospitals table
      return 1;
    }

    return {
      beds_available: hospital.beds_available,
      total_beds: hospital.total_beds,
      ct_scan_av_date: hospital.ct_scan_av_date,
      mri_av_date: hospital.mri_av_date,
    };
  } catch (err) {
    console.error('Unexpected error in getCurrentBedAvailability:', err);
    return null;
  }
};




// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
