import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {todolistsReducer, TodosActionsType} from './todolists-reducer';
import {combineReducers} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {LoginActionsType, loginReducer} from "../features/Login/login-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "../app/app-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: loginReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

//types
export type AppActionsType = TodosActionsType | TasksActionsType | LoginActionsType
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>


// @ts-ignore
window.store = store;
