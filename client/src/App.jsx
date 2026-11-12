import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Clock3, ListTodo, LogOut, Trash2 } from "lucide-react";
import api from "./api";

function Protected({ children }) {
  return localStorage.getItem("task_token") ? children : <Navigate to="/login" replace />;
}
function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page"><section className="auth-card">
    <div className="brand-mark"><ListTodo size={25} /></div><h1>{title}</h1><p className="muted">{subtitle}</p>{children}
  </section></main>;
}
function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const nav = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const { data } = await api.post("/auth/login", { email, password }); localStorage.setItem("task_token", data.token); localStorage.setItem("task_user", JSON.stringify(data.user)); nav("/"); }
    catch (err) { setError(err.response?.data?.message || "Unable to connect to server"); } finally { setBusy(false); }
  }
  return <AuthLayout title="Welcome back" subtitle="Log in to manage your tasks">
    <form onSubmit={submit} className="auth-form"><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required />
      {error && <p className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
    </form><p className="auth-switch">Don't have an account? <Link to="/register">Create account</Link></p>
  </AuthLayout>;
}
function Register() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const nav=useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const {data}=await api.post("/auth/register",{name,email,password}); localStorage.setItem("task_token",data.token); localStorage.setItem("task_user",JSON.stringify(data.user)); nav("/"); }
    catch(err){setError(err.response?.data?.message || "Unable to create account");} finally{setBusy(false);}
  }
  return <AuthLayout title="Create account" subtitle="Start organizing your work today">
    <form onSubmit={submit} className="auth-form"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
      <label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      <label>Password</label><input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" required />
      {error && <p className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
    </form><p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
  </AuthLayout>;
}
function Dashboard() {
  const [tasks,setTasks]=useState([]);
  const [title,setTitle]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const nav=useNavigate();

  async function load(){
    try { const {data}=await api.get("/tasks"); setTasks(data); }
    catch(err){ setError(err.response?.data?.message || "Could not load tasks"); }
  }
  useEffect(()=>{ load(); },[]);
  async function addTask(e){
    e.preventDefault();
    if(!title.trim()) return;
    try { await api.post("/tasks",{title}); setTitle(""); setMessage("Task added successfully!"); setError(""); load(); }
    catch(err){ setError(err.response?.data?.message || "Could not add task"); }
  }
  async function update(id,status){
    try { await api.patch(`/tasks/${id}`,{status}); setMessage("Task status updated successfully!"); setError(""); load(); }
    catch(err){ setError(err.response?.data?.message || "Could not update task"); }
  }
  async function remove(id){
    try { await api.delete(`/tasks/${id}`); setMessage("Task deleted successfully!"); setError(""); load(); }
    catch(err){ setError("Could not delete task"); }
  }
  const groups=[
    {name:"Pending", color:"pending", actions:[["Ongoing","cyan"],["Completed","green"]]},
    {name:"Ongoing", color:"ongoing", actions:[["Pending","gray"],["Completed","green"]]},
    {name:"Completed", color:"completed", actions:[["Pending","gray"],["Ongoing","cyan"]]}
  ];
  return <main className="dashboard">
    <section className="content">
      <h1>Project Task Management</h1>
      <form className="add-form" onSubmit={addTask}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter task title" aria-label="Task title" />
        <button className="primary">Add Task</button>
      </form>
      {message && <div className="success">{message}</div>}
      {error && <div className="error-banner">{error}</div>}
      <div className="columns">
        {groups.map(group=><section className="task-column" key={group.name}>
          <div className={`column-head ${group.color}`}>
            <h2>{group.name} Tasks</h2>
            <span>{tasks.filter(t=>t.status===group.name).length}</span>
          </div>
          <div className="task-list">
            {tasks.filter(t=>t.status===group.name).map(task=><article className="task-card" key={task._id}>
              <div className="task-title">{task.title}</div>
              <p>Status: {task.status}</p>
              <div className="task-actions">
                {group.actions.map(([status,style])=><button key={status} className={`status-btn ${style}-btn`} onClick={()=>update(task._id,status)}>{status==="Completed"?"Complete":status}</button>)}
                <button className="delete-btn" onClick={()=>remove(task._id)}>Delete</button>
              </div>
            </article>)}
            {tasks.filter(t=>t.status===group.name).length===0 && <div className="empty">No tasks</div>}
          </div>
        </section>)}
      </div>
    </section>
  </main>;
}
export default function App(){return <Routes><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/" element={<Protected><Dashboard/></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;}
