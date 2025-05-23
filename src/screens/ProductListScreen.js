import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart } from '../store/slices/cartSlice';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
  };

  return (
    <View style={styles.productItem}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Додати до кошика</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProductListScreen = () => {
  const products = useSelector((state) => state.products.items);

  const flatListKey = 'product-list-2-columns';

  return (
    <View style={styles.container}>
      <FlatList
        key={flatListKey}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductItem product={item} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F4F8',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flex: 1,
    margin: 5,
  },
  productImage: {
    width: '90%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  productDescription: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
    height: 35,
    overflow: 'hidden',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 15,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
  },
});

export default ProductListScreen;