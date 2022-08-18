import {useEffect, useState} from "react";
import axios from "axios";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': ''
    }

}

export const GetTodolist = ()=> {

    const [state, setState]= useState<any>(null)

    useEffect(()=> {
axios.get('https://social-network.samuraijs.com/api/1.1//todo-lists',settings)
    .then((res)=> {
        setState(res.data)
    })
    },[])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = ()=> {

    const [state, setState]= useState<any>(null)

    useEffect(()=> {
        axios.post('https://social-network.samuraijs.com/api/1.1//todo-lists',{title:'hello'}, settings)
            .then((res)=> {
                setState(res.data)
            })
    },[])

    return <div>{JSON.stringify(state)}</div>
}


export const DeleteTodolist = ()=> {

    const [state, setState]= useState<any>(null)

    useEffect(()=> {
        axios.delete('https://social-network.samuraijs.com/api/1.1//todo-lists/todolistID', settings)
            .then((res)=> {
                setState(res.data)
            })
    },[])

    return <div>{JSON.stringify(state)}</div>
}


export const UpdateTodolist = ()=> {

    const [state, setState]= useState<any>(null)

    useEffect(()=> {
        axios.put('https://social-network.samuraijs.com/api/1.1//todo-lists',{title:'hello'}, settings)
            .then((res)=> {
                setState(res.data)
            })
    },[])

    return <div>{JSON.stringify(state)}</div>
}
