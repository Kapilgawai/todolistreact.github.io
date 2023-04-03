import React, { useState, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => setTodos(json))
      .catch((error) => console.log(error));
  }, []);

  function addTodoItem(newItem) {
    setTodos([...todos, newItem]);
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.log(error));
  }

  function updateTodoItem(id, updatedItem) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedItem),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.log(error));

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedItem } : todo
    );
    setTodos(updatedTodos);
  }

  function deleteTodoItem(id) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.log(error));

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  function handleCheck(id) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  }

  function handleEdit(id) {
    setIsEditingId(id);
    const todoToUpdate = todos.find((todo) => todo.id === id);
    setNewTitle(todoToUpdate.title);
  }

  function handleUpdate(event) {
    event.preventDefault();
    const updatedItem = { title: newTitle };
    updateTodoItem(isEditingId, updatedItem);
    setIsEditingId(null);
    setNewTitle('');
  }

  function handleCancel() {
    setIsEditingId(null);
    setNewTitle('');
  }

  const [isEditingId, setIsEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  return (
    <div>
      <h1>Todo List</h1>
      <AddTodoItem onAdd={addTodoItem} />
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onCheck={handleCheck}
            onDelete={deleteTodoItem}
            onEdit={handleEdit}
            onUpdate={updateTodoItem}
            isEditing={isEditingId === todo.id}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onCancel={handleCancel}
            onSubmit={handleUpdate}
          />
        ))}
      </ul>
    </div>
  );
}
function AddTodoItem({ onAdd }) {
    const [title, setTitle] = useState('');
  
    function handleSubmit(event) {
      event.preventDefault();
      if (title.trim()) {
        const newTodo = { title, completed: false };
        onAdd(newTodo);
        setTitle('');
      }
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a new todo item"
        />
        <button type="submit">Add</button>
      </form>
    );
  }
  function TodoItem({
    todo,
    onCheck,
    onDelete,
    onEdit,
    onUpdate,
    isEditing,
    newTitle,
    setNewTitle,
    onCancel,
    onSubmit,
  }) {
    return (
      <li>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onCheck(todo.id)}
        />
        {isEditing ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Enter a new title"
            />
            <button type="submit">Update</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <span>{todo.title}</span>
            <button type="button" onClick={() => onEdit(todo.id)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </>
        )}
      </li>
    );
  }
  export default TodoList;