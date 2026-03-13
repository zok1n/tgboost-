import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/executor/Home';
import TaskPage from './pages/executor/TaskPage';
import Balance from './pages/executor/Balance';
import Profile from './pages/executor/Profile';

import CreateTask from './pages/advertiser/CreateTask';
import MyTasks from './pages/advertiser/MyTasks';
import AdvertiserBalance from './pages/advertiser/AdvertiserBalance';

import Admin from './pages/admin/Admin';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<TaskPage />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/advertiser/create" element={<CreateTask />} />
        <Route path="/advertiser/tasks" element={<MyTasks />} />
        <Route path="/advertiser/balance" element={<AdvertiserBalance />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
