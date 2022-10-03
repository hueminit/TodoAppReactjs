import './TodoItem.scss';

import React from "react";

const TodoItem = (props) => {
    return (
      <li className={`todo-item${props.completed ? ' completed' : ''}`}>
        <div className='todo-item__group'>
          <div className='todo-item__select select-btn'></div>
          <span className='todo-item__text'>{props.text}</span>
        </div>
        <div className='todo-item__group todo-item__group--btn'>
          <button className='todo-item__btn todo-item__btn--edit'></button>
          <button className='todo-item__btn todo-item__btn--delete'></button>
        </div>
      </li>
    );
}

export default TodoItem;