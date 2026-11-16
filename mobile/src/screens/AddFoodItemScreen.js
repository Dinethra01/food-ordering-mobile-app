import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createFoodItemApi, updateFoodItemApi } from '../services/api';
import { getImageUrl } from '../config/apiConfig';

const AddFoodItemScreen = ({ route, navigation }) => {
  const existingItem = route.params?.item;
  const isEditing = !!existingItem;

  const [name, setName] = useState(existingItem?.name || '');
  const [price, setPrice] = useState(existingItem?.price ? String(existingItem.price) : '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [category, setCategory] = useState(existingItem?.category || 'Main Course');
  const [stockQuantity, setStockQuantity] = useState(
    existingItem?.stockQuantity !== undefined ? String(existingItem.stockQuantity) : '20'
  );
  const [imageUri, setImageUri] = useState(existingItem?.image ? getImageUrl(existingItem.image) : null);
  const [newImageSelected, setNewImageSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Main Course', 'Starters', 'Desserts', 'Beverages'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required to upload an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setNewImageSelected(true);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !description.trim() || !stockQuantity.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than 0.');
      return;
    }

    if (isNaN(stockQuantity) || Number(stockQuantity) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid stock quantity.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('stockQuantity', stockQuantity.trim());

      if (newImageSelected && imageUri) {
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          name: filename,
          type,
        });
      }

      if (isEditing) {
        await updateFoodItemApi(existingItem._id, formData);
        setLoading(false);
        Alert.alert('Success', `'${name}' updated successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createFoodItemApi(formData);
        setLoading(false);
        Alert.alert('Success', `'${name}' created successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error saving food item:', error);
      const msg = error.response?.data?.message || 'Failed to save food item.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{isEditing ? '✏️ Edit Food Item' : '➕ Create New Food Item'}</Text>
        <Text style={styles.subtitle}>Admin Food Management CRUD</Text>

        {/* Image Selector */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Tap to choose food picture</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <Text style={styles.label}>Food Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Gourmet Bacon Cheeseburger"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 14.99"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Stock Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          value={stockQuantity}
          onChangeText={setStockQuantity}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe ingredients, taste, and portion size..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isEditing ? 'Save Changes' : 'Create Food Item'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#FF6B00',
    marginBottom: 20,
  },
  imagePicker: {
    height: 160,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  imagePlaceholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: '#FFF',
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  categoryChipText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AddFoodItemScreen;
