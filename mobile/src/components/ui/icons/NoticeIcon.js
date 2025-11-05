import React from 'react';
import Svg, {Path} from 'react-native-svg';

const NoticeIcon = ({size = 24, color = '#4F46E5'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M10.5 8H5C3.89543 8 3 8.89543 3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M7 12H13M7 16H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default NoticeIcon;
