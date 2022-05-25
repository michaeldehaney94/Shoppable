import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce' //import api for shipping information
import { Link, useHistory } from 'react-router-dom';
import useStyles from './styles';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    //checkout token for get API data
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                //console.log(token);
                setCheckoutToken(token);

            } catch (error) {
                //console.error(error)
                history.pushState('/') //auto-route back to the original state of Home page when loading fails
            }
        }
        generateToken();

    }, [cart]);

    //go to next step in filling out shipping information
    const nextStep = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
    const backStep = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

    //next button to submit shipping address information
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    //checkout confirmation message
    let Confirmation = () => order.customer ? (
        <>
           <div>
               <Typography variant='h5'>
                   Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}
                </Typography>
               <Divider />
               <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
           </div>
           <br />
           <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ): (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );
    // isFinished ? (
    //     <> 
    //     {/* This section will load for users who did not enter credit card details */}
    //         <div>
    //             <Typography variant='h5'>Thank you for your purchase.</Typography>
    //             <Divider />
    //         </div>
    //         <br />
    //         <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
    //     </>

    // ): 
    

    //timeout function when processing payment is stuck in loading wheel loop
    const timeout = () => {
        setTimeout(() => {
            isFinished(true);
        }, 3000);
    }

    //confirmation error handling
    if (error) {
        Confirmation = () => (
            <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </>
        );  
    }

    const Form = () => (
        activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm 
            shippingData={shippingData} 
            checkoutToken={checkoutToken} 
            nextStep={nextStep} 
            backStep={backStep}  
            onCaptureCheckout={onCaptureCheckout} 
            timeout={timeout} 
        />

    );

    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    {/* stepper creates a step by step form for payment and shipping information input */}
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout;
