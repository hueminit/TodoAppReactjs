import './TodoCreation.scss';

import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from '../TodoItem';

const TodoCreation = () => {
    // npx json-server --watch database.json --port 3001
    const apiUrl = 'http://localhost:3001/todo-list'
    
    const inputRef = useRef();
    const [task, setTask] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    let [completedTaskNumber, setCompletedTaskNumber] = useState(0);

    useEffect(() => {
        axios.get(apiUrl)
            .then((response) => {
                setTasks(response.data);
                setCompletedTaskNumber(response.data.filter(task => task.completed).length);
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    const addNewTask = () => {
        const newTask = {
            // id: tasks[tasks.length - 1].id + 1,
            id: uuidv4(),
            text: task,
            completed: false
        }

        axios({
            method: 'post',
            url: apiUrl,
            data: newTask
        })
        .then((res) => {
            setTask('');
            setTasks([...tasks, newTask]);
            inputRef.current.focus();
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleInput = (e) => {
        setTask(e.target.value);
    }

    const handleCheckComplete = (task) => {
        task.completed = !task.completed;

        const editedTask = {
            id: task.id,
            text: task.text,
            completed: task.completed
        }
        
        axios({
            method: 'put',
            url: `${apiUrl}/${task.id}`,
            data: editedTask
        })
        .then((res) => {
            setTasks([...tasks]);
            setCompletedTaskNumber([...tasks].filter((task) => task.completed).length);
        })
        .catch((err) => {
            console.log(err)
        });

        tasks.every((task) => task.completed) ? setIsSelectedAll(true) : setIsSelectedAll(false);
    }

    const handleDelete = (taskId) => {
        axios({
            method: 'delete',
            url: `${apiUrl}/${taskId}`
        })
        .then((res) => {
            tasks.forEach((task, index) => {
                if(task.id === taskId) {
                    const newTasks = [...tasks];
                    newTasks.splice(index, 1);
                    setTasks([...newTasks]);
                }
            })
            setCompletedTaskNumber([...tasks].filter((task) => task.completed).length);
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleSelectAll = () => {
        setIsSelectedAll(!isSelectedAll);

        tasks.forEach((task) => {
            task.completed = isSelectedAll ?  false : true;
        })

        setTasks([...tasks]);
        setCompletedTaskNumber([...tasks].filter((task) => task.completed).length);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('value: ',inputRef.current.value.trim() )
        if(inputRef.current.value.trim()) {
            addNewTask();
        }
    }

    return (
        <>
            <div className='todo-creation'>
                <form className='todo-creation__form'>
                    <input 
                        value={task}
                        ref={inputRef}
                        onChange={handleInput}
                        name='todoInput' 
                        placeholder='Enter todo item...'
                        className='todo-creation__form__input'
                    />
                    <button className='todo-creation__form__submit' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
            <h3 className='todo-count'>Todos ({tasks.length})</h3>
            <div className='select-section'>
                <div className={`select-section__btn select-btn${isSelectedAll ? ' checked' : ''}`} id='select-btn-all' onClick={handleSelectAll}>
                </div>
                <span className='select-section__number'>Selected ({completedTaskNumber})</span>
            </div>
            <ul className='todo-list'>
                {tasks.map((task) => (
                    <li className={`todo-item${task.completed ? ' completed' : ''}`} key={task.id}>
                        <div 
                            className='todo-item__select select-btn'
                            onClick={() => handleCheckComplete(task)}
                        >
                        </div>
                        <span className='todo-item__text'>{task.text}</span>
                        <span 
                            className='todo-item__delete-btn'
                            onClick={() => handleDelete(task.id)}
                        >
                            &times;
                        </span>
                    </li>
                    // <TodoItem task={task} key={task.id}/>
                ))}
            </ul>
        </>
    );
}

export default TodoCreation;