"use client"

import { useState } from "react"
import { TodoList } from "@/components/TodoList"
import Logout from './Logout';
import execLambda from "./execLambda";
import { Button } from "@/components/ui/button"

export default function TodoPage() {
  const [text, setText] = useState("")
  async function writeHelloWorld() {
    setText(await execLambda());
  }
  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Todoリスト</h1>
      <TodoList />
      <Logout />
      <Button onClick={writeHelloWorld}>execLambda</Button>
      <div>{ text }</div>
    </main>
  )
}