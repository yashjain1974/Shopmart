import React, { useState, useCallback, memo,useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Switch, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../store/AuthContext';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import productData from '../../assets/data/products.json';
const API_URL = 'http://192.168.215.166:8000';
const ProductPickerModal = memo(({ 
  visible, 
  onClose, 
  onSelectProduct, 
  selectedProducts,
  products 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = useCallback(({ item }) => (
    <TouchableOpacity 
      style={[
        styles.productSelectItem,
        selectedProducts.find(p => p.id === item.id) && styles.productSelectItemActive
      ]}
      onPress={() => onSelectProduct(item)}
    >
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.productSelectImage} 
      />
      <View style={styles.productSelectInfo}>
        <Text style={styles.productSelectName}>{item.name}</Text>
        <Text style={styles.productSelectPrice}>${item.price}</Text>
      </View>
      {selectedProducts.find(p => p.id === item.id) && (
        <Icon name="check-circle" type="material" color="#8A2BE2" size={24} />
      )}
    </TouchableOpacity>
  ), [selectedProducts, onSelectProduct]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Products</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" type="material" size={24} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// Separate SelectedProductsList into its own component
const SelectedProductsList = memo(({ products, onRemove }) => {
  if (products.length === 0) return null;

  return (
    <View style={styles.selectedProductsContainer}>
      <Text style={styles.selectedProductsTitle}>Selected Products:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
          <View key={product.id} style={styles.selectedProductItem}>
            <Image 
              source={{ uri: product.images[0] }} 
              style={styles.selectedProductImage} 
            />
            <Text numberOfLines={1} style={styles.selectedProductName}>
              {product.name}
            </Text>
            <TouchableOpacity 
              style={styles.removeProductButton}
              onPress={() => onRemove(product.id)}
            >
              <Icon name="close" type="material" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});
const ContentUploadPage = ({ route }) => {
  const { user, loading } = useAuth();
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false);
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [shareToFeed, setShareToFeed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const { preSelectedProduct } = route.params || {};
  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProducts(prev => {
        // Check if the product is already selected
        const isAlreadySelected = prev.some(p => p.id === preSelectedProduct.id);
        if (!isAlreadySelected) {
          return [...prev, preSelectedProduct];
        }
        return prev;
      });
    }
  }, [preSelectedProduct]);
  const filteredProducts = productData.products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = useCallback((product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.find(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeSelectedProduct = useCallback((productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  // Cloudinary configuration
  const CLOUD_NAME = 'dhkxkap0h';
  const UPLOAD_PRESET = 'hu6utvjx';

  const handleUploadVideo = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your media library');
        return;
      }

      // Launch video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // Maximum 60 seconds video
      });

      if (!result.canceled) {
        setUploading(true);
        const videoUri = result.assets[0].uri;

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', {
          uri: videoUri,
          type: 'video/mp4',
          name: 'upload.mp4',
        });
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('cloud_name', CLOUD_NAME);

        // Upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
          {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const data = await response.json();
        
        if (data.secure_url) {
          setVideoUrl(data.secure_url);
          setVideoUploaded(true);
          console.log('Cloudinary Video URL:', data.secure_url);
          Alert.alert('Success', 'Video uploaded successfully!');
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setThumbnailUploaded(true);
        // Handle thumbnail upload logic here
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload thumbnail');
    }
  };

  const handleUploadInvoice = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setInvoiceUploaded(true);
        // Handle invoice upload logic here
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload invoice');
    }
  };
 

  const handleMainUpload = useCallback(async () => {
    try {
      // Validate required fields
      if (!videoUploaded) {
        Alert.alert('Error', 'Please upload a video first');
        return;
      }
  
      if (!videoTitle.trim()) {
        Alert.alert('Error', 'Please enter a video title');
        return;
      }
  
      // Show loading state
      setUploading(true);
  
      // Prepare the upload data
      const uploadData = {
        videoUrl,
        videoTitle,
        category,
        description: description.trim(), // Trim whitespace
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Remove empty tags
        shareToFeed,
        productIds: selectedProducts.map(product => product.id),
        creatorId: user.email // using email as creator ID
      };
  
      // Make the POST request
      const response = await fetch(`${API_URL}/content/upload/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          // 'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(uploadData)
      });
  
      // Parse the response
      const result = await response.json();
  
      // Check if request was successful
      if (response.ok) {
        // Show success message
        Alert.alert(
          'Success',
          'Content uploaded successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form and navigate back
                navigation.goBack();
                // Or navigate to the content view
                // navigation.navigate('ContentView', { contentId: result.contentId });
              }
            }
          ]
        );
      } else {
        // Handle error from server
        throw new Error(result.detail || 'Failed to upload content');
      }
  
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Error',
        'Failed to upload content. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setUploading(false);
    }
  }, [
    videoUploaded,
    videoTitle,
    videoUrl,
    category,
    description,
    tags,
    shareToFeed,
    selectedProducts,
    user,
    navigation
  ]);


  if(!user) {
    return (
      <View style={styles.container1}>
        <Text>Please log in to view your profile</Text>
        <Button title="Log In" onPress={() => navigation.navigate('Login')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      </View>
    );
  }
  const renderSelectedProducts = () => (
    <View style={styles.selectedProductsContainer}>
      <Text style={styles.sectionTitle}>Selected Products:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedProducts.map((product) => (
          <View key={product.id} style={styles.selectedProductItem}>
            <Image 
              source={{ uri: product.images[0] }} 
              style={styles.selectedProductImage}
            />
            <Text numberOfLines={1} style={styles.selectedProductName}>
              {product.name}
            </Text>
            <TouchableOpacity
              style={styles.removeProductButton}
              onPress={() => handleRemoveProduct(product.id)}
            >
              <Icon name="close" type="material" color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
   

    <ScrollView style={styles.container}>
    <View style={styles.headerIcons}></View>
    <View style={styles.header}>
      <Icon name="arrow-back" type="material" onPress={() => navigation.goBack()} />
      <Text style={styles.headerTitle}>Upload Video</Text>
      <Icon name="close" type="material" onPress={() => navigation.goBack()} />
    </View>

    <TouchableOpacity 
      style={styles.uploadBox} 
      onPress={handleUploadVideo}
      disabled={uploading}
    >
      {uploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.uploadingText}>Uploading video...</Text>
        </View>
      ) : !videoUploaded ? (
        <>
          <Icon name="video-camera" type="font-awesome" size={50} color="#aaa" />
          <Text style={styles.uploadText}>Tap To Upload A Video File</Text>
        </>
      ) : (
        <>
          <Icon name="check-circle" type="font-awesome" size={50} color="#4CAF50" />
          <Text style={styles.uploadedText}>Video Uploaded Successfully</Text>
          <View style={styles.uploadActions}>
            <TouchableOpacity onPress={handleUploadVideo}>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setVideoUploaded(false);
              setVideoUrl(null);
            }}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
    
      <TextInput
        style={styles.input}
        placeholder="Video Title"
        value={videoTitle}
        onChangeText={setVideoTitle}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Fashion" value="Fashion" />
          <Picker.Item label="Fun" value="Fun" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Travel" value="Travel" />
          <Picker.Item label="Educational" value="Educational" />
          <Picker.Item label="Promotion" value="Promotion" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      <TouchableOpacity 
        style={styles.productPickerButton}
        onPress={() => setShowProductPicker(true)}
      >
        <Text style={styles.productPickerButtonText}>
          Select Featured Products ({selectedProducts.length})
        </Text>
        <Icon name="add-circle-outline" type="material" color="#8A2BE2" />
      </TouchableOpacity>
      <SelectedProductsList 
        products={selectedProducts}
        onRemove={removeSelectedProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Share to your Newsfeed?</Text>
        <Switch
          value={shareToFeed}
          onValueChange={setShareToFeed}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={shareToFeed ? '#8A2BE2' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity 
      style={[
        styles.uploadButton,
        (!videoUploaded || !videoTitle.trim() || uploading) && styles.uploadButtonDisabled
      ]}
      onPress={handleMainUpload}
      disabled={!videoUploaded || !videoTitle.trim() || uploading}
    >
      {uploading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.uploadButtonText}>Upload</Text>
      )}
    </TouchableOpacity>

    {uploading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#9c6da6" />
        <Text style={styles.loadingText}>Uploading your content...</Text>
      </View>
    )}
      <ProductPickerModal
        visible={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        onSelectProduct={handleProductSelect}
        selectedProducts={selectedProducts}
        products={productData.products}
      />

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    margin:20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadBox: {
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  uploadText: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadedText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
  uploadActions: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButton: {
    color: '#8A2BE2',
    marginRight: 10,
  },
  removeButton: {
    color: '#FF3B30',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  switchText: {
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom:30,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  uploadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    marginTop: 10,
    color: '#8A2BE2',
    fontSize: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  productSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productSelectItemActive: {
    backgroundColor: '#f0f0f0',
  },
  productSelectImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productSelectInfo: {
    flex: 1,
  },
  productSelectName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productSelectPrice: {
    color: '#8A2BE2',
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 20,
  },
  productPickerButtonText: {
    fontSize: 16,
    color: '#8A2BE2',
  },
  selectedProductsContainer: {
    marginBottom: 20,
  },
  selectedProductsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedProductItem: {
    width: 100,
    marginRight: 10,
    position: 'relative',
  },
  selectedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedProductName: {
    fontSize: 12,
    textAlign: 'center',
  },
  removeProductButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9c6da6',
  },
  uploadButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  }
});

export default ContentUploadPage;
