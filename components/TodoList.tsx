"use client"

import { useState, useEffect } from "react"
import { TodoItem } from "./TodoItem"
import { type todoType } from "../types/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();
//type todoType = Schema['Todo']['type'];

export function TodoList() {
  const [todos, setTodos] = useState<todoType[]>([]);
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ( { items  } ) => {
        setTodos([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const addTodo = async () => {
    await client.models.Todo.create({
      text: newTodo,
      completed: false,
    });
  };

  const updateTodo = async (todo: todoType) => {
    await client.models.Todo.update({
      id: todo.id, 
      text: todo.text, 
      completed: todo.completed
    });
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id 
      ? (() => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        updateTodo(updatedTodo);
        return updatedTodo;
      })()
      : todo
    ))
  }

  const deleteTodo = (id: string) => {
    client.models.Todo.delete({ id });
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいタスクを入力..."
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo}>追加</Button>
      </div>
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </div>
  )
}

