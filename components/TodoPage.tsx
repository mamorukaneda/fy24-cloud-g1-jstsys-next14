"use client"

import { useState } from "react"
import { TodoList } from "@/components/TodoList"
import Logout from './Logout';
import execLambda from "./execLambda";
import { Button } from "@/components/ui/button"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "../amplify/data/resource"


export default function TodoPage() {
  const [text, setText] = useState("")
  const [text2, setText2] = useState("")
  async function writeHelloWorld() {
    setText(await execLambda());
  }
  async function sayHelloWord() {
    const client = generateClient<Schema>()
    const { data } = await client.queries.sayHello({
      name: "mamoru.kaneda"
    })
    setText2(data ?? "")
  }
  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Todoリスト</h1>
      <TodoList />
      <Logout />
      <Button onClick={writeHelloWorld}>execLambda</Button>
      <div>{ text }</div>
      <Button onClick={sayHelloWord}>execLambda</Button>
      <div>{ text2 }</div>
    </main>
  )
}