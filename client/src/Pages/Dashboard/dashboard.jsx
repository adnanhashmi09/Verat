/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toggleLogin } from '../../Features/loginSlice';
import { setUser } from '../../Features/userSlice';
import SideNav from '../../Components/sidenav';
import TopBar from '../../Components/topbar';
import Profile from '../Profile/user';
import Company from '../Profile/company';
import Employees from '../Employees/employees';

const Dashboard = ({ loginStatus }) => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { path } = useParams();
	const history = useHistory();

	useEffect(() => {
		if (!loginStatus.loggedIn) {
			dispatch(setUser({
				name: null,
				photo: null
			}));
		}
		fetch('/auth/login/success')
			.then((res) => res.json())
			.then((res) => {
				if (res.err) {
					history.push('/login');
				} else {
					dispatch(toggleLogin(true));
					fetch('/profile/details')
						.then((data) => data.json())
						.then((data) => {
							console.log(data);
							if (!data.err) {
								dispatch(setUser(data.details));
							}
						})
						.catch((err) => {
							console.log(err);
						});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, [user]);

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
				<TopBar path={!path ? 'home' : path} name={user.name} photo={user.photo} />
				{!path && <h1>hello</h1>}
				{(path === 'profile') && <Profile />}
				{(path === 'company') && <Company />}
				{(path === 'employees') && <Employees />}
			</main>
		</div>
	);
};

export default Dashboard;
