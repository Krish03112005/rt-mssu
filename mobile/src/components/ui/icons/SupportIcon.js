import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

const SupportIcon = ({size = 24, color = '#4F46E5'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="17" r="0.5" fill={color} stroke={color} />
  </Svg>
);

export default SupportIcon;
