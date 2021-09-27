import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	faTachometerAlt,
	faUsers,
	faChartArea,
	faShippingFast,
	faIndustry,
	faCog,
	faLifeRing,
} from '@fortawesome/free-solid-svg-icons';
import { toggleHamburger } from '../Features/hamburgerSlice';
import Li from './sideNavLi';
import logo from '../Assets/IMG/logo1.png';

function SideNav({ logout }) {
	const isHamburgerActive = useSelector((state) => state.hamburger.active);
	const dispatch = useDispatch();

	const navListMain = [
		{ icon: faTachometerAlt, text: 'Home' },
		{ icon: faUsers, text: 'Employees' },
		{ icon: faChartArea, text: 'Statistics' },
		{ icon: faShippingFast, text: 'Shipments' },
		{ icon: faIndustry, text: 'Factory' },
	];

	const navListUtility = [
		{ icon: faCog, text: 'Settings' },
		{ icon: faLifeRing, text: 'Help' },
	];

	const [selectedList, setSelectedList] = useState(0);

	const selectListItem = (i) => {
		setSelectedList(i);
	};

	return (
		<nav className={`sidenav ${isHamburgerActive ? 'active' : ''}`}>
			<div className="sidenav__top">
				<div className="sidenav__top__logo">
					<img src={logo} alt="logo" />
				</div>

				{/* Hamburger Menu button */}
				<div
					className="hamburger"
					onClick={() => dispatch(toggleHamburger(!isHamburgerActive))}
				>
					<div
						className={`hamburger__main ${
							isHamburgerActive ? 'active' : ''
						}`}
					/>
				</div>
			</div>
			<div className="btn btn-sidenav" onClick={logout}>
				Logout
			</div>

			{/* main navigation links : Home, Orders, Shipments, etc  */}
			<ul className="sidenav__linkGroup">
				{navListMain.map((item, i) => (
					<Li
						id={i}
						selectedList={selectedList}
						icon={item.icon}
						text={item.text}
						key={`sidenavList_${i}`}
						selectListItem={selectListItem}
					/>
				))}
			</ul>

			{/* utility links : settings, help */}
			<ul className="sidenav__linkGroup">
				{navListUtility.map((item, i) => (
					<Li
						id={navListMain.length + 1 + i}
						selectedList={selectedList}
						icon={item.icon}
						text={item.text}
						key={`sidenavList_${navListMain.length + 1 + i}`}
						selectListItem={selectListItem}
					/>
				))}
			</ul>
		</nav>
	);
}

export default SideNav;
