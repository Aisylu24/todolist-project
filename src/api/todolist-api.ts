import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '2f0c4832-37b9-4785-9447-37484d6e72fb'
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/'
    , ...settings
})

export type TodolistType = {
    id:string
    title:string
    addedDate: string
    order: number
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export enum TaskStatuses {
    New=0,
    InProgress=1,
    Completed=2,
    Draft=3
}

export enum TaskPriorities {
    Low=0,
    Middle=1,
    Hi=2,
    Urgently=3,
    Later=4
}



export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateModelTaskType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export type GetTasksResponse = {
    error: string| null
    totalCount: number
    items: TaskType[]
}



export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')

    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title})

    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${id}`)

    },
    updateTodolist({id, title}: {id: string,title: string}) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title})

    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)

    },
    createTask({todolistId,title}:{todolistId: string, title: string}) {
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask({todolistId, taskId}: {todolistId: string, taskId: string}) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateModelTaskType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)

    }
}