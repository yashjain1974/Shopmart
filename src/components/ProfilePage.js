import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import HeaderPage from './Header';
import { useAuth } from '../store/AuthContext';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const contentItems = [
  { id: '1', title: 'Fashion Tips', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAlyD4p1UCIIj8hxAo-3K08DoyBcWPZa3WQQ&s', views: 1200, likes: 300 },
  { id: '2', title: 'Makeup Tutorial', image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/makeup-tutorial-youtube-thumbnail-template-design-f80e0829101db1918fc1abdf566035cc_screen.jpg?ts=1678791676', views: 1500, likes: 450 },
  { id: '3', title: 'Vlog - A Day in My Life', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1SdnXCQ2MvJJC4dU-qoMbDhsqRw2gypIJmg&s', views: 1000, likes: 200 },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const handleLogout = async () => {
    await logout();
    navigation.navigate('Home'); // Or wherever you want to redirect after logout
  };
  console.log(user);
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
        <Button title="Log In" onPress={() => navigation.navigate('Login')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      </View>
    );
  }
  return (
    <>
      <HeaderPage />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar
            rounded
            size="xlarge"
            source={{ uri: 'https://cdn2.vectorstock.com/i/1000x1000/18/11/man-profile-cartoon-vector-19491811.jpg' }}
            containerStyle={styles.avatar}
          />
         <Text style={styles.userName}>{user.name || 'User Name'}</Text>
          <Text style={styles.userBio}>{user.bio || 'Fashion Content Creator'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" type="material" color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Points</Text>
          <AnimatedCircularProgress
            size={130}
            width={18}
            fill={85}
            tintColor="#90adc6"
            backgroundColor="#E0E0E0"
            rotation={0}
            duration={800}
            style={styles.circularProgress}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)} pts
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.sectionContainer}>
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
                  <Icon name="visibility" type="material" color="#ba1a6f" style={styles.icon} size={15} />
                  <Text style={styles.metricText}>{item.views}</Text>
                  <Icon name="thumb-up" type="material" color="#1d2024" style={styles.icon} size={15} />
                  <Text style={styles.metricText}>{item.likes}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentList}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Earnings</Text>
          <Text style={styles.earningsText}>$1,200</Text>
          <Text style={styles.earningsSubtitle}>Current Balance</Text>
          <AnimatedCircularProgress
            size={130}
            width={18}
            fill={50}
            tintColor="#9c6da6"
            backgroundColor="#E0E0E0"
            rotation={0}
            duration={800}
            style={styles.circularProgress}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.earningsGoalText}>50% to next payout</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <AnimatedCircularProgress
            size={130}
            width={18}
            fill={80}
            tintColor="#9c6da6"
            backgroundColor="#E0E0E0"
            rotation={0}
            duration={800}
            style={styles.circularProgress}
          >
            {(fill) => (
              <Text style={styles.pointsText}>
                {Math.round((fill / 100) * 100)}%
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.progressText}>80% to your monthly goal</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Promotions</Text>
          <View style={styles.promotionItem}>
            <Icon name="star" type="material" color="#FFD700" />
            <Text style={styles.promotionText}>Top Creator of the Week</Text>
          </View>
          <View style={styles.promotionItem}>
            <Icon name="thumb-up" type="material" color="#9c6da6" />
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
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    backgroundColor: '#9c6da6',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  avatar: {
    marginBottom: 10,
  },
  icon: {
    marginLeft: 10, // Define margin left here
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    color: '#DDD',
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  circularProgress: {
    marginVertical: 20,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333652',
  },
  contentItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: width * 0.4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  contentImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contentMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  contentList: {
    paddingLeft: 10,
  },
  earningsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#90adc6',
    marginVertical: 10,
  },
  earningsSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  earningsGoalText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
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
  userEmail: {
    fontSize: 14,
    color: '#EEE',
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ba1a6f',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ProfilePage;
