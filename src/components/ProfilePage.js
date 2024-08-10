import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // Add this import
import HeaderPage from './Header';

const { width } = Dimensions.get('window');

const contentItems = [
  { id: '1', title: 'Fashion Tips', image: 'https://i.imgur.com/7yUvePI.jpg', views: 1200, likes: 300 },
  { id: '2', title: 'Makeup Tutorial', image: 'https://i.imgur.com/VpztXXE.jpg', views: 1500, likes: 450 },
  { id: '3', title: 'Vlog - A Day in My Life', image: 'https://i.imgur.com/3VB1bRk.jpg', views: 1000, likes: 200 },
];

const ProfilePage = () => {
  return (
    <>
      <HeaderPage />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar
            rounded
            size="large"
            source={{ uri: 'https://cdn2.vectorstock.com/i/1000x1000/18/11/man-profile-cartoon-vector-19491811.jpg' }}
            containerStyle={styles.avatar}
          />
          <Text style={styles.userName}>Yash Jain</Text>
          <Text style={styles.userBio}>Fashion Content Creator</Text>
        </View>

        {/* Circular progress bar for points */}
        <View style={styles.pointsContainer}>
          <Text style={styles.sectionTitle}>Your Points</Text>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={85} // 85% progress for example
            tintColor="#8A2BE2"
            backgroundColor="#ddd"
            rotation={0}
            duration={800}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)} pts
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Your Content</Text>
          <FlatList
            data={contentItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.contentItem}>
                <Image source={{ uri: item.image }} style={styles.contentImage} />
                <Text style={styles.contentTitle}>{item.title}</Text>
                <View style={styles.contentMetrics}>
                  <Text style={styles.metricText}>{item.views} Views</Text>
                  <Text style={styles.metricText}>{item.likes} Likes</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.earningsContainer}>
          <Text style={styles.sectionTitle}>Your Earnings</Text>
          <Text style={styles.earningsText}>$1,200</Text>
          <Text style={styles.earningsSubtitle}>Current Balance</Text>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={50} // Adjust based on actual percentage
            tintColor="#8A2BE2"
            backgroundColor="#ddd"
            rotation={0}
            duration={800}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.earningsGoalText}>50% to next payout</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={80} // Adjust based on actual percentage
            tintColor="#8A2BE2"
            backgroundColor="#ddd"
            rotation={0}
            duration={800}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.progressText}>80% to your monthly goal</Text>
        </View>

        <View style={styles.promotionContainer}>
          <Text style={styles.sectionTitle}>Promotions</Text>
          <View style={styles.promotionItem}>
            <Icon name="star" type="material" color="#FFD700" />
            <Text style={styles.promotionText}>Top Creator of the Week</Text>
          </View>
          <View style={styles.promotionItem}>
            <Icon name="thumb-up" type="material" color="#8A2BE2" />
            <Text style={styles.promotionText}>Best Content Engagement</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  profileHeader: {
    backgroundColor: '#BDC3C7',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBio: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  pointsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  contentContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contentItem: {
    marginRight: 15,
    width: 150,
  },
  contentImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  contentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  metricText: {
    fontSize: 12,
    color: '#666',
  },
  earningsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  earningsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  earningsSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
    marginBottom: 10,
  },
  earningsGoalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  promotionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  promotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  promotionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default ProfilePage;
