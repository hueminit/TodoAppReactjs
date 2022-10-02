import './TodoCreation.scss';

import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';

const TodoCreation = () => {
    const inputRef = useRef();
    const apiUrl = 'http://localhost:3001/todo-list'
    const [job, setJob] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/todo-list')
            .then((response) => {
                console.log('response: ', response.data);
                setJobs(response.data);
            }).catch((err) => {
                console.log(err)
            })
    }, [])

    const addNewJob = () => {
        const newJob = {
            id: jobs[jobs.length - 1].id + 1,
            text: job,
            completed: false
        }

        axios({
            method: 'post',
            url: apiUrl,
            data: newJob
        })
        .then((res) => {
            setJob('');
            setJobs([...jobs, newJob]);
            inputRef.current.focus();
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleInput = (e) => {
        if(e.target.value) {
            setJob(e.target.value);
        }
    }

    const handleCheckComplete = (job) => {
        job.completed = !job.completed;

        const editedJob = {
            id: job.id,
            text: job.text,
            completed: job.completed
        }
        
        axios({
            method: 'put',
            url: `${apiUrl}/${job.id}`,
            data: editedJob
        })
        .then((res) => {
            setJobs([...jobs]);
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleDelete = (jobId) => {
        axios({
            method: 'delete',
            url: `${apiUrl}/${jobId}`
        })
        .then((res) => {
            jobs.forEach((job, index) => {
                if(job.id === jobId) {
                    const newJobs = [...jobs];
                    newJobs.splice(index, 1);
                    setJobs([...newJobs]);
                }
            })
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addNewJob();
    }

    return (
        <>
            <div className='todo-creation'>
                <form className='todo-creation__form'>
                    <input 
                        value={job}
                        ref={inputRef}
                        onChange={handleInput}
                        name='todoInput' 
                        placeholder='Enter todo item...'
                        className='todo-creation__form__input'
                    />
                    <button className='todo-creation__form__submit' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
            <h3 className='todo-count'>Todos ({jobs.length})</h3>
            <div className='select-section'>
                <div className='select-section__btn select-btn' id='select-btn-all'>
                </div>
                <span className='select-section__number'>Selected </span>
            </div>
            <ul className='todo-list'>
                {jobs.map((job) => (
                    <li className={`todo-item${job.completed ? ' completed' : ''}`} key={job.id}>
                        <div 
                            className='todo-item__select select-btn'
                            onClick={() => handleCheckComplete(job)}
                        >
                        </div>
                        <span className='todo-item__text'>{job.text}</span>
                        <span 
                            className='todo-item__delete-btn'
                            onClick={() => handleDelete(job.id)}
                        >
                            &times;
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default TodoCreation;