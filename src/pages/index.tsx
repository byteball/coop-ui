import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-14">
      <h1>Hello world</h1>
    </main>
  )
}
