import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppActionsType, AppThunk} from "./store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";


export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type setTodolistActionType = ReturnType<typeof setTodolistsAC>

export type TodosActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | setTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodosActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            console.log('action', action)
            return action.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE_TODOLIST_ENTITY_STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)

export const setTodolistsAC = (todos: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todos} as const)
export const changeTodolistEntityStatusAC  = (id: string, status: RequestStatusType) => ({type: 'CHANGE_TODOLIST_ENTITY_STATUS', status, id} as const)

// export const fetchTodolistsTC = (): AppThunk => async dispatch => {
//     debugger
//     try {
//         dispatch(setAppStatusAC('loading'))
//         debugger
//        const res = await todolistsAPI.getTodolists()
//        dispatch(setTodolistsAC(res.data))
//        dispatch(setAppStatusAC('succeeded'))
//    } catch (error) {
//        throw error
//    }
// }

export const fetchTodolistsTC = (): AppThunk => dispatch => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
            .catch((error) => {
                dispatch(setAppStatusAC('failed'))
                dispatch(setAppErrorAC(error.messages))
            })
    }

export const deleteTodolistThunkCreator = (id: string) => (dispatch: Dispatch<AppActionsType>) => {  // Dispatch<TodosActionsType>
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id,'loading'))
    todolistsAPI.deleteTodolist(id)
        .then((res) => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((error) => {
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(error.messages))
        })
}

export const addTodolistThunkCreator = (title: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
         dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            })
            .catch((error) => {
                dispatch(setAppStatusAC('failed'))
                dispatch(setAppErrorAC(error.messages))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<AppActionsType>) => {
         dispatch(setAppStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setAppStatusAC('succeeded'))
            })
            .catch((error) => {
                dispatch(setAppStatusAC('failed'))
                dispatch(setAppErrorAC(error.messages))
            })
    }
}
