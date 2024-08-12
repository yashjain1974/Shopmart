import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Icon } from "react-native-elements";
import ProductListModal from "./ProductListModal";

const { width, height } = Dimensions.get("window");

const videos = [
  {
    id: "1",
    uri: "https://res.cloudinary.com/dr1jpom0y/video/upload/v1723139085/lk9tfab7ogctesq7kdhq.mp4",
    title: "Addids X Germany",
    description: "A short sample video with #nature and #peace. Enjoy the beauty of the world in a peaceful environment, where you can relax and feel rejuvenated. This video captures the essence of tranquility and harmony with nature. #calm #serenity",
  },
  {
    id: "2",
    uri: "https://res.cloudinary.com/dr1jpom0y/video/upload/v1723140997/Find_the_beauty_in_everything_cinematography_filmmakers_filmmakersworld_cinematicreels_sonyalpha_cpmawh.mp4",
    title: "Sample Video 2",
    description: "Another short sample video with #cinematography and #art. Discover the art of cinematography and how it can transform the ordinary into the extraordinary. #film #creativity",
  },

  
  {
    id: "3",
    uri: "https://res.cloudinary.com/dr1jpom0y/video/upload/v1723142877/We_re_here_to_remind_you_neco2u.mp4",
    title: "Big Buck Bunny",
    description: "A fun animated video #animation #bunny.",
  },
  {
    id: "4",
    uri: "https://www.w3schools.com/html/movie.mp4",
    title: "Bear and Hare",
    description: "Another fun animated video #animals #cute.",
  },
  {
    id: "5",
    uri: "https://samplelib.com/lib/preview/mp4/sample-1mb.mp4",
    title: "Sample Video 3",
    description: "A short sample video with #samples #fun.",
  },
  // Add more video data here...
];

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
          source={{ uri: item.uri }}
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
              color="#fff"
              size={30}
              containerStyle={styles.icon}
            />
            <Icon
              name="message-circle"
              type="feather"
              color="#fff"
              size={30}
              containerStyle={styles.icon}
            />
            <Icon
              name="share-2"
              type="feather"
              color="#fff"
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
                color="#fff"
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
    color: "#FFD700",
    fontWeight: "bold",
  },
});

export default ReelList;
