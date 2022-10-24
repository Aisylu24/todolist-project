import React, {useCallback, useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TaskType} from '../api/todolists-api'
import {TodolistsList} from "../features/TodolistList/TodolistsList";
import {useAppSelector} from "./hooks";
import {CircularProgress, LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Route, Routes} from 'react-router-dom';
import {initializeAppTC} from "./app-reducer";
import {logoutTC} from "../features/Login/login-reducer";
import {useDispatch} from "react-redux";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    console.log('app')
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.initialized)
    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn)
    const dispatch = useDispatch()

    const logoutHandler = useCallback(()=>{
        dispatch(logoutTC())
    },[])

    useEffect(()=>{
        dispatch(initializeAppTC())
    },[])

    if(!isInitialized) {
        return <CircularProgress/>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={logoutHandler} color="inherit">Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/todolist-project'} element={<TodolistsList/>}/>
                    <Route path={'login'} element={<Login/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;


