import './App.css';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import { 
  BrowserRouter as Router,
  Routes, 
  Route, 
  Link 
} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
      <ul className="App-header">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <Routes>
            <Route exact path='/signup' element={< Signup />}></Route>
            <Route exact path='/login' element={< Login />}></Route>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
