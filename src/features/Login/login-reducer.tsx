import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {ResultCode} from "../../state/tasks-reducer";
import {handleNetworkError, handleServerAppError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type LoginActionsType = ReturnType<typeof setIsLoggedInAC>

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state,action: PayloadAction<{value: boolean}>){
           state.isLoggedIn = action.payload.value
        // {...state, isLoggedIn: action.value}
        }
    }
})

export const loginReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === ResultCode.success) {
               dispatch(setIsLoggedInAC({value: true}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleNetworkError(dispatch, error)
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(setIsLoggedInAC({value: false}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch(error => {
            handleNetworkError(dispatch, error)
        })
}

