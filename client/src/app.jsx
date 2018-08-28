import React from 'react';
import ReactDom from 'react-dom';
import LoginFields from './components/loginFields.jsx';
import SignupPage from './components/signupPage.jsx';
import AccountPage from './components/accountPage.jsx';
// import CSSModules from 'react-css-modules';
// import styles from './styles/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowLogin: false,
      renderSignup: false,
      renderAccount: false,
      userinfo: {}
    };
    this.renderAuthentication = this.renderAuthentication.bind(this);
    this.gotoSignup = this.gotoSignup.bind(this);
    this.backtoLogin = this.backtoLogin.bind(this);
  }

  renderAuthentication(permission, info) {
    if (permission === true) {
      this.setState({
        allowLogin: permission,
        renderAccount: true,
        userinfo: info
      }, () => {
        console.log('Login sucess from auth.');
      })
    }
  }

  gotoSignup(e) {
    e.preventDefault();
    this.setState({
      renderSignup: true
    }, () => {
      console.log('Redirecting to signup.');
    })
  }

  backtoLogin() {
    this.setState({
      renderSignup: false
    }, () => {
      console.log('Redirecting back to login.');
    })
  }

  render() {
    if (this.state.renderAccount) {
      return (
        <div>
          <AccountPage userinfo={this.state.userinfo}/>
        </div>
      )
    } else if (this.state.renderSignup === true) {
      return (
        <div>
          <SignupPage rendlogin={this.backtoLogin}/>
        </div>
      )
    } else {
      return (
        <div className="loginPage">
          <LoginFields auth={this.renderAuthentication} rendsign={this.gotoSignup}/>
        </div>
      )
    }
  }
}

// App = CSSModules(App, styles);

ReactDom.render(<App />, document.getElementById('loginPlace'));
