import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { toggleLogin } from '../../Features/loginSlice';
import SideNav from '../../Components/sidenav';
import TopBar from '../../Components/topbar';

const Dashboard = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		fetch('/auth/login/success')
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				if (res.err) {
					history.push('/login');
				} else {
					dispatch(toggleLogin(true));
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});

	const logoutHandler = () => {
		fetch('/auth/logout')
			.then((res) => res.json())
			.then(() => {
				dispatch(toggleLogin(false));
				history.push('/login');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="dashboard">
			<SideNav logout={logoutHandler} />
			<main className="container">
				<TopBar />
			</main>
			{/* <button onClick={logoutHandler} type="button">
				Logout
			</button> */}
		</div>
	);
};

export default Dashboard;
