import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

export default function CardEditorScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  const [selectedColor, setSelectedColor] = useState(colors.primaryEmphasis);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    headline: true,
    email: true,
    phone: true,
    links: true,
    qr: true,
  });

  // Load existing settings from profile
  useEffect(() => {
    if (profile?.card_settings) {
      const settings = profile.card_settings;
      if (settings.template) setSelectedTemplate(settings.template);
      if (settings.color) setSelectedColor(settings.color);
      if (settings.visibleFields) setVisibleFields(settings.visibleFields);
    }
  }, [profile]);

  const templates = [
    { id: 'basic', name: '기본형' },
    { id: 'modern', name: '모던' },
    { id: 'minimal', name: '미니멀' },
  ];

  const colorOptions = [
    { id: 'blue', hex: colors.primaryEmphasis, name: '블루' },
    { id: 'black', hex: '#000000', name: '블랙' },
    { id: 'green', hex: '#34C759', name: '그린' },
    { id: 'purple', hex: '#AF52DE', name: '퍼플' },
    { id: 'red', hex: colors.error, name: '레드' },
  ];

  const toggleField = (field) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const cardSettings = {
        template: selectedTemplate,
        color: selectedColor,
        visibleFields: visibleFields,
      };

      const { error } = await supabase
        .from('profiles')
        .update({ card_settings: cardSettings })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('저장 완료', '명함 설정이 저장되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('저장 실패', '명함 설정을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>명함 꾸미기</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? '저장 중...' : '저장'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 실시간 미리보기 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 실시간 미리보기</Text>
          <View style={styles.previewCard}>
            <View style={styles.miniCard}>
              <View style={styles.miniAvatar} />
              <View style={styles.miniLine} />
              <View style={[styles.miniLine, { width: 60 }]} />
            </View>
          </View>
          <Text style={styles.previewNote}>변경사항이 실시간으로 반영됩니다</Text>
        </View>

        {/* 템플릿 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 템플릿 선택</Text>
          <View style={styles.templateGrid}>
            {templates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateButton,
                  selectedTemplate === template.id && styles.templateButtonActive
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <Text style={[
                  styles.templateText,
                  selectedTemplate === template.id && styles.templateTextActive
                ]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 색상 테마 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌈 색상 테마</Text>
          <View style={styles.colorGrid}>
            {colorOptions.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorButton,
                  selectedColor === color.hex && styles.colorButtonActive
                ]}
                onPress={() => setSelectedColor(color.hex)}
              >
                <View style={[styles.colorCircle, { backgroundColor: color.hex }]} />
                <Text style={styles.colorName}>{color.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 표시할 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 표시할 정보</Text>
          <View style={styles.fieldList}>
            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('name')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.name ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.name ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>이름</Text>
              </View>
              <Text style={styles.fieldRequired}>필수</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('headline')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.headline ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.headline ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>직함/한줄소개</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('email')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.email ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.email ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>이메일</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('phone')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.phone ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.phone ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>전화번호</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('links')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.links ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.links ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>링크 3개</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fieldItem}
              onPress={() => toggleField('qr')}
            >
              <View style={styles.fieldLeft}>
                <Ionicons
                  name={visibleFields.qr ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={visibleFields.qr ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.fieldLabel}>QR 코드</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 로고/아바타 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🖼️ 로고/아바타</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.primaryEmphasis} />
            <Text style={styles.uploadText}>이미지 업로드</Text>
            <Text style={styles.uploadSubtext}>JPG, PNG (최대 2MB)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.primaryEmphasis,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.text,
  },
  previewCard: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  miniCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  miniLine: {
    width: 80,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 6,
  },
  previewNote: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
  },
  templateGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  templateButton: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primaryEmphasis,
  },
  templateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  templateTextActive: {
    color: colors.primaryEmphasis,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primaryEmphasis,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorName: {
    fontSize: 14,
    color: colors.text,
  },
  fieldList: {
    gap: 12,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.text,
  },
  fieldRequired: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    color: colors.primaryEmphasis,
    fontWeight: '600',
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 5,
  },
});
