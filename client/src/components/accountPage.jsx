import React from 'react';
import $ from 'jquery';
import CSSModules from 'react-css-modules';
import styles from '../styles/accountPage.css';
import validator from 'email-validator';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalApplied: -5,
      userExt: '',
      userexist: false,
      pwExt: '',
      emailExt: '',
      allowUpdateEmail: false,
      addressExt: ''
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.checkUsernameAvailability = this.checkUsernameAvailability.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.checkEmailAvailability = this.checkEmailAvailability.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
  }

  getApplied() {
    console.log(this.state.totalApplied);
    $.ajax({
      url: `http://localhost:4809/getAppliedCount/${this.props.userinfo.id}`,
      method: 'GET'
    }).then((response) => {
      console.log(response);
      this.setState({
        totalApplied: response.count
      })
    })
  }

  componentDidMount() {
    this.getApplied();
  }

  checkUsernameAvailability(e) {
    e.preventDefault();
    const data = {
      username: e.target.value
    }
    $.ajax({
      url: 'http://localhost:4809/signup/usernameavailability',
      method: 'GET',
      data: data,
      dataType: 'json'
    }).then((res) => {
      console.log(res);
      if (res === false) {
        $('<span id="userexist">Username already exist</span>').insertAfter($('#username-b'));
        this.setState({
          userexist: true
        })
      } else {
        $('#userexist').remove();
        this.setState({
          userexist: false
        })
      }
    }, (err) => {
      console.log('Try again');
    })
  }

  changeUsername(e) {
    e.preventDefault();
    console.log(this);
    let theForm = (
      <div>
        <form>
          <label>Change username:</label>
          <input type="text" name="username" id="username-c" onChange={(e) => {this.checkUsernameAvailability(e)}}/>
          <button id="username-b" onClick={this.updateUsername}>Update</button>
        </form>
      </div>);
    this.setState({
      userExt: theForm
    })
  }

  updateUsername(e) {
    e.preventDefault();
    if (this.state.userexist === false) {
      let newUsername = document.getElementById('username-c').value;
      let userid = this.props.userinfo.id;
      $.ajax({
        url: 'http://localhost:4809/update/username',
        method: 'PUT',
        data: {
          username: newUsername,
          id: userid
        },
        dataType: 'json'
      }).then((res) => {
        this.setState({
          userExt: 'User name updated'
        })
      })
    }
  }

  checkPasswordMatch(e) {
    e.preventDefault(e);
    const pw1 = document.getElementById('password-c').value;
    const pw2 = document.getElementById('confirmpw-c').value;
    if (pw1 !== pw2) {
      $('#pw-warning').remove();
      $('<span id="pw-warning">Password does not match</span>').insertAfter($('#confirmpw-c'));
      return false;
    } else {
      $('#pw-warning').remove();
      return true;
    }
  }

  changePassword(e) {
    e.preventDefault();
    let pwForm = (
      <div>
        <form styleName="pwForm">
          <label>New password:</label>
          <input type="password" name="userpassword" id="password-c" onChange={(e) => {this.checkPasswordMatch(e)}}/>
          <label>Confirm new password:</label>
          <input type="password" name="confirmpw" id="confirmpw-c" onChange={(e) => {this.checkPasswordMatch(e)}}/>
          <button onClick={this.updatePassword}>Update</button>
        </form>
      </div>
    )
    this.setState({
      pwExt: pwForm
    })
  }

  updatePassword(e) {
    e.preventDefault();
    if (this.checkPasswordMatch(e)) {
      let newpassword = document.getElementById('password-c').value;
      let userid = this.props.userinfo.id;
      $.ajax({
        url: 'http://localhost:4809/update/password',
        method: 'PUT',
        data: {
          password: newpassword,
          id: userid
        },
        dataType: 'json'
      }).then((res) => {
        console.log(res);
        this.setState({
          pwExt: 'password updated'
        })
      })
    }
  }

  checkEmailAvailability(e) {
    e.preventDefault();
    let email = document.getElementById('email-c').value;
    $.ajax({
      url: `http://localhost:4809/check/email/${email}`,
      method: 'GET',
    }).then((res) => {
      let boo = parseInt(res.count);
      $('#email-warning').remove();
      if (boo) {
        $('<span id="email-warning">Email already used</span>').insertAfter($('#email-div'));
        this.setState({
          allowUpdateEmail: false
        })
      } else if (validator.validate(email)) {
        this.setState({
          allowUpdateEmail: true
        })
      }
    })
  }

  updateEmail(e) {
    e.preventDefault();
    let newEmail = document.getElementById('email-c').value;
    let userid = this.props.userinfo.id;
    if (this.state.allowUpdateEmail) {
      $.ajax({
        url: 'http://localhost:4809/update/email',
        method: 'PUT',
        data: {
          email: newEmail,
          id: userid
        },
        dataType: 'json'
      }).then((res) => {
        this.setState({
          emailExt: 'email updated'
        })
      })
    }
  }

  changeEmail(e) {
    e.preventDefault();
    let emailForm = (
      <div>
        <form styleName="emailForm">
          <div id="email-div">
            <label>New email:</label>
            <input type="email" name="email" id="email-c" onChange={this.checkEmailAvailability}/>
            <button onClick={this.updateEmail}>Update</button>
          </div>
        </form>
      </div>
    );
    this.setState({
      emailExt: emailForm,
    })
  }

  makeStateSelect() {
    let stateAbbres = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    return stateAbbres.map((item) => {
      return <option value={`${item}`} key={`state_${item}`}>{item}</option>
    })
  }

  changeAddress(e) {
    e.preventDefault();
    let addressForm = (
      <div>
        <form>
          <div styleName="addressLines">
            <label>Address line 1(*)</label>
            <input type="text" name="address-line-one" id="al1"/>
            <label>Address line 2</label>
            <input type="text" name="address-line-two" id="al2"/>
          </div>
          <div styleName="city-state-info" id="locInfo">
            <div styleName="geo">
              <label>City(*)</label>
              <input type="text" name="city" id="city" styleName="cityInput"/>
            </div>
            <div styleName="geo">
              <label>State</label>
              <select id="state-choice">
                {this.makeStateSelect()}
              </select>
            </div>
            <div styleName="geo">
              <label>Country(*)</label>
              <input type="text" name="city" id="country" styleName="countryInput"/>
            </div>
            <div styleName="geo">
              <label>Zipcode(*)</label>
              <input type="text" name="zipcode" id="zipcode" styleName="zipInput"/>
            </div>
          </div>
          <button onClick={this.updateAddress}>Update</button>
        </form>
      </div>
    )
    this.setState({
      addressExt: addressForm
    })
  }

  updateAddress(e) {
    e.preventDefault();
    let address1 = document.getElementById('al1').value;
    let address2 = document.getElementById('al2').value;
    let city = document.getElementById('city').value;
    let state = document.getElementById('state-choice').value;
    let country = document.getElementById('country').value;
    let zipcode = document.getElementById('zipcode').value;
    $('#addressprevent').remove();
    if (address1 === '' || city === '' || country === '' || zipcode === '') {
      $('<span id="addressprevent">Please fill in all required information</span>').insertAfter($('#locInfo'));
    } else {
      let fullAddress = '';
      fullAddress += address1 + ', ';
      if (address2) {
        fullAddress += address2 + ', ';
      }
      fullAddress += city + ', ';
      fullAddress += state + ', ';
      fullAddress += country + ', ';
      fullAddress += zipcode;
      let userid = this.props.userinfo.id;
      $.ajax({
        url: 'http://localhost:4809/update/address',
        method: 'PUT',
        data: {
          address: fullAddress,
          id: userid
        },
        dataType: 'json'
      }).then((res) => {
        this.setState({
          addressExt: 'Address updated'
        })
      })
    }
  }

  render() {
    return (
      <div styleName="account-page">
        <h2>Account Details</h2>
        <div styleName="collection-box">
          <p>Username: {this.props.userinfo.username} <a onClick={this.changeUsername} href="">modify</a></p>
          <div>
            {this.state.userExt}
          </div>
          <p>Password: ******** <a href="" onClick={this.changePassword}>modify</a></p>
          <div>
            {this.state.pwExt}
          </div>
          <p>Email: {this.props.userinfo.user_email} <a href="" onClick={this.changeEmail}>modify</a></p>
          <div>
            {this.state.emailExt}
          </div>
          <p>Address: {this.props.userinfo.user_address === null ? 'No address avaliable' : this.props.userinfo.user_address} <a href="" onClick={this.changeAddress}>{this.props.userinfo.user_address ? 'change address' : 'add address'}</a></p>
          <div>
            {this.state.addressExt}
          </div>
          <p>Total applied: {this.state.totalApplied}</p>
        </div>
      </div>
    )
  }
}

export default CSSModules(AccountPage, styles);