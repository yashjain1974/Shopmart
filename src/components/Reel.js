import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Icon } from "react-native-elements";
import ProductListModal from "./ProductListModal";
import axios from 'axios';

const { width, height } = Dimensions.get("window");

// Replace with your actual backend URL
const API_URL = process.env.REACT_APP_API_URL;

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
    const [error, setError] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };
    const onVideoLoad = () => {
      setVideoLoading(false);
    };

    // Added handler for video error
    const onVideoError = (error) => {
      setError(error);
      setVideoLoading(false);
    };
    return (
      <View style={styles.videoContainer}>
        {videoLoading && (
          <ActivityIndicator 
            size="large" 
            color="#fff" 
            style={styles.videoLoader}
          />
        )}
        <Video
          ref={(ref) => {
            videoRefs.current[index] = ref;
          }}
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={index === currentVideoIndex}
          isLooping
          isMuted={isMuted}
          onLoad={onVideoLoad}
          onError={onVideoError}
        />

<View style={styles.overlay}>
          <View style={styles.creatorInfo}>
            <Image 
              source={{ uri: item.creator?.profileImage || 'default_profile_image_url' }} 
              style={styles.creatorImage}
            />
            <Text style={styles.creatorName}>{item.creator?.name || 'Anonymous'}</Text>
          </View>


          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon
                name="heart"
                type="feather"
                color="#e04353"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>{item.likes || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper}>
              <Icon
                name="message-circle"
                type="feather"
                color="#6aad36"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>{item.comments || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper}>
              <Icon
                name="share-2"
                type="feather"
                color="#669be8"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onMutePress(index)}>
              <Icon
                name={isMuted ? "volume-x" : "volume-2"}
                type="feather"
                color="#fff"
                size={30}
                containerStyle={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconWrapper}
              onPress={() => onShowProducts(index, item.productIds)} // Pass productIds
            >
              <Icon
                name="shopping-bag"
                type="feather"
                color="#dbbb3b"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>{item.productIds?.length || 0} Products</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>
              {isExpanded
                ? item.description
                : `${item.description?.slice(0, maxDescriptionLength)}... `}
              {item.description?.length > maxDescriptionLength && (
                <Text style={styles.seeMoreText} onPress={toggleDescription}>
                  {isExpanded ? "See less" : "See more"}
                </Text>
              )}
            </Text>
            {item.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, idx) => (
                  <Text key={idx} style={styles.tag}>#{tag}</Text>
                ))}
              </View>
            )}
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
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const response = await axios.get(`${API_URL}/content/`);
      setReels(response.data.content);
    } catch (error) {
      console.error('Error fetching reels:', error);
      setError('Failed to fetch reels. Please try again.');
    } finally {
      setIsLoading(false);
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

  const onShowProducts = useCallback((index, productIds) => {
    setSelectedProductIds(productIds);
    setIsModalVisible(true);
  }, []);
  

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
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" type="feather" size={50} color="#e04353" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReels}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
  productIds={selectedProductIds}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#9c6da6',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  videoLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    color: '#c5a1d4',
    marginRight: 10,
    fontSize: 14,
  },
});

export default ReelList;
