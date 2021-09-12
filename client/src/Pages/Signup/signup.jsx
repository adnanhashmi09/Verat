import '../../Styles/Sass/pages/signup.scss';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import image from '../../Assets/IMG/2.png';
import google from '../../Assets/IMG/google.png';
import linkedin from '../../Assets/IMG/linkedin.png';

const Signup = () => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [authErr, setAuthErr] = useState(null);

    const history = useHistory();

    const signupHandler = (e) => {
        e.preventDefault();
        setAuthErr(false);
        fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(res => res.json())
            .then(data => {
                if(data.err) {
                    setAuthErr(data.err);
                }
                else {
                    history.push('/dashboard');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const oAuthHandler = async site => {
        await window.open('http://localhost:5000/api/auth/'+site, "_self");
    }

    return ( 
        <div className='auth-signup'>
            <div className='login-redirect'>
                <h1>L</h1>
                <h2>Already using <br /><span>Verat?</span></h2>
                <Link to='/login'>Signin</Link>
                <img src={image} alt='Logo'/>
            </div>
            <div className='signup'>
                <h1>Hello There!</h1>
                <form className='auth'>
                    <input type = 'email' placeholder = 'email' onChange = {(e) => {setEmail(e.target.value)}}/>
                    <input type = 'password' placeholder = 'password' onChange = {(e) => {setPassword(e.target.value)}}/>
                    { authErr && <h4>Signup failed: {authErr}</h4>}
                    <button type = 'submit' className='signup-btn' onClick={signupHandler}> Signup </button>
                </form>
                <h2> or </h2>
                <button className='auth-google' onClick = {() => {oAuthHandler('google')}}>
                    <img src={google} alt='google logo' />
                    Signup with Google
                    <div></div>
                </button>
                <button className='auth-linkedin' onClick = {() => {oAuthHandler('linkedin')}} >
                    <img src={linkedin} alt='linkedin logo' />
                    Signup with Linkedin
                    <div></div>
                </button>
            </div>
        </div>
     );
}
 
export default Signup;