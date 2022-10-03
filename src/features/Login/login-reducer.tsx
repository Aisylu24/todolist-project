import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {authAPI, FieldsErrorsType, LoginParamsType} from "../../api/todolists-api";
import {ResultCode} from "../../state/tasks-reducer";
import {handleNetworkError, handleServerAppError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export type LoginActionsType = ReturnType<typeof setIsLoggedInAC>

export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, {
    rejectValue: {errors: Array<string>, fieldsErrors?: FieldsErrorsType}}>('login/loginTC', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let res = await authAPI.login(data)
        if (res.data.resultCode === ResultCode.success) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true};
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error = e as AxiosError
        handleNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

const slice = createSlice({
    name: 'login',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
            // {...state, isLoggedIn: action.value}
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const loginReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(setIsLoggedInAC({value: false}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleNetworkError(dispatch, error)
        })
}

