import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import client from '#/shared/api/obyte'
import { bootstrap } from './bootstrap'
import './styles.css'

client.onConnect(bootstrap)

const router = getRouter()

const rootElement = document.getElementById('app')!

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />)
