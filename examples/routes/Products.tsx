import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import Products from '../views/Products';
import Edit from '../views/Products/Edit';
import Show from '../views/Products/Show';

export type ProductsStackParamList = {
  Edit: {
    id?: number;
  };
  Index: undefined;
  Show: {
    id?: number;
    title?: string;
  };
};

export type EditProps = NativeStackScreenProps<ProductsStackParamList, 'Edit'>;
export type ProductsProps = NativeStackScreenProps<
  ProductsStackParamList,
  'Index'
>;
export type ShowProps = StackScreenProps<ProductsStackParamList, 'Show'>;

const ProductsStack = createStackNavigator<ProductsStackParamList>();

export default () => (
  <ProductsStack.Navigator initialRouteName="Index">
    <ProductsStack.Screen
      component={Edit}
      initialParams={{id: undefined}}
      name="Edit"
      options={{title: 'Edit'}}
    />
    <ProductsStack.Screen
      component={Products}
      name="Index"
      options={{title: 'Products'}}
    />
    <ProductsStack.Screen
      component={Show}
      initialParams={{id: undefined}}
      name="Show"
    />
  </ProductsStack.Navigator>
);
