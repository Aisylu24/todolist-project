import {TasksStateType} from '../app/App';
import {addTodolistAC, changeTodolistEntityStatusAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleNetworkError, handleServerAppError} from "../utils/error-utils";


export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {

    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)

    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks: res.data.items, todolistId}

})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {

    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)

    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolistId: param.todolistId, taskId: param.taskId}

})


export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.success) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
            } else {
                dispatch(setAppErrorAC({error: res.data.messages.length ? res.data.messages[0] : 'Some error occurred'}))
                dispatch(setAppStatusAC({status: 'failed'}))
                dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'failed'}))
            }
        })
        .catch((error) => {
            dispatch(setAppErrorAC(error.messages))
            dispatch(setAppStatusAC({status: 'failed'}))
            dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'failed'}))
        })
}


export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        const apiModel: UpdateTaskModelType = {
            deadline: task!.deadline,
            description: task!.description,
            priority: task!.priority,
            startDate: task!.startDate,
            title: task!.title,
            status: task!.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId, domainModel, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(dispatch, res.data);
                }
            })
            .catch((error) => {
                handleNetworkError(dispatch, error);
            })
    }

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todos.forEach(tl => {
                state[tl.id] = []
            })
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        });
    }
})

export const tasksReducer = slice.reducer
export const {
    addTaskAC,
    updateTaskAC,
} = slice.actions


export enum ResultCode {
    success = 0,
    error = 1,
    captcha = 10
}


export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}