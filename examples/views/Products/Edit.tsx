import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import type {EditProps} from '../../routes/Products';

const styles = StyleSheet.create({
  container: {flex: 1},
  input: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  label: {marginBottom: 4},
  main: {padding: 16, rowGap: 16},
});

export default function Edit(props: EditProps) {
  const {id} = props.route.params;
  const [product, setProduct] = React.useState<any>();

  React.useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(console.log);
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View>
          <Text style={styles.label}>Title</Text>
          <TextInput
            onChangeText={e => setProduct({...product, title: e})}
            style={styles.input}
            value={product?.title}
          />
        </View>
        <Button
          onPress={() => {
            props.navigation.navigate({
              merge: true,
              name: 'Show',
              params: {title: product?.title},
            });
          }}
          title="Save"
        />
      </View>
    </View>
  );
}

// {
//   "brand": "Apple",
//   "category": "smartphones",
//   "discountPercentage": 17.94,
//   "images": ["https://i.dummyjson.com/data/products/2/1.jpg", "https://i.dummyjson.com/data/products/2/2.jpg", "https://i.dummyjson.com/data/products/2/3.jpg", "https://i.dummyjson.com/data/products/2/thumbnail.jpg"],
//   "price": 899,
//   "rating": 4.44,
//   "stock": 34,
//   "thumbnail": "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
// }
