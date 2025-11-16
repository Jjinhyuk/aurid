import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('프로필 로드 에러:', error);
      }

      setProfile(data);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const signUp = async (email, password, additionalData = {}) => {
    try {
      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) return { data: null, error: authError };
      if (!authData.user) return { data: null, error: { message: '회원가입 실패' } };

      // 2. 프로필 자동 생성 (신원 정보 포함)
      const handle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: authData.user.id,
          handle: handle,
          display_name: additionalData.real_name || handle,
          email: email,
          short_code: shortCode,
          // 신원 정보 (수정 불가)
          real_name: additionalData.real_name,
          birth_date: additionalData.birth_date,
          gender: additionalData.gender,
          identity_hash: additionalData.identity_hash,
          phone: additionalData.phone,
          // 기본 설정
          categories: additionalData.categories || [],
          visibility_json: {
            name: true,
            headline: true,
            email: false,
            phone: false,
            links: true,
            bio: true,
          },
        }])
        .select()
        .single();

      if (profileError) {
        console.error('프로필 생성 에러:', profileError);
        return { data: null, error: profileError };
      }

      return { data: { user: authData.user, profile: profileData }, error: null };
    } catch (error) {
      console.error('회원가입 처리 에러:', error);
      return { data: null, error };
    }
  };

  // 로그인
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // 로그아웃
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  // 프로필 생성
  const createProfile = async (profileData) => {
    if (!user) return { error: { message: '로그인이 필요합니다' } };

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        user_id: user.id,
        ...profileData,
      }])
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }

    return { data, error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    createProfile,
    refreshProfile: () => user && loadProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
