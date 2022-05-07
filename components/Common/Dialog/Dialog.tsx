import React, { FC, ReactNode, useRef } from 'react';
import style from './Dialog.module.scss';

interface Props {
  type: string;
  children?: ReactNode;
  isSuccessful: boolean;
  onClose: () => void;
  setIsSuccessful: (arg0: boolean) => void;
}

const titleList = {
  add: 'Add Contact',
  delete: 'Delete Contact',
};

const Dialog: FC<Props> = ({
  type,
  onClose,
  children,
  isSuccessful,
  setIsSuccessful,
}): JSX.Element => {
  const wrapperRef = useRef(null);
  const handleCloseDialog = (e: Event) => {
    if (wrapperRef.current === e.target) {
      setIsSuccessful(false);
      onClose();
    }
  };

  if (isSuccessful) {
    setTimeout(() => {
      setIsSuccessful(false);
      onClose();
    }, 3000);
  }

  return (
    <div
      ref={wrapperRef}
      className={style['wrapper']}
      onClick={handleCloseDialog}
    >
      <div className={style['dialog']}>
        {isSuccessful ? (
          <h2>Success!</h2>
        ) : (
          <>
            <h2>{titleList[type]}</h2>
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default Dialog;
