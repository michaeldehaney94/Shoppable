import React from 'react'
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import useStyles from './styles.js';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
    const classes = useStyles();

    return (
        <Card>
            <CardMedia image={item.image.url} alt={item.name} className={classes.media}/>
            <CardContent className={classes.cardContent}>
                <Typography variant="h4">{item.name}</Typography>
                <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" title="addQtyBtn" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}>-</Button> {/*decrement item button*/}
                    <Typography>{item.quantity}</Typography>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}>+</Button> {/*increment item button*/}
                </div>
                <Button variant="contained" type="button" color="secondary" onClick={() => onRemoveFromCart(item.id)}>Remove</Button>
            </CardActions>
        </Card>
    )
}

export default CartItem
