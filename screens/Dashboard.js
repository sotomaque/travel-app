import React, { useState, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, dummyData, FONTS, icons, images, SIZES } from '../constants';

const isIOS = Platform.OS === 'ios';

const COUNTRIES_ITEM_SIZE = SIZES.width / 3;
const PLACES_ITEM_SIZE = isIOS ? SIZES.width / 1.25 : SIZES.width / 1.2;
const EMPTY_ITEM_SIZE = (SIZES.width - PLACES_ITEM_SIZE) / 2;

const Dashboard = ({ navigation }) => {
  const [countries, setCountries] = useState([
    { id: -1 },
    ...dummyData.countries,
    { id: -2 },
  ]);

  const [places, setPlaces] = useState([
    { id: -1 },
    ...dummyData.countries[0].places,
    { id: -2 },
  ]);

  const countryScrollX = useRef(new Animated.Value(0)).current;
  const placesScrollX = useRef(new Animated.Value(0)).current;

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.base,
          alignItems: 'center',
        }}
      >
        {/* (LEFT) Side Drawer Button */}
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {}}
        >
          <Image
            source={icons.side_drawer}
            resizeMode="contain"
            style={{ width: 25, height: 25, tintColor: COLORS.white }}
          />
        </TouchableOpacity>

        {/* (CENTER) Page Title  */}
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Home</Text>
        </View>

        {/* (RIGHT): Profile */}
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={images.profile_pic}
            style={{ height: 45, width: 45, borderRadius: 30 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCountries = () => {
    return (
      <Animated.FlatList
        data={countries}
        decelerationRate={0}
        horizontal
        keyExtractor={(item) => `${item.id}`}
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={COUNTRIES_ITEM_SIZE}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: countryScrollX,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
          const opacity = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRIES_ITEM_SIZE,
              (index - 1) * COUNTRIES_ITEM_SIZE,
              index * COUNTRIES_ITEM_SIZE,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const mapSize = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRIES_ITEM_SIZE,
              (index - 1) * COUNTRIES_ITEM_SIZE,
              index * COUNTRIES_ITEM_SIZE,
            ],
            outputRange: [25, Platform.OS === 'ios' ? 80 : 60, 25],
            extrapolate: 'clamp',
          });

          const fontSize = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRIES_ITEM_SIZE,
              (index - 1) * COUNTRIES_ITEM_SIZE,
              index * COUNTRIES_ITEM_SIZE,
            ],
            outputRange: [15, 25, 15],
            extrapolate: 'clamp',
          });

          if (index === 0 || index === countries.length - 1) {
            return (
              <View
                style={{
                  width: COUNTRIES_ITEM_SIZE,
                }}
              />
            );
          } else {
            return (
              <Animated.View
                opacity={opacity}
                style={{
                  width: COUNTRIES_ITEM_SIZE,
                  height: 130,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Animated.Image
                  source={item.image}
                  resizeMode="contain"
                  style={{
                    width: mapSize,
                    height: mapSize,
                    tintColor: COLORS.white,
                  }}
                />
                <Animated.Text
                  style={{
                    marginTop: 3,
                    color: COLORS.white,
                    ...FONTS.h1,
                    fontSize: fontSize,
                  }}
                >
                  {item.name}
                </Animated.Text>
              </Animated.View>
            );
          }
        }}
      />
    );
  };

  const renderPlaces = () => {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={places}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{ alignItems: 'center' }}
        snapToAlignment="center"
        snapToInterval={isIOS ? PLACES_ITEM_SIZE + 28 : PLACES_ITEM_SIZE}
        scrollEventThrottle={16}
        decelerationRate={0}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: placesScrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
          const opacity = placesScrollX.interpolate({
            inputRange: [
              (index - 2) * PLACES_ITEM_SIZE,
              (index - 1) * PLACES_ITEM_SIZE,
              index * PLACES_ITEM_SIZE,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          let activeHeight = 0;

          if (isIOS) {
            if (SIZES.height > 800) {
              activeHeight = SIZES.height / 2;
            } else {
              activeHeight = SIZES.height / 1.65;
            }
          } else {
            activeHeight = SIZES.height / 1.6;
          }

          const height = placesScrollX.interpolate({
            inputRange: [
              (index - 2) * PLACES_ITEM_SIZE,
              (index - 1) * PLACES_ITEM_SIZE,
              index * PLACES_ITEM_SIZE,
            ],
            outputRange: [
              SIZES.height / 2.25,
              activeHeight,
              SIZES.height / 2.25,
            ],
            extrapolate: 'clamp',
          });

          if (index === 0 || index === places.length - 1) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          } else {
            return (
              <Animated.View
                opacity={opacity}
                style={{
                  width: PLACES_ITEM_SIZE,
                  height: height,
                  alignItems: 'center',
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <Image
                  source={item.image}
                  resizeMode="cover"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    borderRadius: 20,
                  }}
                />
              </Animated.View>
            );
          }
        }}
      ></Animated.FlatList>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* (TOP): HEADER */}
      {renderHeader()}

      {/* (MAIN): BODY */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: isIOS ? 40 : 0,
        }}
      >
        <View style={{ height: 700 }}>
          {/* Countries */}
          <View>{renderCountries()}</View>

          {/* Places */}
          <View style={{ height: isIOS ? 500 : 450 }}>{renderPlaces()}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
