import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Platform,
  Animated,
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { HeaderBar, Rating, TextButton, TextIconButton } from '../components';
import { COLORS, SIZES, FONTS, icons } from '../constants';

import { MapStyle } from '../styles';

const Place = ({ navigation, route }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [allowDragging, setAllowDragging] = useState(true);
  const _draggedValue = useRef(new Animated.Value(0)).current;

  let _panel = useRef(null);

  useEffect(() => {
    const { selectedPlace } = route.params;
    setSelectedPlace(selectedPlace);

    // listener
    _draggedValue.addListener((valObj) => {
      if (valObj.value > SIZES.height) {
        setAllowDragging(false);
      }
    });

    // cleanup
    return () => {
      _draggedValue.removeAllListeners();
    };
  }, []);

  const renderPlace = () => {
    return (
      <ImageBackground
        source={selectedPlace?.image}
        style={{ width: '100%', height: '100%' }}
      >
        <HeaderBar
          title=""
          leftOnPress={() => navigation.goBack()}
          right={false}
          containerStyle={{
            marginTop: SIZES.padding * 2,
          }}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: SIZES.padding,
            justifyContent: 'flex-end',
            marginBottom: 100,
          }}
        >
          {/* Name */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: COLORS.white, ...FONTS.largeTitle }}>
              {selectedPlace?.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ marginRight: 5, color: COLORS.white, ...FONTS.h3 }}
              >
                {selectedPlace?.rate}
              </Text>
              <Image source={icons.star} style={{ width: 20, height: 20 }} />
            </View>
          </View>

          {/* Description */}
          <Text
            style={{
              marginTop: SIZES.base,
              color: COLORS.white,
              ...FONTS.body3,
            }}
          >
            {selectedPlace?.description}
          </Text>

          {/* Text Icon Button */}
          <TextIconButton
            onPress={() => {}}
            label="Book a flight"
            icon={icons.aeroplane}
            customContainerStyle={{
              marginTop: SIZES.base,
            }}
          />
        </View>
      </ImageBackground>
    );
  };

  const renderMap = () => {
    return (
      <SlidingUpPanel
        ref={(c) => (_panel = c)}
        draggableRange={{
          top: SIZES.height + 120,
          bottom: 120,
        }}
        showBackdrop={false}
        snappingPoints={[SIZES.height + 150]}
        height={SIZES.height + 150}
        friction={0.7}
        allowDragging={allowDragging}
        animatedValue={_draggedValue}
        onBottomReached={() => setAllowDragging(true)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          {/* Header */}
          <View
            style={{
              height: 120,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={icons.up_arrow}
              style={{ width: 20, height: 20, tintColor: COLORS.white }}
            />
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
              Swipe for Details
            </Text>
          </View>

          {/* Content */}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapView
              style={{
                width: '100%',
                height: '100%',
              }}
              customMapStyle={MapStyle}
              provider={PROVIDER_GOOGLE}
              initialRegion={selectedPlace?.mapInitialRegion}
              onPress={() => setSelectedHotel(null)}
            >
              {selectedPlace?.hotels.map((hotel, index) => (
                <Marker
                  key={index}
                  coordinate={hotel.latlng}
                  identifier={hotel.id}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedHotel(hotel);
                  }}
                >
                  <Image
                    source={
                      selectedHotel?.id === hotel?.id
                        ? icons.bed_on
                        : icons.bed_off
                    }
                    resizeMode="contain"
                    style={{ width: 50, height: 50 }}
                  />
                </Marker>
              ))}
            </MapView>

            {/* Header  */}
            <HeaderBar
              title={selectedPlace?.name}
              leftOnPress={() => _panel.hide()}
              right={true}
              containerStyle={{
                position: 'absolute',
                top: SIZES.padding * 2,
              }}
            />

            {/* Hotel Details */}
            {selectedHotel && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                  padding: SIZES.padding,
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h1 }}>
                  Hotels in {selectedPlace?.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: SIZES.radius,
                    padding: SIZES.radius,
                    borderRadius: 15,
                    backgroundColor: COLORS.transparentBlack1,
                  }}
                >
                  <Image
                    source={selectedHotel?.image}
                    resizeMode="cover"
                    style={{ width: 90, height: 120, borderRadius: 15 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      marginLeft: SIZES.radius,
                      justifyContent: 'center',
                    }}
                  >
                    {/* Hotel Name */}
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                      {selectedHotel?.name}
                    </Text>
                    {/* Hotel Rating */}
                    <Rating
                      rating={selectedHotel?.rate}
                      containerStyle={{ marginTop: SIZES.base }}
                    />
                    {/* Details Button + Price */}
                    <View
                      style={{ flexDirection: 'row', marginTop: SIZES.base }}
                    >
                      <TextButton
                        label="Details"
                        customLabelStyle={{ ...FONTS.h3 }}
                        customContainerStyle={{
                          marginTop: SIZES.base,
                          height: 45,
                          width: 100,
                        }}
                        onPress={() => {}}
                      />

                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.lightGray,
                            ...FONTS.body5,
                            fontSize:
                              Platform.OS === 'ios' ? SIZES.body4 : SIZES.body5,
                          }}
                        >
                          {selectedHotel?.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </SlidingUpPanel>
    );
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {renderPlace()}
      {renderMap()}
    </View>
  );
};

export default Place;
