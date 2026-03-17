
import {Route,Routes } from 'react-router-dom'
import UserRoutes from '../src/Routes/UserRoutes'
import InstructorRoutes from '../src/Routes/InstructorRoutes'
import AdminRoutes from '../src/Routes/AdminRoutes'

const App = () => {
  return (
   <Routes>
    <Route path='/*' element={<UserRoutes/>}/>
    <Route path='instructor/*' element={<InstructorRoutes/>}/>
    <Route path='admin/*' element={<AdminRoutes/>}/>
   </Routes>
  )
}

export default App