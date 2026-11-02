
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  Check,
  ClipboardList
} from 'lucide-react'

function App() {

  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) || []
    } catch {
      return []
    }
  })

  const [task, setTask] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)

  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function handleSubmit(e) {
    e.preventDefault()

    if (!task.trim()) return

    if (editingId !== null) {
      setTasks(previous =>
        previous.map(item =>
          item.id === editingId
            ? { ...item, title: task.trim() }
            : item
        )
      )
      setEditingId(null)
    } else {
      const newTask = {
        id: Date.now(),
        title: task.trim(),
        completed: false
      }

      setTasks(previous => [...previous, newTask])
    }

    setTask('')
  }

  function toggleTask(id) {
    setTasks(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  // Delete a task
  function deleteTask(id) {
    setTasks(previous =>
      previous.filter(item => item.id !== id)
    )
  }


  function editTask(item) {
    setTask(item.title)
    setEditingId(item.id)
  }

 
  const filteredTasks = tasks.filter(item => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Pending' && !item.completed) ||
      (filter === 'Completed' && item.completed)

    return matchesSearch && matchesFilter
  })

  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(item => item.completed).length
  const pendingTasks = totalTasks - completedTasks

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

     
      <aside className="w-full md:w-64 bg-white p-6 shadow-sm md:min-h-screen">

        <h1 className="text-2xl font-bold text-purple-600">
          TFlow.
        </h1>

        <p className="text-xs text-slate-400 mt-2">
          YOUR PRODUCTIVITY SPACE
        </p>

        <nav className="mt-8 space-y-2">

          <div className="flex items-center gap-3 bg-purple-50 text-purple-700 font-semibold p-3 rounded-lg">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          <div className="flex items-center gap-3 text-slate-500 p-3">
            <ListTodo size={20} />
            My Tasks
          </div>

          <div className="flex items-center gap-3 text-slate-500 p-3">
            <CheckCircle2 size={20} />
            Completed
          </div>

        </nav>

        <div className="hidden md:block mt-16 bg-purple-50 p-4 rounded-xl">
          <h3 className="font-semibold text-purple-700">
            Stay productive!
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Small steps every day lead to big results.
          </p>
        </div>

      </aside>

      
      <main className="flex-1 p-5 md:p-8 min-w-0">

        <header className="mb-8">
          <p className="text-sm text-purple-600 font-semibold">
            YOUR DASHBOARD
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Welcome Back!
          </h2>

          <p className="text-slate-500 mt-2">
            Let's get your tasks organized.
          </p>
        </header>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Total Tasks</p>
            <h2 className="text-3xl font-bold mt-3 text-slate-800">
              {totalTasks}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Pending Tasks</p>
            <h2 className="text-3xl font-bold mt-3 text-orange-500">
              {pendingTasks}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Completed Tasks</p>
            <h2 className="text-3xl font-bold mt-3 text-green-500">
              {completedTasks}
            </h2>
          </div>

        </div>

     
        <section className="bg-white p-6 rounded-xl shadow-sm mt-8">

          <h3 className="text-xl font-bold text-slate-800 mb-4">
            {editingId !== null ? 'Edit Task' : 'Add a New Task'}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="What do you need to do?"
              className="flex-1 min-w-0 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus size={19} />
              {editingId !== null ? 'Update Task' : 'Add Task'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setTask('')
                }}
                className="text-slate-500 px-3"
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        {/* Task List */}
        <section className="bg-white p-6 rounded-xl shadow-sm mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                My Tasks
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage your daily activities
              </p>
            </div>

            
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="outline-none px-2 w-full sm:w-40 text-sm"
              />

              {search && (
                <button onClick={() => setSearch('')}>
                  <X size={16} />
                </button>
              )}
            </div>

          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">

            {['All', 'Pending', 'Completed'].map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}

          </div>

      
          <div className="space-y-3">

            {filteredTasks.length === 0 ? (

              <div className="text-center py-12">

                <ClipboardList
                  size={45}
                  className="mx-auto text-slate-300"
                />

                <h3 className="font-semibold text-slate-600 mt-4">
                  {tasks.length === 0
                    ? 'No tasks yet'
                    : 'No matching tasks'}
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  Add a task or change your search and filters.
                </p>

              </div>

            ) : (

              filteredTasks.map(item => (

                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 border border-slate-100 p-4 rounded-lg hover:bg-slate-50 transition"
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <button
                      onClick={() => toggleTask(item.id)}
                      aria-label={item.completed ? 'Mark as pending' : 'Mark as completed'}
                      className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-300 hover:border-purple-500'
                      }`}
                    >
                      {item.completed && <Check size={15} />}
                    </button>

                    <span
                      className={`break-words ${
                        item.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.title}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 shrink-0">

                    <button
                      onClick={() => editTask(item)}
                      aria-label="Edit task"
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => deleteTask(item.id)}
                      aria-label="Delete task"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          <div className="mt-6 text-sm text-slate-400">
            {completedTasks} of {totalTasks} tasks completed
          </div>

        </section>

      </main>

    </div>
  )
}

export default App;
