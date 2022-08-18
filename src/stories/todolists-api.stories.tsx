import {useEffect, useState} from "react";
import axios from "axios";
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}



export const GetTodolist = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
       todolistAPI.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistAPI.createTodolist('title')
            .then((res) => {
                setState(res.data.data.item)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {

    const [state, setState] = useState<any>(null)

    let todolistID = 'e0187aa4-a015-4bf5-8f0c-17ec59d94f21'

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const UpdateTodolist = () => {

    const [state, setState] = useState<any>(null)

    let todolistID = 'e0187aa4-a015-4bf5-8f0c-17ec59d94f21'

    useEffect(() => {
        todolistAPI.updateTodolist(todolistID, 'new title')
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
