import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { toggleLogin } from '../../Features/loginSlice';
import SideNav from '../../Components/sidenav';
import TopBar from '../../Components/topbar';

const Dashboard = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const isLoggedIn = useSelector((state) => state.login.login);

	useEffect(() => {
		fetch('/auth/login/success')
			.then((res) => res.json())
			.then((res) => {
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
		<>
			{isLoggedIn && (
				<div className="dashboard">
					<SideNav logout={logoutHandler} />
					<main className="container">
						<TopBar />
					</main>
				</div>
			)}
		</>
	);
};

export default Dashboard;
