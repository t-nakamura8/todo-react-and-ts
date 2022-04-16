import { useState } from 'react'
import './App.css'

type Todo = {
  value: string
  readonly id: number
}

function App() {

  const [text, setText] = useState('')

  const [todos, setTodos] = useState<Todo[]>([])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleOnSubmit = () => {
    // 何も入力されていなかったらリターン
    if(!text) return

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime()
    }

    // イミュータブルな操作でtodosを変更
    setTodos([newTodo, ...todos])

    // inoutをクリア
    setText('')

  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleOnSubmit()
        }}
      >
        <input type="text"
          value={text}
          onChange={(e) => handleOnChange(e)}
        />
        <input
          type="submit"
          value="追加"
          onSubmit={handleOnSubmit}
        />
      </form>

      <ul>
        {todos.map((todo) => {
          return <li key={todo.id}>{todo.value}</li>
        })}
      </ul>
    </div>
  )
}

export default App
