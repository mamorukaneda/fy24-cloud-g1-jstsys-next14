import { revalidatePath } from 'next/cache';

import { AuthGetCurrentUserServer, cookiesClient } from '@/utils/amplify-utils';
import Logout from './Logout';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


async function Todo() {
  const user = await AuthGetCurrentUserServer();
  const { data: todos } = await cookiesClient.models.Todo.list();

  async function addTodo(data: FormData) {
    'use server';
    const title = data.get('title') as string;
    await cookiesClient.models.Todo.create({
      text: title,
      completed: false,
    });
    revalidatePath('/');
  }

  return (
    <>
      <h1>Hello, Amplify </h1>
      {user && <Logout />}
      <form action={addTodo}>
        <Input type="text" name="title" />
        <Button type="submit">Add Todo</Button>
      </form>

      <ul>
        {todos && todos.map((todo) => <li key={todo.id}>{todo.completed}</li>)}
      </ul>
    </>
  );
}

export default Todo;