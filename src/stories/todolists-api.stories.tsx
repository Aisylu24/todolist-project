import {useEffect, useState} from "react";
import {todolistAPI, UpdateModelTaskType} from "../api/todolist-api";

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
    const [title, setTitle] = useState<string>('')

    const createTodolist = () => {
        todolistAPI.createTodolist('title')
            .then((res) => {
                setState(res.data.data.item)
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder={'todo title'} value={title}
               onChange={(e) => {
                   setTitle(e.currentTarget.value)
               }}/>
        <button onClick={createTodolist}>create todolist</button>
    </div>
}


export const DeleteTodolist = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTodo = () => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder={'todolist id'} value={todolistId}
               onChange={(e) => {
                   setTodolistId(e.currentTarget.value)
               }}/>
        <button onClick={deleteTodo}>delete todolist</button>
    </div>
}


export const UpdateTodolist = () => {

    const [state, setState] = useState<any>(null)
    const [id, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const updateTodolist = () => {
        todolistAPI.updateTodolist({id, title})
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>
        <div>{JSON.stringify(state)}</div>
        <input placeholder={'todo title'} value={title}
               onChange={(e) => {
                   setTitle(e.currentTarget.value)
               }}/>
        <input placeholder={'todo id'} value={id}
               onChange={(e) => {
                   setTodolistId(e.currentTarget.value)
               }}/>
        <button onClick={updateTodolist}>update todolist</button>
    </div>
}

export const GetTasks = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<any>(null)

    const getTasks = () => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data.items)
            })
    }

    return <div>
        <div>  {JSON.stringify(state)} </div>
        <input placeholder={'todolist id'} value={todolistId}
               onChange={(e) => {
                   setTodolistId(e.currentTarget.value)
               }}/>
        <button onClick={getTasks}>get tasks</button>
    </div>
}


export const DeleteTask = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')


    const deleteTask = () => {
        todolistAPI.deleteTask({todolistId, taskId})
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <input placeholder={'todolist id'} value={todolistId}
               onChange={(e) => {
                   setTodolistId(e.currentTarget.value)
               }}/>
        <input placeholder={'task id'} value={taskId}
               onChange={(e) => {
                   setTaskId(e.currentTarget.value)
               }}/>
        <button onClick={deleteTask}>delete task</button>
    </div>
}


export const CreateTask = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const createTask = () => {
        todolistAPI.createTask({todolistId, title})
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <input placeholder={'todolist id'} value={todolistId}
               onChange={(e) => {
                   setTodolistId(e.currentTarget.value)
               }}/>
        <input placeholder={'task title'} value={title}
               onChange={(e) => {
                  setTitle(e.currentTarget.value)
               }}/>
        <button onClick={createTask}>create task</button>
    </div>
}

export const UpdateTask = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [model, setModel] = useState<UpdateModelTaskType>({
        title: '',
        description: '',
        status: 0,
        priority: 0,
        startDate: '',
        deadline: ''
    })

    const updateTask = () => {
        todolistAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                setState(res.data.data)
            })
    }

    return <div>
      <div>{JSON.stringify(state)}</div>
        <div>
        <input placeholder={'todolist id'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
        <input placeholder={'task id'} value={taskId} onChange={(e) => {setTaskId(e.currentTarget.value)}}/>
        <input placeholder={'task title'} value={model.title} onChange={(e) => {setModel({...model, title: e.currentTarget.value})}}/>
            <input placeholder={'task description'} value={model.description} onChange={(e) => {setModel({...model, description: e.currentTarget.value})}}/>
       <div>   task status
        <input placeholder={'task status'} type='number' value={model.status} onChange={(e) => {setModel({...model, status: +e.currentTarget.value})}}/>
        </div>


        </div>
        <button onClick={updateTask}>update task</button>
    </div>
}