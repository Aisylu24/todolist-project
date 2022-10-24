import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {fetchTasksTC, ResultCode} from "./tasks-reducer";
import {handleServerAppError, handleNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}


const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{id: string}>) {
           const index = state.findIndex(tl=> tl.id === action.payload.id)
            if(index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{id: string, title: string }>) {
            const index = state.findIndex(tl=> tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            const index = state.findIndex(tl=> tl.id === action.payload.id)
            state[index].filter= action.payload.filter
        },
        setTodolistsAC(state, action: PayloadAction<{todos: Array<TodolistType>}>) {
            return action.payload.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            const index = state.findIndex(tl=> tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC
} = slice.actions

export const fetchTodolistsTC = () => (dispatch: any) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todos: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data
        }).then((todos) => {
        todos.forEach((tl) => {
            dispatch(fetchTasksTC(tl.id))
        })
    })
        .catch((error) => {
            dispatch(setAppStatusAC({status: 'failed'}))
            dispatch(setAppErrorAC(error.messages))
        })
}

export const deleteTodolistThunkCreator = (id: string) => (dispatch: Dispatch) => {  // Dispatch<TodosActionsType>
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id, status:'loading'}))
    todolistsAPI.deleteTodolist(id)
        .then((res) => {
            dispatch(removeTodolistAC({id}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(changeTodolistEntityStatusAC({id, status:'succeeded'}))
        })
        .catch((error) => {
            dispatch(setAppStatusAC({status: 'failed'}))
            dispatch(setAppErrorAC(error.messages))
            dispatch(changeTodolistEntityStatusAC({id, status:'failed'}))
        })
}

export const addTodolistThunkCreator = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.success) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(dispatch, res.data)
                }
            })
            .catch((error) => {
                handleNetworkError(dispatch, error)
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id,title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch((error) => {
                dispatch(setAppStatusAC({status: 'failed'}))
                dispatch(setAppErrorAC({error: error.messages}))
            })
    }
}
