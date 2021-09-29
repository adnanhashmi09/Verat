import './Styles/main.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SignUp, Login, Dashboard } from './Pages/index';
// import { useSelector } from 'react-redux';

function App() {
  // const loginStatus = useSelector(state => state.login);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <h1>title</h1>
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
