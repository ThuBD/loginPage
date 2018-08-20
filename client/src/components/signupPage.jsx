import React from 'react';
import { ajax } from 'jquery';
import CSSModules from 'react-css-modules';
import styles from '../styles/signupPage.css';

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
  }

  signupNewUser(e) {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      password2: e.target.confirmpw.value,
      email: e.target.email.value
    }
    ajax({
      url: 'http://localhost:4809/signup/newuser',
      method: 'POST',
      data: data,
      dataType: 'json'
    })
  }

  checkUsernameAvailability() {

  }

  checkPasswordMatch() {

  }

  render() {
    return (
      <div styleName="signupDiv">
        <form onSubmit={this.signupNewUser} method="post">
          <label>username:</label>
          <input type="text" name="username" id="username" onChange={this.checkUsernameAvailability}/>
          <label>password:</label>
          <input type="password" name="userpassword" id="password"/>
          <label>confirm password:</label>
          <input type="password" name="confirmpw" id="confirmpw"/>
          <label>email:</label>
          <input type="email" name="email" id="email" />
          <button>Sign Up</button>
        </form>
      </div>
    )
  }
}

export default CSSModules(SignupPage, styles);