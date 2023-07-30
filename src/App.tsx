import { useState, useEffect } from 'react'
import './App.scss'
import axios from 'axios';
import tshirtImage from './img/classic-tee.jpg';
import {
  ShoppingCartOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import { CartCard } from './Component';

export interface CartProduct {
  imageURL: string,
  title: string,
  price: number,
  number: number
}

interface Product {
  id: number,
  title: string,
  description: string,
  price: number,
  imageURL: string,
  sizeOptions: SizeOptions[];
}

interface SizeOptions {
  id: number,
  label: string
}

interface CartList {
  [key: string]: CartProduct
}

const App = () => {
  const [cartList, setCardList] = useState<CartList>({})
  const [data, setData] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState<SizeOptions>();
  const [errBox, setErrBox] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const getTotal = (list: CartList): number => {
    let total: number = 0;
    Object.keys(list).forEach(e => {
      total += list[e].number
    })
    return total;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await axios.get<Product>('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product').then(res => {
        const prodData: Product = res.data;
        setData(prodData);
      }).catch(err => console.log(err));
      setLoading(false);
    })()
  }, [])
  if (loading) return null;
  return (
    <div className='wrapper'>
      <div className='header'>
        <div className={expanded ? 'expanded' : 'cart'} onClick={() => setExpanded(!expanded)}>
          {
            window.innerWidth < 600 && (<><ShoppingCartOutlined /> {` ( ${totalNumber} )`}</>) || `My Cart ( ${totalNumber} )`
          }
        </div>
      </div>

      {expanded && (
        <div className="cartBox">
          {totalNumber === 0 ?
            <div className='emptyCart'>Your cart is empty</div> :
            <div className='cardDisplay'>
              {Object.keys(cartList).map(e => {
                return (
                  <CartCard key={e} size={e} sizeOptions={cartList[e]} />
                )
              })}
            </div>}
        </div>
      )}

      {errBox && (
        <div className='errBox'>
          <p>Please select your size.</p>
          <div className='closeBtn' onClick={() => setErrBox(false)}>Understood</div>
        </div>
      )}

      <div className="productionDetail">
        <div className="grid-item picture">
          <img className='pic' src={tshirtImage} alt="t-shirt" />
        </div>
        <div className="grid-item description">
          <div className='title'>
            {data?.title}
          </div>
          <div className="price">
            {`$${data?.price}.00`}
          </div>
          <div className="description">
            {data?.description}
          </div>
          <div className="choiceSection">
            <div className="size">
              SIZE<span className='requireStar'>*</span><span className='current'>{current?.label}</span>
            </div>
            <div className='option'>
              {data?.sizeOptions.map(e => {
                return (
                  <div key={`option-${e.id}`} className={current?.label === e.label ? 'selectedBtn' : 'optionBtn'} onClick={() => {
                    setCurrent(e)
                  }}>
                    {e.label}
                  </div>
                )
              })}
            </div>
            <div className='toCart' onClick={() => {
              if (current) {
                if (cartList[current.label]) {
                  const newCart: CartList = _.cloneDeep(cartList)
                  newCart[current.label].number += 1;
                  setCardList(newCart);
                  setTotalNumber(getTotal(newCart));
                } else {
                  const newCart: CartList = _.cloneDeep(cartList)
                  newCart[current.label] = {
                    imageURL: data!.imageURL,
                    price: data!.price,
                    number: 1,
                    title: data!.title
                  }
                  setCardList(newCart);
                  setTotalNumber(getTotal(newCart));
                }
              } else {
                setErrBox(true)
              }
            }}>
              ADD TO CART
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
