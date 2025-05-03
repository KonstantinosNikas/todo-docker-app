import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const API = 'http://localhost:4000';


  useEffect(() => {
    axios.get(`${API}/todos`).then(res => setTodos(res.data));
  }, []);

  const addTodo = () => {
    axios.post(`${API}/todos`, { text }).then(() => {
      setTodos([{ id: Math.random(), text }, ...todos]);
      setText('');
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`${API}/todos/${id}`).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 To-Do List</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a task" />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text} <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

