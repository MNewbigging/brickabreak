import './button.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = observer(({ text, onClick, disabled }) => {
  const disabledClass = disabled ? 'disabled' : 'enabled';
  const buttonClasses = ['button', disabledClass];

  return (
    <div className={buttonClasses.join(' ')} onClick={onClick}>
      <div className='button-inner'>{text}</div>
    </div>
  );
});
