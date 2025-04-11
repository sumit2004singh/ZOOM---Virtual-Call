import './App.css';
import {Route, BrowserRouter, Routes } from 'react-router-dom';
import LandingPage from "./pages/landing"
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import History from './pages/history';
import HomeComponenet from './pages/home'

function App() {
  return (
    <>
    
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/auth' element={<Authentication/>}/>
          <Route path='/home's element={<HomeComponenet />} />
          <Route path='/history' elememt={<History/>} />
          <Route path='/:url' element={<VideoMeetComponent/>}/>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    
    </>
  );
}

export default App;