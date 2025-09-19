import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import ProtectedStack from './ProtectedStack';
import {useEffect, useState} from 'react';
import {Session} from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
const Routes = () => {
  //auth logic
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? ProtectedStack() : AuthStack()}
    </NavigationContainer>
  );
};

export default Routes;
