import '../../Styles/Sass/pages/login.scss';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import image from '../../Assets/IMG/1.png';
import google from '../../Assets/IMG/google.png';
import linkedin from '../../Assets/IMG/linkedin.png';

const Login = () => {
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [authErr, setAuthErr] = useState(false);

	const history = useHistory();

	const loginHandler = (e) => {
		e.preventDefault();
		setAuthErr(false);
		fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.err) {
					setAuthErr(data.err);
				} else {
					history.push('/dashboard');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const oAuthHandler = (site) => {
		window.open(`http://localhost:5000/api/auth/${site}`, '_self');
	};

	return (
		<div className="auth-login">
			<div className="login">
				<h1>Welcome Back</h1>
				<form className="auth">
					<input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
					<input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
					{authErr && (
						<h4>
							Authentication failed:
							{` ${authErr}`}
						</h4>
					)}
					<button type="submit" className="login-btn" onClick={loginHandler}>
						Login
					</button>
				</form>
				<h2> or </h2>
				<div className="oauth">
					<button className="auth-google" type="button" onClick={() => { oAuthHandler('google'); }}>
						<img src={google} alt="google logo" />
						<span>Signup with Google</span>
					</button>
					<button className="auth-linkedin" type="button" onClick={() => { oAuthHandler('linkedin'); }}>
						<img src={linkedin} alt="linkedin logo" />
						<span>Signup with Linkedin</span>
					</button>
				</div>
			</div>
			<div className="signup-redirect">
				<h1>L</h1>
				<h2>
					Wanna get your firm
					<br />
					organised?
				</h2>
				<Link to="/signup">Sign up</Link>
				<div className="img-container">
					<img src={image} alt="Logo" />
				</div>
			</div>
		</div>
	);
};

export default Login;
