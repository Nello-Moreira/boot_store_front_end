import styled from 'styled-components';
import { useContext, useState, useEffect } from 'react';
import CartContext from '../../contexts/CartContext';

export default function Product({ info, total, setTotal }) {
    const { cart, setCart } = useContext(CartContext);
    const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));
    const [productQuantity, setProductQuantity] = useState(1);
    const [pageLoaded, setPageLoaded] = useState(false);
    const { real_id, image_url, name, price } = info;

    let totalPrice = Number(price) * productQuantity;

    useEffect(() => {
        if (!pageLoaded) {
            const product = cart.find((product) => product.real_id === real_id);
            setProductQuantity(product.productQuantity);
            setPageLoaded(true);
        } else {
            cart.forEach((product) => {
                if (product.real_id === real_id) {
                    product.productQuantity = productQuantity;
                }
            });
            cartLocalStorage.forEach((product) => {
                if (product.real_id === real_id) {
                    product.productQuantity = productQuantity;
                }
            });
            localStorage.setItem('cart', JSON.stringify(cartLocalStorage));
        }
    }, [productQuantity]);

    function changeQuantity(change) {
        if (change === '+') {
            setProductQuantity(productQuantity + 1);
            setTotal(total + Number(price));
        }
        if (change === '-' && productQuantity !== 1) {
            setProductQuantity(productQuantity - 1);
            setTotal(total - Number(price));
        }
    }

    function removeItem() {
        const confirm = window.confirm(
            'Você tem certeza que quer remover o produto?'
        );
        if (confirm) {
            const newCart = cart.filter(
                (product) => product.real_id !== real_id
            );
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
            setTotal(total - Number(price));
        }
    }

    return (
        <ProductContainer>
            <ProductImage>
                <img src={image_url} alt=""></img>
            </ProductImage>
            <ProductName>
                <span>{name}</span>
            </ProductName>
            <Price>
                <Counter>
                    <button onClick={() => changeQuantity('-')}>-</button>
                    <span>{productQuantity}</span>
                    <button onClick={() => changeQuantity('+')}>+</button>
                </Counter>
                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                <Remove onClick={removeItem}>Remover</Remove>
            </Price>
        </ProductContainer>
    );
}

const ProductContainer = styled.div`
    display: flex;
    text-align: justify;
    text-justify: inter-word;
    justify-content: space-between;
    align-items: center;
    height: 80px;
`;

const ProductImage = styled.div`
    width: 80px;
    height: 80px;
    background-color: black;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ProductName = styled.div`
    max-width: 200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 5;

    span {
        font-size: 16px;
    }
`;

const Price = styled.div`
    max-width: 135px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    & > span:nth-child(2) {
        font-size: 16px;
        font-weight: bold;
    }
`;

const Counter = styled.div`
    width: 80px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgray;
    background-color: white;

    button {
        height: 20px;
        border: none;
        outline: none;
        background-color: inherit;
        border: 1px solid lightgray;
        cursor: pointer;
    }
`;

const Remove = styled.span`
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;
`;
