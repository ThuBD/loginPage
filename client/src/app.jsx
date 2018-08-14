import React from 'react';
import ReactDom from 'react-dom';
import LoginFields from './components/loginFields.jsx';
import CSSModules from 'react-css-modules';
import styles from './styles/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowLogin: false,
    };
    this.renderAuthentication = this.renderAuthentication.bind(this);
  }

  renderAuthentication(permission) {
    if (permission === true) {
      this.setState({
        allowLogin: permission
      }, () => {
        console.log('Login sucess from auth.');
      })
    }
  }

  render() {
    return (
      <div>
        <div className="loginPage">
          <LoginFields auth={this.renderAuthentication}/>
        </div>
      </div>
    )
  }
}

App = CSSModules(App, styles);

ReactDom.render(<App />, document.getElementById('loginPlace'));