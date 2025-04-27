import React, { useState, useEffect } from "react";

function TodoList() {
        const [todos, setTodos] = useState([]);
        const [completedTodos, setCompletedTodos] = useState([]);
        const [filterUser, setFilterUser] = useState("All");
        const [sortOrder, setSortOrder] = useState("asc");
        const [sortCompletedOrder, setSortCompletedOrder] = useState("asc");
        const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchTodos() {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos");
            const data = await response.json();
            setTodos(data.filter(todo => !todo.completed));
            setCompletedTodos(data.filter(todo => todo.completed));
        }

        async function fetchUsers() {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await response.json();
            setUsers(data);
        }

        fetchTodos();
        fetchUsers();
    }, []);

    const handleFilterChange = (e) => {
        setFilterUser(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleCompletedSortChange = (e) => {
        setSortCompletedOrder(e.target.value);
    };

    function completeTodo(id) {
        const task = todos.find(todo => todo.id === id);
        task.completedAt = new Date();
        setCompletedTodos(prev => [...prev, task]);
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }

    function undoTodo(id) {
        const task = completedTodos.find(todo => todo.id === id);
        setTodos(prev => [...prev, task]);
        setCompletedTodos(prev => prev.filter(todo => todo.id !== id));
    }

    const filteredTodos = todos
        .filter(todo => filterUser === "All" || todo.userId === parseInt(filterUser))
        .sort((a, b) => {
            if (sortOrder === "asc") return a.title.localeCompare(b.title);
            else return b.title.localeCompare(a.title);
        });

    const filteredCompletedTodos = completedTodos
        .filter(todo => filterUser === "All" || todo.userId === parseInt(filterUser))
        .sort((a, b) => {
            if (sortCompletedOrder === "asc") return new Date(a.completedAt) - new Date(b.completedAt);
            else return new Date(b.completedAt) - new Date(a.completedAt);
        });

    return (
        <div className="todo-container">
            <div className="filters">
                <div>
                    <label>Filter by:</label>
                    <select value={filterUser} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Sort:</label>
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="asc">Title (asc)</option>
                        <option value="desc">Title (desc)</option>
                    </select>
                </div>

                <div>
                    <label>Sort:</label>
                    <select value={sortCompletedOrder} onChange={handleCompletedSortChange}>
                        <option value="asc">Date (asc)</option>
                        <option value="desc">Date (desc)</option>
                    </select>
                </div>
            </div>

            <div className="lists">
                <div className="pending">
                    <h2>Pending:</h2>
                    {filteredTodos.map(todo => (
                        <div className="todo-card" key={todo.id}>
                            <p>{todo.title}</p>
                            <button className="complete-btn" onClick={() => completeTodo(todo.id)}>Complete</button>
                        </div>
                    ))}
                </div>

                <div className="completed">
                    <h2>Completed:</h2>
                    {filteredCompletedTodos.map(todo => (
                        <div className="todo-card completed-card" key={todo.id}>
                            <div className='merge'>
                                <p>{todo.title}</p>
                                <p className="completed-date">
                                    Completed on: {todo.completedAt ? new Date(todo.completedAt).toLocaleDateString() : ""}
                                </p>
                            </div>
                            <button className="undo-btn" onClick={() => undoTodo(todo.id)}>Undo</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TodoList;
