import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const handleNetworkError = (dispatch: Dispatch, message: any)=> {
    dispatch(setAppErrorAC({error: message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if(data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    }
    else {
        dispatch(setAppErrorAC({ error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}
