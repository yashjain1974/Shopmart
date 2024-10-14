import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { Icon } from "react-native-elements";
import ProductListModal from "./ProductListModal";
import axios from 'axios';

const { width, height } = Dimensions.get("window");

// Replace with your actual backend URL
const API_URL = 'http://192.168.242.166:8000';

const RenderItem = React.memo(
  ({
    item,
    index,
    currentVideoIndex,
    videoRefs,
    isMuted,
    onMutePress,
    onShowProducts,
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxDescriptionLength = 100;

    const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => {
            videoRefs.current[index] = ref;
          }}
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={index === currentVideoIndex}
          isLooping
          isMuted={isMuted}
        />
        <View style={styles.overlay}>
          <View style={styles.iconsContainer}>
            <Icon
              name="heart"
              type="feather"
              color="#e04353"
              size={30}
              containerStyle={styles.icon}
            />
            <Icon
              name="message-circle"
              type="feather"
              color="#6aad36"
              size={30}
              containerStyle={styles.icon}
            />
            <Icon
              name="share-2"
              type="feather"
              color="#669be8"
              size={30}
              containerStyle={styles.icon}
            />
            <TouchableOpacity onPress={() => onMutePress(index)}>
              <Icon
                name={isMuted ? "volume-x" : "volume-2"}
                type="feather"
                color="#fff"
                size={30}
                containerStyle={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShowProducts(index)}>
              <Icon
                name="shopping-bag"
                type="feather"
                color="#dbbb3b"
                size={30}
                containerStyle={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>
              {isExpanded
                ? item.description
                : `${item.description.slice(0, maxDescriptionLength)}... `}
              {item.description.length > maxDescriptionLength && (
                <Text style={styles.seeMoreText} onPress={toggleDescription}>
                  {isExpanded ? "See less" : "See more"}
                </Text>
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

const ReelList = () => {
  const [reels, setReels] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      console.log('Fetching reels from:', `${API_URL}/reels/`);
      const response = await axios.get(`${API_URL}/reels/`, { timeout: 10000 });
      console.log('Reels fetched successfully:', response.data);
      setReels(response.data.reels);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reels:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to fetch reels. Please check your connection and try again.');
      setIsLoading(false);
      Alert.alert('Error', 'Failed to fetch reels. Please check your connection and try again.');
    }
  };

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

  const onShowProducts = useCallback(
    (index) => {
      if (videoRefs.current[index]) {
        videoRefs.current[index].pauseAsync();
      }
      setIsModalVisible(true);
    },
    []
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
        onShowProducts={onShowProducts}
      />
    ),
    [currentVideoIndex, isMuted]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
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
      <ProductListModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  textContainer: {
    
    flex: 1,
    marginBottom:10,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#fff",
  },
  seeMoreText: {
    color: "#c5a1d4",
    fontWeight: "bold",
  },
});

export default ReelList;
