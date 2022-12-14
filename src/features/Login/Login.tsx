import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {loginTC} from "./login-reducer";
import {Navigate} from 'react-router-dom'
import {useFormik} from "formik";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}


export const Login = () => {

    const dispatch = useAppDispatch()

    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn)


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
            validate: (values: FormikErrorType) => {
                const errors: FormikErrorType = {}
                if (!values.email) {
                    errors.email = 'Required'
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Invalid email address'
                }
                return errors
            },
        onSubmit: async (values, formikHelpers) => {
           const res = await dispatch(loginTC(values));
           if (loginTC.rejected.match(res)) {
              if (res.payload?.fieldsErrors?.length) {
const error = res.payload?.fieldsErrors[0]
                  formikHelpers.setFieldError(error.field, error.error)
              }
           }

        },
    })

    if(isLoggedIn) {
        return <Navigate to={'/todolist-project'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <TextField
                        label="Email"
                        margin="normal"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && <div style={{color:'red'}}>{formik.errors.email}</div>}
                    <TextField type="password"
                               label="Password"
                               margin="normal"
                               {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && <div style={{color:'red'}}>{formik.errors.password}</div>}
                    <FormControlLabel label={'Remember me'}
                                      control={<Checkbox
                                          {...formik.getFieldProps('rememberMe')}
                                      checked={formik.values.rememberMe}
                                      />}/>
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
            </FormControl>
                </form>
        </Grid>
    </Grid>
}