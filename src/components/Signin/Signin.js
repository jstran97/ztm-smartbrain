import React from 'react';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    onEmailChange = (event) => {
        console.log("HELLO? THIS IS FROM onEmailChange");
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        console.log("HELLO? THIS IS FROM onPasswordChange");
        this.setState({signInPassword: event.target.value});
    }

    onSubmitSignIn = () => {
        console.log(this.state);

        console.log('this.state.signInEmail:', this.state.signInEmail);
        console.log('this.state.signInPassword:', this.state.signInPassword);

        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                console.log('user:', user);
                // Does the user exist? Did we receive a user with property of id?
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
            })

    }

    render() {
        const { onRouteChange } = this.props;

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0 center">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="email"
                                name="email-address"
                                id="email-address"
                                onChange={this.onEmailChange}
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password"
                                name="password"
                                id="password"
                                onChange={this.onPasswordChange}
                            />
                        </div>
                        </fieldset>
                        <div className="">
                        <input
                            onClick={this.onSubmitSignIn}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="button"
                            //type="submit" - DO NOT USE - It was refreshing the page multiple times and in unintended ways (signin -> home -> signin page)
                            value="Sign in"
                        />
                        </div>
                        <div className="lh-copy mt3">
                        <p onClick={() => onRouteChange('register')} className="f6 link dim black db">Register</p>
                        </div>
                    </form>
                </main>
            </article>
        );
    }
}

export default Signin;