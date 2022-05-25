import React, { useState, useEffect } from 'react'
// import Products from './components/Products/Products';
// import NavBar from './components/NavBar/NavBar'
import { commerce } from './lib/commerce'; /* accesses Commercejs backend platform */
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Products, Navbar, Cart, Checkout } from './components';


const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('') //error handling for checkout component

    //get product data
    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    }

    //get cart data
    const fetchCart = async () => {
        const cart = await commerce.cart.retrieve();
        setCart(cart);
    }

    //call Stripe API when user checkout items
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            refreshCart();

        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }

    //add items to shopping cart 
    const handleAddToCart = async (productID, quantity) => {
        const { cart } = await commerce.cart.add(productID, quantity);
        //setCart(response.cart);
        setCart(cart);
    }

    //update shopping cart quantity
    const handleUpdateCartQty = async (productId, quantity) => {
        //quantity is placed in an object, because it is the only thing that will be updated
        const { cart } = await commerce.cart.update(productId, { quantity });
        //setCart(response.cart);
        setCart(cart);
    }

    //remove item from cart
    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    }

    //empty entire cart
    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();

    }, []);
    //console.log(products);
    console.log(cart);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch> {/*Switch inbetween Product and Cart when routing to separate pages */}
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                        
                    <Route exact path="/cart">
                        <Cart 
                            cart={cart} 
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>

                    <Route exact path="/checkout">
                        <Checkout 
                            cart={cart} 
                            order={order} 
                            onCaptureCheckout={handleCaptureCheckout} 
                            error={errorMessage}
                        />
                    </Route>       
                </Switch>
            </div>
        </Router>
    );
}

export default App;
