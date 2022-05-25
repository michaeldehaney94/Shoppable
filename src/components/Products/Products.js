import React from 'react';
import { Grid } from '@material-ui/core';
import Product from './Product/Product';
import useStyles from './styles';


const Products = ({ products, onAddToCart }) => {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justifyContent="center" spacing={4}>
                {products.map((product) => (
                    // xs, sm, md, lg tells the page to adjust content to fit on different device screens
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        {/* the card content component will display each product item data in a card */}
                        {/* onAddToCart function is passed as a prop to be added as a click event on the cart icon button in Product */}
                        <Product product={product} onAddToCart={onAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products;