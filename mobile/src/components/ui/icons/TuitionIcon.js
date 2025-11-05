import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const TuitionIcon = ({size = 24, color = '#4F46E5'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="6"
      width="18"
      height="13"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M3 10H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M7 15H7.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M11 15H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default TuitionIcon;
