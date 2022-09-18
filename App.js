/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const {width, height} = Dimensions.get('screen');

const API_URI =
  'https://api.unsplash.com/photos/?client_id=ab3411e4ac868c2646c0ed488dfd919ef612b04c264f3374c97fff98ed253dc9';

const IMAGE_SIZE = 80;
const SPACING = 10;

const fetchImagesFromUnsplash = async () => {
  const data = await fetch(API_URI);

  const results = await data.json();

  return results;
};

const HomeScreen = ({navigation}) => {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImagesFromUnsplash();

      setData(images);
    };

    fetchImages();
  }, []);

  const topRef = useRef();
  const bottomRef = useRef();

  const scrollToActiveIndex = index => {
    setActiveIndex(index);
    topRef.current.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={topRef}
        data={data}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          setActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Photo', {image: item.urls.regular})
              }>
              <View style={{width, height}}>
                <Image
                  source={{uri: item.urls.regular}}
                  style={[StyleSheet.absoluteFillObject]}
                />
                <View
                  style={{
                    height: 50,
                    padding: '15 0',
                    backgroundColor: '#333',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      marginHorizontal: 10,
                      marginVertical: 15,
                    }}>
                    Author: {item.user.name}
                  </Text>
                  <Text style={{color: '#fff'}}>Image id: {item.id}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <FlatList
        ref={bottomRef}
        data={data}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{position: 'absolute', bottom: IMAGE_SIZE}}
        contentContainerStyle={{paddingHorizontal: SPACING}}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{uri: item.urls.regular}}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? '#fff' : 'transparent',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const PhotoScreen = ({route}) => {
  const {image} = route.params;

  return (
    <View style={{width, height}}>
      <Image source={{uri: image}} style={[StyleSheet.absoluteFillObject]} />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Photo" component={PhotoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
