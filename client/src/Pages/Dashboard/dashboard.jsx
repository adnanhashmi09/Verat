import { useDispatch } from "react-redux";
import { toggleLogin } from "../../Features/loginSlice";
import { useHistory } from "react-router";
import { useEffect } from "react";

const Dashboard = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        fetch('/auth/login/success') 
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if(res.err) {
                    history.push('/login');
                }
                else {
                    dispatch(toggleLogin(true));
                }
            })
            .catch(err => {
                console.log(err)
            })
    })

    const logoutHandler = () => {
        fetch('/auth/logout')
            .then( res => res.json() )
            .then( res => {
                dispatch(toggleLogin(false));
                history.push('/login');
            })
            .catch(err => {
                console.log(err);
            })
    }

    return ( 
        <button onClick={logoutHandler}>Logout</button>
     );
}
 
export default Dashboard;