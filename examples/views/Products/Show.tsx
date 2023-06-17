import React from 'react';
import {
  Animated,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import type {ShowProps} from '../../routes/Products';

const styles = StyleSheet.create({
  carousel: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  container: {flex: 1},
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    marginHorizontal: 4,
  },
  edit: {flexDirection: 'row'},
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  indicator: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
  },
  label: {marginBottom: 4},
  main: {padding: 16, rowGap: 16},
  slider: {backgroundColor: '#000000'},
});

export default function Show(props: ShowProps) {
  const {id, title} = props.route.params;
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [product, setProduct] = React.useState<any>();
  const [productId, setProductId] = React.useState<string | undefined>(
    id?.toString(),
  );
  const {width: windowWidth} = useWindowDimensions();

  React.useEffect(() => {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(console.log);
  }, [productId]);

  React.useEffect(() => {
    props.navigation.setOptions({
      title: product === undefined ? 'No title' : product.title,
    });
  }, [product, props.navigation]);

  React.useEffect(() => {
    if (title !== undefined) {
      fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title}),
      })
        .then(res => res.json())
        .then(setProduct)
        .catch(console.log);
    }
  }, [id, title]);

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.slider}
          horizontal={true}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {useNativeDriver: false},
          )}
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}>
          {product?.images?.map((image: string, index: number) => (
            <View
              key={index}
              style={{width: windowWidth, height: windowWidth * (9 / 16)}}>
              <Image
                resizeMode="contain"
                source={{uri: image}}
                style={styles.image}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.indicator}>
          {product?.images?.map((_: string, index: number) => {
            const width = scrollX.interpolate({
              extrapolate: 'clamp',
              inputRange: [
                windowWidth * (index - 1),
                windowWidth * index,
                windowWidth * (index + 1),
              ],
              outputRange: [8, 16, 8],
            });
            return <Animated.View key={index} style={[styles.dot, {width}]} />;
          })}
        </View>
      </View>
      <View style={styles.main}>
        <Text>{product?.description}</Text>
        <View style={styles.edit}>
          <Button
            onPress={() => props.navigation.navigate('Edit', {id})}
            title="Edit"
          />
        </View>
        <View>
          <Text style={styles.label}>Set Params ID</Text>
          <TextInput
            onChangeText={e => setProductId(e)}
            placeholder="Enter number"
            style={styles.input}
            value={productId}
          />
        </View>
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
