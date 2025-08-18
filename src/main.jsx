import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './router/routes'
import { Provider } from 'react-redux'
import { store } from './feature/app/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   <RouterProvider router={routes} />
  </Provider>
)
