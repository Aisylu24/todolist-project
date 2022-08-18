import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '2f0c4832-37b9-4785-9447-37484d6e72fb'
    }
}

export type TodolistType = {
    id:string
    title:string
    addedDate: string
    order: number
}

type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export const todolistAPI = {
    getTodolists() {
        return axios.get<Array<TodolistType>>('https://social-network.samuraijs.com/api/1.1//todo-lists', settings)

    },
    createTodolist(title: string) {
        return axios.post<ResponseType<{item: TodolistType}>>('https://social-network.samuraijs.com/api/1.1//todo-lists', {title}, settings)

    },
    deleteTodolist(id: string) {
        return axios.delete<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1//todo-lists/${id}`, settings)

    },
    updateTodolist(id: string,title: string) {
        return axios.put<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1//todo-lists/${id}`, {title}, settings)

    }

}