import React from 'react'
import { TextField, Grid } from '@material-ui/core'
import { useFormContext, Controller } from 'react-hook-form'

const FormInput = ({ name, label, required }) => {
    const { control } = useFormContext();

    return (
        <Grid item xs={12} sm={6}>
            <Controller
                as={TextField}
                name={name}
                // 'render' is used as fix to frontend not rendering to screen
                render = {({ field }) => ( 
                    <TextField 
                        {...field}
                        defaultValue=""
                        control={control}
                        label={label}
                        fullWidth
                        required
                    />
                )}
                
            />
        </Grid>
    )
}

export default FormInput;
