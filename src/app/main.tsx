import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import '#/shared/api/obyte'
import './styles.css'

const router = getRouter()

const rootElement = document.getElementById('app')!

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />)
