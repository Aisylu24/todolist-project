import React, {useCallback, useEffect} from "react";
import {
    addTodolistThunkCreator,
    changeTodolistFilterAC,
    changeTodolistTitleTC, deleteTodolistThunkCreator, fetchTodolistsTC,
    FilterValuesType,
} from "../../state/todolists-reducer";
import {
    addTaskTC,
    removeTaskTC, updateTaskTC,
} from "../../state/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useAppSelector} from "../../app/hooks";
import {Navigate} from "react-router-dom";
import {useDispatch} from "react-redux";

export const TodolistsList: React.FC = () => {
    console.log('list')
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn)

    const dispatch = useDispatch();

    useEffect(()=> {
        if(isLoggedIn) {
            dispatch(fetchTodolistsTC())
        }

    },[])

    const removeTask = useCallback(function (todolistId: string, taskId: string) {
        dispatch(removeTaskTC({todolistId, taskId}));
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title, todolistId));
    }, []);

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(taskId,{status},todolistId));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const action = updateTaskTC(id, {title: newTitle}, todolistId);
        dispatch(action);
    }, []);

    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id:todolistId, filter}));
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const action = deleteTodolistThunkCreator(id);
        dispatch(action);
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const action = changeTodolistTitleTC(id, title);
        dispatch(action);
    }, []);

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistThunkCreator(title);
        dispatch(action);
    }, [dispatch]);

    if(!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                entityStatus={tl.entityStatus}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}