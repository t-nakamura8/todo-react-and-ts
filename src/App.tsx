import { useState } from 'react'
import './App.css'

type Todo = {
  value: string
  readonly id: number
  checked: boolean
  removed: boolean
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

function App() {

  const [text, setText] = useState('')

  const [todos, setTodos] = useState<Todo[]>([])

  const [filter, setFilter] = useState<Filter>('all');

  const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        // 削除されていないもの全て
        return !todo.removed;
      case 'checked':
        // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleOnEmpty = () => {
    // シャローコピーで事足りる
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos(newTodos);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleOnRemove = (id: number, removed: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handleOnCheck = (id: number, checked: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }));

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handleOnEdit = (id: number, value: string) => {

    const deepCopy = todos.map((todo) => ({...todo}))

    // イミュータブルにする為にディープコピーされた配列に Array.map() を適用
    const newTodos = deepCopy.map((todo) => {
      if(todo.id === id) {
        todo.value = value 
      }
      return todo
    })
    setTodos(newTodos)
  }

  const handleOnSubmit = () => {
    // 何も入力されていなかったらリターン
    if(!text) return

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false
    }

    // イミュータブルな操作でtodosを変更
    setTodos([newTodo, ...todos])

    // inoutをクリア
    setText('')

  }

  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>

      {filter === 'removed' ? (
        <button
          onClick={handleOnEmpty}
          disabled={todos.filter((todo) => todo.removed).length===0}
        >
          ごみ箱を空にする
        </button>
      ) : (
        filter !== 'checked' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleOnSubmit()
            }}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => handleOnChange(e)}
            />
            <input
              type="submit"
              value="追加"
              onSubmit={handleOnSubmit}
            />
          </form>
        )
      )}

      <ul>
        {filteredTodos.map((todo) => {
          return ( 
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={(e) => handleOnCheck(todo.id, todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleOnRemove(todo.id, todo.removed)}>
                {todo.removed ? '復元':'削除'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
