import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Icon } from 'react-native-elements';
import ProductListModal from './ProductListModal';

const { width, height } = Dimensions.get('window');

const videos = [
  { id: '1', uri: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', title: 'Sample Video 1', description: 'A short sample video.' },
  { id: '2', uri: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4', title: 'Sample Video 2', description: 'Another short sample video.' },
  { id: '3', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Big Buck Bunny', description: 'A fun animated video.' },
  { id: '4', uri: 'https://www.w3schools.com/html/movie.mp4', title: 'Bear and Hare', description: 'Another fun animated video.' },
  { id: '5', uri: 'https://samplelib.com/lib/preview/mp4/sample-1mb.mp4', title: 'Sample Video 3', description: 'A short sample video.' },
  { id: '6', uri: 'https://samplelib.com/lib/preview/mp4/sample-3mb.mp4', title: 'Sample Video 4', description: 'Another short sample video.' },
  // Add more engaging video URIs here
];

const RenderItem = React.memo(({ item, index, currentVideoIndex, videoRefs, isMuted, onMutePress, onShowProducts }) => {
  return (
    <View style={styles.videoContainer}>
      <Video
        ref={(ref) => {
          videoRefs.current[index] = ref;
        }}
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={index === currentVideoIndex}
        isLooping
        isMuted={isMuted}
      />
      <View style={styles.overlay}>
        <View style={styles.iconsContainer}>
          <Icon name="heart" type="feather" color="#fff" size={30} containerStyle={styles.icon} />
          <Icon name="message-circle" type="feather" color="#fff" size={30} containerStyle={styles.icon} />
          <Icon name="share-2" type="feather" color="#fff" size={30} containerStyle={styles.icon} />
          <TouchableOpacity onPress={() => onMutePress(index)}>
            <Icon name={isMuted ? 'volume-x' : 'volume-2'} type="feather" color="#fff" size={30} containerStyle={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShowProducts}>
            <Icon name="shopping-bag" type="feather" color="#fff" size={30} containerStyle={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );
});

const ReelList = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const videoRefs = useRef([]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onMutePress = useCallback(
    (index) => {
      const isCurrentVideoMuted = !isMuted;
      setIsMuted(isCurrentVideoMuted);
      if (videoRefs.current[index]) {
        videoRefs.current[index].setStatusAsync({
          isMuted: isCurrentVideoMuted,
        });
      }
    },
    [isMuted]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <RenderItem
        item={item}
        index={index}
        currentVideoIndex={currentVideoIndex}
        videoRefs={videoRefs}
        isMuted={isMuted}
        onMutePress={onMutePress}
        onShowProducts={() => setIsModalVisible(true)}
      />
    ),
    [currentVideoIndex, isMuted]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <ProductListModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  iconsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 20,
  },
  icon: {
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ReelList;