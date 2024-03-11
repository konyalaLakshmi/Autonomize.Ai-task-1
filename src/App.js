import {Component} from 'react'
import {FaEdit} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'

import './App.css'

class TodoApp extends Component {
  state = {
    tasks: [],
    newTask: '',
    editingTaskId: null,
  }

  addTask = () => {
    const {newTask, tasks, editingTaskId} = this.state
    if (newTask.trim() === '') {
      return
    }

    const [taskName, taskQuantity] = this.parseTask(newTask)
    let updatedTasks

    if (editingTaskId !== null) {
      updatedTasks = tasks.map(task =>
        task.id === editingTaskId
          ? {...task, text: taskName, count: task.count + 1}
          : task,
      )
    } else {
      const newTaskObject = {
        id: Date.now(),
        text: taskName,
        completed: false,
        count: 0,
      }
      if (taskQuantity > 1) {
        updatedTasks = [
          ...tasks,
          ...Array.from({length: taskQuantity}, (_, index) => ({
            ...newTaskObject,
            id: newTaskObject.id + index,
          })),
        ]
      } else {
        updatedTasks = [...tasks, newTaskObject]
      }
    }

    this.setState({tasks: updatedTasks, newTask: '', editingTaskId: null})
  }

  parseTask = taskString => {
    const parts = taskString.split(' ')
    let taskName = parts.join(' ')
    let taskQuantity = 1
    const lastPart = parts[parts.length - 1]
    const parsedLastPart = parseInt(lastPart, 10)
    if (!Number.isNaN(parsedLastPart)) {
      taskName = parts.slice(0, -1).join(' ')
      taskQuantity = parsedLastPart
    }
    return [taskName, taskQuantity]
  }

  toggleTask = taskId => {
    this.setState(prevState => ({
      tasks: prevState.tasks.map(task =>
        task.id === taskId
          ? {...task, completed: !task.completed, count: task.count + 1}
          : task,
      ),
    }))
  }

  removeTask = taskId => {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(task => task.id !== taskId),
    }))
  }

  editTask = (taskId, newText) => {
    this.setState({newTask: newText, editingTaskId: taskId})
  }

  render() {
    const {tasks, newTask, editingTaskId} = this.state

    return (
      <div className="todo-app">
        <h1>Day Goals!</h1>

        <div>
          <input
            type="text"
            placeholder="Add a todo"
            value={newTask}
            className="input"
            onChange={e => this.setState({newTask: e.target.value})}
          />
          <br />
          <button type="button" className="add-button" onClick={this.addTask}>
            {editingTaskId !== null ? 'Update' : 'Add'}
          </button>
        </div>

        <ul className="ul">
          {tasks.map(task => (
            <li key={task.id}>
              <div className="li">
                <p className="p">{task.text}</p>
                <span className="p">(Updated {task.count} times)</span>
                <FaEdit
                  className="i"
                  onClick={() => this.editTask(task.id, task.text)}
                />
                <AiOutlineClose
                  className="del-i"
                  onClick={() => this.removeTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default TodoApp
