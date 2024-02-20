import { Route, Routes } from 'react-router-dom';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import { useEffect } from 'react';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Compose from './pages/Compose/Compose';
import Sent from './pages/Sent/Sent';
import Main from './pages/Main/Main';
import Users from './pages/Users/Users';
import ManageTL from './pages/ManageTL/ManageTL';
import Employees from './pages/Employees/Employees';
import Contacts from './pages/Contacts/Contacts';
import Templates from './pages/Templates/Templates';

function App() {

  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route exact path='/' element={<Main />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/_mailer' element={<Home />} />
        <Route exact path='/_compose' element={<Compose />} />
        <Route exact path='/_sent' element={<Sent />} />
        <Route exact path='/_users' element={<Users />} />
        <Route exact path='/_create_teams' element={<ManageTL />} />
        <Route exact path='/_employees_' element={<Employees />} />
        <Route exact path='/_contacts' element={<Contacts />} />
        <Route exact path='/_templates' element={<Templates />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
