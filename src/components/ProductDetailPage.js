import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import HeaderPage from './Header';
import { useCart } from '../store/CartContext';
import ConfirmationModal from './Cart/ConfirmationModal';
const { width } = Dimensions.get('window');

const productImages = [
  { id: '1', image: 'https://img.tatacliq.com/images/i7/1348Wx2000H/MP000000008944470_1348Wx2000H_202102281843001.jpeg' },
  { id: '2', image: 'https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=' },
  { id: '3', image: 'https://i.imgur.com/3VB1bRk.jpg' },
  { id: '4', image: 'https://i.imgur.com/QD1WEz2.jpg' },
  { id: '5', image: 'https://i.imgur.com/vB5o4CN.jpg' },
];

const recommendedItems = [
  { id: '1', name: 'Gucci White Pants', price: '$1,250', image: 'https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/product/item_22_kv.jpg?240711' },
  { id: '2', name: 'Gucci Purse', price: '$2,550', image: 'https://5.imimg.com/data5/LM/NU/MY-36086933/men-sunglasses.jpg' },
];

const ProductDetailPage = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params;
  const { addToCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const renderProductImage = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.carouselImage} />
  );

  const renderRecommendedItem = ({ item }) => (
    <TouchableOpacity style={styles.recommendedItem}>
      <Image source={{ uri: item.image }} style={styles.recommendedImage} />
      <Text style={styles.recommendedName}>{item.name}</Text>
      <Text style={styles.recommendedPrice}>{item.price}</Text>
    </TouchableOpacity>
  );
  const handleAddToCart = () => {
    addToCart(product);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCheckout = () => {
    setModalVisible(false);
    navigation.navigate('ShoppingCart');
  };
  return (
    <>
      
      <ScrollView style={styles.container}>
        <View style={styles.headerIcons}>
          <Icon name="arrow-back" type="material" onPress={() => navigation.goBack()} />
          <View style={styles.headerRightIcons}>
            <Icon name="favorite-border" type="material" />
            <Icon name="share" type="material" style={styles.iconMargin} />
          </View>
        </View>
       
        <FlatList
          data={productImages}
          renderItem={renderProductImage}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />
 
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productPrice}>$ {product.price}</Text>
          <Text style={styles.productColor}>Color: {product.color}</Text>

          <View style={styles.colorOptions}>
            <View style={[styles.colorCircle, { backgroundColor: '#90adc6' }]} />
            <View style={[styles.colorCircle, { backgroundColor: '#e9eaec' }]} />
            <View style={[styles.colorCircle, { backgroundColor: '#333652' }]} />
          </View>
          <TouchableOpacity
        style={styles.contentCreatorButton}
        onPress={() => navigation.navigate('ContentUpload')}
      >
            <Text style={styles.contentCreatorText}>Create Content & Earn Perks</Text>
            <Text style={styles.contentCreatorSubText}>Earn points or e-wallet cash for contributing content</Text>
          </TouchableOpacity>

          <View style={styles.productDetailsContainer}>
            <Text style={styles.productDetailsTitle}>Product Details</Text>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Horsebit zipped track jacket</Text>
            </View>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Classic collar</Text>
            </View>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Chest patch pocket</Text>
            </View>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Long sleeves</Text>
            </View>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Front zip closure</Text>
            </View>
            <View style={styles.productDetailItemContainer}>
              <Icon name="check" type="feather" color="#8A2BE2" size={16} />
              <Text style={styles.productDetailItem}>Two welt pockets on the sides</Text>
            </View>

            <Text style={styles.productDetailsTitle}>Composition</Text>
            <Text style={styles.productDetailItem}>Outer Material: Cotton 100%, Calf Leather 100%</Text>
            <Text style={styles.productDetailItem}>Lining: Polyester 100%</Text>

            <Text style={styles.productDetailsTitle}>Size and Fit</Text>
            <Text style={styles.productDetailItem}>Fits true to size. Take your normal size</Text>
            <Text style={styles.productDetailItem}>Mid-weight, slightly stretchy fabric</Text>
            <Text style={styles.productDetailItem}>The model is wearing a size larger</Text>
          </View>

          <View style={styles.recommendedContainer}>
            <Text style={styles.recommendedTitle}>Wear it with</Text>
            <FlatList
              data={recommendedItems}
              renderItem={renderRecommendedItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          
        </View>
      </ScrollView>
      <View style={styles.footer}>
      <Button title="Add to Cart" onPress={handleAddToCart} buttonStyle={styles.addToCartFooterButton}
          containerStyle={styles.addToCartFooterContainer}/>
      
      <ConfirmationModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onCheckout={handleCheckout}
/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 50,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerRightIcons: {
    flexDirection: 'row',
  },
  iconMargin: {
    marginLeft: 20,
  },
  carousel: {
    height: 300,
    marginBottom: 20,
  },
  carouselImage: {
    width: width,
    height: 300,
    resizeMode: 'contain',
    marginTop: 10,
  },
  productInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    elevation: 5,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9c6da6',
    marginBottom: 10,
  },
  productColor: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  addToCartButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 25,
    paddingVertical: 12,
  },
  addToCartContainer: {
    marginBottom: 20,
  },
  productDetailsContainer: {
    marginTop: 20,
  },
  productDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  productDetailItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productDetailItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    lineHeight: 22,
  },
  sizeGuideButton: {
    backgroundColor: '#fff',
    color: '#8A2BE2',
    borderColor: '#8A2BE2',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sizeGuideContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendedItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  recommendedImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginBottom: 0,
  },
  recommendedName: {
    fontSize: 14,
    color: '#333',
  },
  recommendedPrice: {
    fontSize: 14,
    color: '#9c6da6',
    fontWeight: 'bold',
  },
  contentCreatorButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 10,
  },
  contentCreatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9c6da6',
  },
  contentCreatorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 10,
  },
  addToCartFooterButton: {
    backgroundColor: '#9c6da6',
    borderRadius: 25,
    paddingVertical: 12,
  },
  addToCartFooterContainer: {
    width: '100%',
  },
});

export default ProductDetailPage;
