import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import {
  API_BASE_URL,
  getStoredBackendUrl,
  setStoredBackendUrl,
  getDefaultBackendUrl,
} from '../config/apiConfig';
import { testBackendHealthApi } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNetworkErr, setIsNetworkErr] = useState(false);

  // Server settings modal state
  const [showServerModal, setShowServerModal] = useState(false);
  const [currentServerUrl, setCurrentServerUrl] = useState(API_BASE_URL);
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const { login } = useContext(AuthContext);

  useEffect(() => {
    const loadCurrentUrl = async () => {
      const active = await getStoredBackendUrl();
      setCurrentServerUrl(active);
      setCustomInputUrl(active);
    };
    loadCurrentUrl();
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');
    setIsNetworkErr(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error);
      if (result.isNetworkError) {
        setIsNetworkErr(true);
      }
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const urlToTest = customInputUrl.trim() || currentServerUrl;
      const res = await testBackendHealthApi(urlToTest);
      if (res.data?.success || res.status === 200) {
        setTestResult({
          success: true,
          message: 'Connected successfully to backend server!',
        });
      } else {
        setTestResult({
          success: false,
          message: 'Server responded, but unexpected response format.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message:
          'Cannot connect. Check IP address, port 5001, and ensure phone & Mac share Wi-Fi.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveServerUrl = async () => {
    if (!customInputUrl.trim()) {
      Alert.alert('Validation', 'Please enter a valid URL.');
      return;
    }
    const saved = await setStoredBackendUrl(customInputUrl.trim());
    setCurrentServerUrl(saved);
    setShowServerModal(false);
    setErrorMessage('');
    setIsNetworkErr(false);
    Alert.alert('Server Updated 🌐', `App is now connected to:\n${saved}`);
  };

  const handleResetServerUrl = async () => {
    const defaultUrl = await setStoredBackendUrl('');
    setCurrentServerUrl(defaultUrl);
    setCustomInputUrl(defaultUrl);
    setTestResult(null);
    Alert.alert('Reset Complete', `Restored auto-detected URL:\n${defaultUrl}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.brandTitle}>🍔 FoodieExpress</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              {isNetworkErr && (
                <TouchableOpacity
                  style={styles.errorFixBtn}
                  onPress={() => setShowServerModal(true)}
                >
                  <Text style={styles.errorFixBtnText}>⚙️ Configure Server IP</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="user@example.com"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Register here</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Server Connection Indicator */}
          <View style={styles.serverRow}>
            <TouchableOpacity
              style={styles.serverPill}
              onPress={() => setShowServerModal(true)}
            >
              <Text style={styles.serverPillText} numberOfLines={1}>
                🌐 Server: {currentServerUrl}
              </Text>
              <Text style={styles.serverChangeText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Server Configuration Modal */}
      <Modal
        visible={showServerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowServerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🌐 Server Connection Settings</Text>
            <Text style={styles.modalSubtitle}>
              Ensure your phone can reach the backend. If testing on a physical phone, enter your Mac's LAN IP address or deployed URL.
            </Text>

            <Text style={styles.modalInputLabel}>Backend API URL</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="http://192.168.x.x:5001/api"
              placeholderTextColor="#64748B"
              value={customInputUrl}
              onChangeText={setCustomInputUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {testResult && (
              <View
                style={[
                  styles.testResultBox,
                  testResult.success ? styles.testSuccessBox : styles.testFailBox,
                ]}
              >
                <Text
                  style={[
                    styles.testResultText,
                    testResult.success ? styles.testSuccessText : styles.testFailText,
                  ]}
                >
                  {testResult.success ? '✅' : '❌'} {testResult.message}
                </Text>
              </View>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={handleTestConnection}
                disabled={testingConnection}
              >
                {testingConnection ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.testBtnText}>⚡ Test Ping</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveServerUrl}
              >
                <Text style={styles.saveBtnText}>Save & Apply</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSecondaryRow}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetServerUrl}
              >
                <Text style={styles.resetBtnText}>Auto-Detect IP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowServerModal(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  formContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    lineHeight: 18,
  },
  errorFixBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  errorFixBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 15,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  linkText: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '700',
  },
  serverRow: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  serverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serverPillText: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
    marginRight: 8,
  },
  serverChangeText: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Server Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  testResultBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  testSuccessBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  testFailBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  testResultText: {
    fontSize: 12,
  },
  testSuccessText: {
    color: '#6EE7B7',
  },
  testFailText: {
    color: '#FCA5A5',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  testBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  modalSecondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  resetBtn: {
    paddingVertical: 6,
  },
  resetBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LoginScreen;
