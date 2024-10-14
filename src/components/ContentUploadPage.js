import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../store/AuthContext';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

const ContentUploadPage = () => {
  const { user, loading } = useAuth();
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false);
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [shareToFeed, setShareToFeed] = useState(false);
  const navigation = useNavigation();

  const handleUploadVideo = () => {
    // Logic for uploading video
    setVideoUploaded(true);
  };

  const handleUploadThumbnail = () => {
    // Logic for uploading thumbnail
    setThumbnailUploaded(true);
  };

  const handleUploadInvoice = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setInvoiceUploaded(true);
      // Handle the file
    }
  };
  if(!user){
    return (
      <View style={styles.container1}>
        <Text>Please log in to view your profile</Text>
        <Button title="Log In" onPress={() => navigation.navigate('Login')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      </View>
    )
      
  }
  return (
   

    <ScrollView style={styles.container}>
      <View style={styles.headerIcons}></View>
      <View style={styles.header}>
        <Icon name="arrow-back" type="material" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Upload Video</Text>
        <Icon name="close" type="material" onPress={() => navigation.goBack()} />
      </View>

      <TouchableOpacity style={styles.uploadBox} onPress={handleUploadVideo}>
        {!videoUploaded ? (
          <>
            <Icon name="video-camera" type="font-awesome" size={50} color="#aaa" />
            <Text style={styles.uploadText}>Tap To Upload A Video File</Text>
          </>
        ) : (
          <>
            <Image source={{ uri: 'https://yourvideothumbnailurl.com' }} style={styles.uploadedImage} />
            <View style={styles.uploadActions}>
              <TouchableOpacity onPress={handleUploadVideo}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVideoUploaded(false)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBox} onPress={handleUploadThumbnail}>
        {!thumbnailUploaded ? (
          <>
            <Icon name="image" type="font-awesome" size={50} color="#aaa" />
            <Text style={styles.uploadText}>Tap To Upload A Thumbnail Photo</Text>
          </>
        ) : (
          <>
            <Image source={{ uri: 'https://yourthumbnailurl.com' }} style={styles.uploadedImage} />
            <View style={styles.uploadActions}>
              <TouchableOpacity onPress={handleUploadThumbnail}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setThumbnailUploaded(false)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBox} onPress={handleUploadInvoice}>
        {!invoiceUploaded ? (
          <>
            <Icon name="file" type="font-awesome" size={50} color="#aaa" />
            <Text style={styles.uploadText}>Tap To Upload Invoice (Optional)</Text>
          </>
        ) : (
          <>
            <Text style={styles.uploadedText}>Invoice Uploaded</Text>
            <View style={styles.uploadActions}>
              <TouchableOpacity onPress={handleUploadInvoice}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setInvoiceUploaded(false)}>
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

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
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
});

export default ContentUploadPage;
