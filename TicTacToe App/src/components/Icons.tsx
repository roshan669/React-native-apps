import React from 'react';
import type {PropsWithChildren} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

type IconProps = PropsWithChildren<{
  name: string;
  size?: number;
}>;

const Icons = ({name, size = 50}: IconProps) => {
  switch (name) {
    case 'circle':
      return <Icon name="radio-button-unchecked" size={size} color="yellow" />;
    case 'cross':
      return <Icon name="close" size={size} color="green" />;
    default:
      return <Icon name="edit" size={size} color="white" />;
  }
};

export default Icons;
