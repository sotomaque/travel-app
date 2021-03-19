import React from 'react';
import { View, Image } from 'react-native';

import { icons } from '../constants';

const Rating = ({ containerStyle, rating }) => {
  const starComponents = [];

  for (let i = 0; i < rating; i++) {
    starComponents.push(
      <Image
        key={`full-${i}`}
        resizeMode="cover"
        source={icons.star}
        style={{
          marginLeft: i === 0 ? 0 : 5,
          width: 15,
          height: 15,
        }}
      />
    );
  }

  return (
    <View style={{ flexDirection: 'row', ...containerStyle }}>
      {starComponents}
    </View>
  );
};

export default Rating;
