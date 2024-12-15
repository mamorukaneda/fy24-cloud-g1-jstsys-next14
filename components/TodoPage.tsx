import { TodoList } from "@/components/TodoList"
import Logout from './Logout';

export default function TodoPage() {
  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Todoリスト</h1>
      <TodoList />
      <Logout />
    </main>
  )
}