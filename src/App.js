// App.js 
// Huvudkomponenten för applikationen. Den hanterar routing, autentisering och layout.

// React-router-dom används för att hantera routing i applikationen.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Komponenter som används i olika delar av applikationen.
import TextEditor from './components/TextEditor';


import DocumentView from './components/DocumentView';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register'; 
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import useToken from './components/useToken';

// Styles
import './styles/global.css';
import './styles/navbar.css';
import './styles/form.css';
import './styles/buttons.css';
import './styles/homepage.css';
import './styles/text-editor.css';


function App() {
  // useToken-hooken används för att hämta och sätta användarens autentiseringstoken.
  const { token, setToken } = useToken();

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          <Route
            path="/editor"
            element={
              <PrivateRoute>
                <TextEditor token={token} />
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
