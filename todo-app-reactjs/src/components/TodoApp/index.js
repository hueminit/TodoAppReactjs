import './TodoApp.scss';

import React from "react";
import TodoCreation from "./TodoCreation";
import TodoItem from './TodoItem';

const TodoApp = () => {
    return (
        <div className="todo-app">
            <TodoCreation/>
        </div>
    );
}

export default TodoApp;