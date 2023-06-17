import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ProductsProps} from '../../routes/Products';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  cardBody: {
    padding: 16,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 14,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  column: {
    flex: 1 / 2,
    flexDirection: 'column',
    padding: 4,
  },
  container: {flex: 1},
  row: {
    alignContent: 'center',
    paddingHorizontal: 8,
  },
});

export default function Products(props: ProductsProps) {
  const [products, setProducts] = React.useState<any>();

  React.useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.log);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.row}
        data={products?.products}
        keyExtractor={product => product.id}
        numColumns={2}
        renderItem={({item: product}) => (
          <View style={styles.column}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('Show', {id: product.id})
              }
              style={styles.card}>
              <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.cardTitle}>
                  {product.title}
                </Text>
                <Text numberOfLines={3} style={styles.cardDescription}>
                  {product.description}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
