import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {todolistsReducer, TodosActionsType} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AppReducerActionsType, appReducer} from "../app/app-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

//types
export type AppActionsType = TodosActionsType | TasksActionsType | AppReducerActionsType
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>


// @ts-ignore
window.store = store;
