import logo from './kk.png';
import logo2 from './andrew.jpg';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo2} className="App-logo" alt="logo" />
        <p>
          andrew dog.
          don't learn react
        </p>
        <div className=".App-logo">
          <img src={logo} className = "App-logo" alt="logo"/>
        </div>
      </header>

    </div>
  );
}

export default App;
