import { useState } from "react";
import { Plus } from "lucide-react";

export default function TaskList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask(event) {
    event.preventDefault();
    if (!task.trim()) return;
    setTasks((old) => [...old, { id: Date.now(), text: task.trim(), done: false }]);
    setTask("");
  }

  return (
    <section className="panel">
      <h3>Today's Tasks</h3>
      <form className="task-form" onSubmit={addTask}>
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a task..." />
        <button className="add" type="submit"><Plus size={17} /> Add</button>
      </form>
      {tasks.map((item) => (
        <label className="task-row" key={item.id}>
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => setTasks((old) => old.map((t) => t.id === item.id ? { ...t, done: !t.done } : t))}
          />
          <span className={item.done ? "done" : ""}>{item.text}</span>
          <button type="button" className="remove" onClick={() => setTasks((old) => old.filter((t) => t.id !== item.id))}>×</button>
        </label>
      ))}
    </section>
  );
}