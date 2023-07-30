import React, { useState, useEffect } from 'react';
import { CartProduct } from '../../App.tsx';
import styles from './style.module.scss';
interface IProps {
  size: string, sizeOptions: CartProduct
}
export const CartCard: React.FC<IProps> = ({ size, sizeOptions }) => {
  return (
    <div className={styles.wrap}>
      <img src={sizeOptions.imageURL} alt="small t-shirt" />
      <div className={styles.desc}>
        <p>{sizeOptions.title}</p>
        <p>
          {sizeOptions.number} x <span className={styles.price}>{`$${sizeOptions?.price}.00`}</span>
        </p>
        <p>Size: {sizeOptions.number}</p>
      </div>
    </div>
  )
};

