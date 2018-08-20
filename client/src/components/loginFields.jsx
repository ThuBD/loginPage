import React from 'react';
import { ajax } from 'jquery';
import CSSModules from 'react-css-modules';
import styles from '../styles/loginFields.css';

class LoginFields extends React.Component {
  constructor(props) {
    super(props);
    this.submitLogin = this.submitLogin.bind(this);
  }
  // needs to add more security
  submitLogin(e) {
    e.preventDefault();
    const data = {username: e.target.username.value, password: e.target.password.value};
    console.log(data);
    ajax({
      url: 'http://localhost:4809/login',
      method: 'POST',
      data: data,
      dataType: 'json'
    }).then((response) => {
      this.props.auth(response);
    }, (err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div styleName="loginDiv">
        <h1>Log in to AppCounts</h1>
        <form onSubmit={this.submitLogin} method="post" styleName="loginForm" >
          <label>Username or email:</label>
          <input type="text" name="username" id="username"/>
          <label>password:</label>
          <input type="password" name="userpassword" id="password"/>
          <a onClick={this.props.rendsign}>Sign Up</a>
          <button styleName="loginButton">log In</button>
        </form>
      </div>
    )
  }
}

export default CSSModules(LoginFields, styles);