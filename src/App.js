import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TextEditor from './components/TextEditor';
import DocumentView from './components/DocumentView';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register'; 
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import useToken from './components/useToken';

function App() {
  const { token, setToken } = useToken();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          <Route
            path="/editor"
            element={
              <PrivateRoute>
                <TextEditor token={token} /> {/* Skicka token som prop */}
              </PrivateRoute>
            }
          />

          <Route path="/documents/:id" element={<DocumentView token={token} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
