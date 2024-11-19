import React, { useState, useRef, useCallback, useEffect } from "react";
import { API_URL } from '@env';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { Icon } from "react-native-elements";
import ProductListModal from "./ProductListModal";
import AnalyticsService from '../services/analytics';
import axios from 'axios';

const { width, height } = Dimensions.get("window");
const maxDescriptionLength = 100; // Add this constant
const ENGAGEMENT_THRESHOLD = 3000; // 3 seconds in milliseconds
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
    const [error, setError] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const [watchStartTime, setWatchStartTime] = useState(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [hasTrackedStart, setHasTrackedStart] = useState(false);
    const [lastProgressTrack, setLastProgressTrack] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [interactionStartTime, setInteractionStartTime] = useState(null);
    const [hasTrackedEngagement, setHasTrackedEngagement] = useState(false);

    // Track video start/end
    useEffect(() => {
      if (index === currentVideoIndex) {
        setWatchStartTime(Date.now());
        if (!hasTrackedStart) {
          AnalyticsService.trackEngagement(item.id, 'video_start', {
            videoTitle: item.title,
            creatorId: item.creator?.id,
            deviceInfo: Platform.OS
          });
          setHasTrackedStart(true);
        }
      } else if (watchStartTime && hasTrackedStart) {
        const watchDuration = (Date.now() - watchStartTime) / 1000;
        AnalyticsService.trackEngagement(item.id, 'video_end', {
          watchDuration,
          completionRate: videoProgress,
          isMuted
        });
        setWatchStartTime(null);
        setHasTrackedStart(false);
      }
    }, [currentVideoIndex, index]);

    const onPlaybackStatusUpdate = useCallback((status) => {
      if (status.isPlaying) {
        const progress = (status.positionMillis / status.durationMillis) * 100;
        setVideoProgress(progress);

        // Track progress at 25%, 50%, 75%, 100%
        const currentQuarter = Math.floor(progress / 25);
        if (currentQuarter > lastProgressTrack) {
          AnalyticsService.trackEngagement(item.id, 'video_progress', {
            progress: currentQuarter * 25,
            position: status.positionMillis,
            duration: status.durationMillis
          });
          setLastProgressTrack(currentQuarter);
        }
      }

      // Track buffering
      if (status.isBuffering !== isBuffering) {
        setIsBuffering(status.isBuffering);
        AnalyticsService.trackEngagement(item.id, status.isBuffering ? 'buffering_start' : 'buffering_end');
      }
    }, [item.id, lastProgressTrack, isBuffering]);

    const onVideoLoad = () => {
      setVideoLoading(false);
      AnalyticsService.trackEngagement(item.id, 'video_loaded', {
        loadTime: Date.now() - watchStartTime
      });
    };

    const onVideoError = (error) => {
      setError(error);
      setVideoLoading(false);
      AnalyticsService.trackEngagement(item.id, 'video_error', {
        error: error.toString()
      });
    };

    const handleLikePress = async () => {
      if (!hasTrackedEngagement) {
        await trackMeaningfulEngagement(item);
        setHasTrackedEngagement(true);
      }
      await AnalyticsService.trackEngagement(item.id, 'like', {
        videoTitle: item.title,
        creatorId: item.creator?.id
      });
      // Implement your like logic here
    };

    const handleCommentPress = async () => {
      await AnalyticsService.trackEngagement(item.id, 'comment', {
        videoTitle: item.title,
        creatorId: item.creator?.id
      });
      // Implement your comment logic here
    };

    const handleSharePress = async () => {
      await AnalyticsService.trackEngagement(item.id, 'share', {
        videoTitle: item.title,
        creatorId: item.creator?.id
      });
      // Implement your share logic here
    };

    const handleProductView = async () => {
      setInteractionStartTime(Date.now());
      await AnalyticsService.trackEngagement(item.id, 'product_view', {
        videoTitle: item.title,
        creatorId: item.creator?.id,
        productIds: item.productIds
      });
      onShowProducts(index, item.productIds);
    };

    const handleProductModalClose = () => {
      if (interactionStartTime) {
        const interactionDuration = (Date.now() - interactionStartTime) / 1000;
        AnalyticsService.trackEngagement(item.id, 'product_view_duration', {
          duration: interactionDuration,
          productIds: item.productIds
        });
        setInteractionStartTime(null);
      }
    };

    // Track meaningful engagement
    useEffect(() => {
      let engagementTimer;
      
      if (index === currentVideoIndex && !hasTrackedEngagement) {
        engagementTimer = setTimeout(async () => {
          await trackMeaningfulEngagement(item);
          setHasTrackedEngagement(true);
        }, ENGAGEMENT_THRESHOLD);
      }

      return () => {
        if (engagementTimer) clearTimeout(engagementTimer);
      };
    }, [currentVideoIndex, index, hasTrackedEngagement]);

    const trackMeaningfulEngagement = async (video) => {
      try {
        await AnalyticsService.trackEngagement(video.id, 'meaningful_engagement', {
          videoTitle: video.title,
          creatorId: video.creator?.id,
          tags: video.tags,
          engagementType: 'watch_time',
          duration: ENGAGEMENT_THRESHOLD
        });
      } catch (error) {
        console.error('Error tracking engagement:', error);
      }
    };

    return (
      <View style={styles.videoContainer}>
        {videoLoading && (
          <ActivityIndicator size="large" color="#fff" style={styles.videoLoader} />
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
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />

        <View style={styles.overlay}>
          <View style={styles.creatorInfo}>
            {item.isRecommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>
                  🎯 Recommended
                </Text>
              </View>
            )}
            <Text style={[
              styles.debugInfo,
              { color: item.isRecommended ? '#ffeb3b' : '#fff' }
            ]}>
              #{index} - {item.isRecommended ? 'Recommended' : 'Regular'}
            </Text>
            <Image 
              source={{ 
                uri: item.creator?.profileImage || 'https://your-default-image-url.com'
              }} 
              style={styles.creatorImage}
            />
            <Text style={styles.creatorName}>{item.creator?.name || 'Anonymous'}</Text>
          </View>

          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconWrapper} onPress={handleLikePress}>
              <Icon
                name="heart"
                type="feather"
                color="#e04353"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>{item.likes || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={handleCommentPress}>
              <Icon
                name="message-circle"
                type="feather"
                color="#6aad36"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>{item.comments || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconWrapper} onPress={handleSharePress}>
              <Icon
                name="share-2"
                type="feather"
                color="#669be8"
                size={30}
                containerStyle={styles.icon}
              />
              <Text style={styles.iconText}>Shareeee</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                onMutePress(index);
                AnalyticsService.trackEngagement(item.id, 'sound_toggle', {
                  isMuted: !isMuted
                });
              }}
            >
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
              onPress={handleProductView}
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

  const [viewabilityConfig] = useState({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  });

  // Add tracking for view time
  const viewTimeRef = useRef({});
  
  const onViewableItemsChanged = useCallback(({ changed }) => {
    const now = Date.now();
    
    changed.forEach((change) => {
      const { index, isViewable, item } = change;
      
      if (isViewable) {
        setCurrentVideoIndex(index);
        viewTimeRef.current[item.id] = now;
        
        AnalyticsService.trackEngagement(item.id, 'video_visible', {
          position: index,
          videoTitle: item.title,
          creatorId: item.creator?.id
        });
      } else {
        // Track how long the video was viewed when it becomes invisible
        const startTime = viewTimeRef.current[item.id];
        if (startTime) {
          const viewDuration = (now - startTime) / 1000; // in seconds
          delete viewTimeRef.current[item.id];
          
          AnalyticsService.trackEngagement(item.id, 'video_view_duration', {
            duration: viewDuration,
            position: index
          });
        }
      }
    });
  }, [reels]);

  // Clean up view times when component unmounts
  useEffect(() => {
    return () => {
      const now = Date.now();
      Object.entries(viewTimeRef.current).forEach(([videoId, startTime]) => {
        const viewDuration = (now - startTime) / 1000;
        AnalyticsService.trackEngagement(videoId, 'video_view_duration', {
          duration: viewDuration,
          exitType: 'unmount'
        });
      });
    };
  }, []);

  // Add impression tracking
  useEffect(() => {
    if (reels.length > 0) {
      // Track initial impressions for first visible videos
      const initialVisibleCount = Math.min(3, reels.length);
      for (let i = 0; i < initialVisibleCount; i++) {
        AnalyticsService.trackEngagement(reels[i].id, 'video_impression', {
          position: i,
          loadType: 'initial'
        });
      }
    }
  }, [reels]);

  // Fetch initial reels
  useEffect(() => {
    fetchReels();
  }, []);

  // Fetch recommended reels after every few videos
  useEffect(() => {
    const fetchRecommendationsIfNeeded = async () => {
      if (currentVideoIndex > 0 && currentVideoIndex % 5 === 0) {
        console.log(`Triggering recommendations fetch at index ${currentVideoIndex}`);
        await fetchRecommendedReels();
      }
    };

    fetchRecommendationsIfNeeded();
  }, [currentVideoIndex]);

  const logReelsList = (reels) => {
    console.log('=== CURRENT REELS LIST ===');
    reels.forEach((reel, index) => {
      console.log(`${index}. ${reel.title}`, {
        id: reel.id,
        isRecommended: !!reel.isRecommended,
        creator: reel.creator?.name,
        videoUrl: reel.videoUrl
      });
    });
    console.log('========================');
  };

  const fetchReels = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/content/`);
      
      if (response.data && response.data.content) {
        console.log('=== INITIAL REELS FROM BACKEND ===');
        logReelsList(response.data.content);
        setReels(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      setError('Failed to fetch reels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedReels = async () => {
    try {
      console.log('Fetching recommendations...');
      const response = await axios.get(`${API_URL}/content/recommendations/`, {
        params: {
          user_id: 'test_user'
        }
      });
      
      console.log('Recommendations response:', response.data);

      if (response.data && response.data.content) {
        setReels(prevReels => {
          const newReels = [...prevReels];
          response.data.content.forEach((recommendedVideo, index) => {
            // Ensure unique ID by adding a timestamp and index
            const uniqueVideo = {
              ...recommendedVideo,
              id: `${recommendedVideo.id}-rec-${Date.now()}-${index}`,
              isRecommended: true
            };
            const insertPosition = currentVideoIndex + (index + 1) * 2;
            newReels.splice(insertPosition, 0, uniqueVideo);
          });

          // Log the updated list to verify uniqueness
          console.log('Updated reels list:', newReels.map((reel, index) => ({
            index,
            id: reel.id,
            title: reel.title,
            isRecommended: !!reel.isRecommended
          })));

          return newReels;
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  // Add a function to check for duplicate IDs (for debugging)
  const checkForDuplicateIds = (reels) => {
    const ids = new Set();
    const duplicates = [];
    
    reels.forEach((reel, index) => {
      if (ids.has(reel.id)) {
        duplicates.push({ id: reel.id, index });
      }
      ids.add(reel.id);
    });
    
    if (duplicates.length > 0) {
      console.warn('Duplicate IDs found:', duplicates);
    }
  };

  const handleScroll = useCallback((event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollDepth = (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;
    
    if (scrollDepth % 25 < 1) {
      AnalyticsService.trackEngagement(null, 'scroll_depth', {
        depth: Math.floor(scrollDepth),
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const onShowProducts = useCallback((index, productIds) => {
    setSelectedProductIds(productIds);
    setIsModalVisible(true);
  }, []);

  // Add this to your useEffect that watches reels
  useEffect(() => {
    if (reels.length > 0) {
      checkForDuplicateIds(reels);
      console.log(`Reels updated (total: ${reels.length})`);
      logReelsList(reels);
    }
  }, [reels]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
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
        renderItem={({ item, index }) => (
          <RenderItem
            item={item}
            index={index}
            currentVideoIndex={currentVideoIndex}
            videoRefs={videoRefs}
            isMuted={isMuted}
            onMutePress={(index) => {
              setIsMuted(!isMuted);
              AnalyticsService.trackEngagement(item.id, 'sound_toggle', {
                isMuted: !isMuted
              });
            }}
            onShowProducts={onShowProducts}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <ProductListModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          const currentItem = reels[currentVideoIndex];
          if (currentItem) {
            AnalyticsService.trackEngagement(currentItem.id, 'product_modal_close');
          }
        }}
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
  recommendedBadge: {
    backgroundColor: 'rgba(255, 235, 59, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  recommendedText: {
    color: '#ffeb3b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugInfo: {
    position: 'absolute',
    top: -20,
    left: 0,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 4,
  }
});

export default ReelList;

