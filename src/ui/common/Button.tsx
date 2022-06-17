import './button.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = observer(({ text, onClick }) => {
  return (
    <div className='button' onClick={onClick}>
      <div className='button-inner'>{text}</div>
    </div>
  );
});
