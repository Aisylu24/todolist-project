import {Dispatch} from "redux";
import {ResultCode} from "../state/tasks-reducer";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/login-reducer";
import {handleNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    initialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state,action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        },
        setAppErrorAC(state,action: PayloadAction<{error: null | string}>){
           state.error = action.payload.error
        },
        setAppInitializedAC(state,action: PayloadAction<{initialized: boolean}>){
         state.initialized = action.payload.initialized}
        }
})

export const appReducer = slice.reducer
export const {setAppStatusAC,setAppErrorAC,setAppInitializedAC} = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === ResultCode.success) {
            dispatch(setIsLoggedInAC({value: true}))
        }
    })
        .catch((error) => {
            handleNetworkError(dispatch, error)
        })
        .finally(() => {
            dispatch(setAppInitializedAC({initialized: true}));
        })
}