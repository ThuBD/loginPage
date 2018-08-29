import React from 'react';
import { ajax } from 'jquery';
import CSSModules from 'react-css-modules';
import styles from '../styles/signupPage.css';
import validator from 'email-validator';

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userexist: '',
      pwdiff: '',
      typingTimeout: 0,
      allgood: '',
      emailv: ''
    }
  }

  signupNewUser(e) {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      password2: e.target.confirmpw.value,
      email: e.target.email.value
    }
    if (!this.state.pwdiff && !this.state.userexist && !this.state.emailv) {
      ajax({
        url: 'http://localhost:4809/signup/newuser',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).then((res) => {
        setTimeout(() => {
          this.props.rendlogin();
        }, 500);
      })
    } else {
      const error = this.state.pwdiff ? this.state.pwdiff : this.state.userexist;
      this.setState({
        allgood: error
      })
    }
  }

  checkUsernameAvailability(e) {
    e.preventDefault();
    const data = {
      username: e.target.value
    }
    ajax({
      url: 'http://localhost:4809/signup/usernameavailability',
      method: 'GET',
      data: data,
      dataType: 'json'
    }).then((res) => {
      if (res === false) {
        this.setState({
          userexist: 'User already exists.'
        })
      } else {
        this.setState({
          userexist: ''
        })
      }
    }, (err) => {
      console.log('Try again');
    })
  }

  checkPasswordMatch(e) {
    const pw1 = document.getElementById('password').value;
    const pw2 = document.getElementById('confirmpw').value;
    const match = pw1 === pw2 ? '' : 'Password does not match';
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    setTimeout(() => {
      this.setState({
        pwdiff: match,
        typingTimeout: 1
      })
    }, 500);
  }

  checkEmailExist(e) {
    let str = 'Email is not valid';
    if (validator.validate(e.target.value)) {
      str = '';
    }
    this.setState({
      emailv: str
    });
  }

  render() {
    return (
      <div styleName="signupDiv">
        <form onSubmit={(e) => this.signupNewUser(e)} method="post">
          <label>username:</label>
          <input type="text" name="username" id="username" onChange={(e) => {this.checkUsernameAvailability(e, this)}}/>
          <span>{this.state.userexist}</span>
          <label>password:</label>
          <input type="password" name="userpassword" id="password" onChange={(e) => {this.checkPasswordMatch(e, this)}}/>
          <label>confirm password:</label>
          <input type="password" name="confirmpw" id="confirmpw" onChange={(e) => {this.checkPasswordMatch(e)}}/>
          <span>{this.state.pwdiff}</span>
          <label>email:</label>
          <input type="email" name="email" id="email" onChange={(e) => {this.checkEmailExist(e)}}/>
          <span>{this.state.emailv}</span>
          <button>Sign Up</button>
          <span>{this.state.allgood}</span>
        </form>
      </div>
    )
  }
}

export default CSSModules(SignupPage, styles);