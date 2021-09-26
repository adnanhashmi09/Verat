import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Search from './search';
import profile from '../Assets/IMG/profile.jpg';

function TopBar() {
	return (
		<div className="topbar">
			<div className="topbar__up">
				<Search />
				<div className="topbar__up__personal">
					<div className="topbar__up__personal__icons">
						<FontAwesomeIcon icon={faCommentDots} />
					</div>
					<div className="topbar__up__personal__icons">
						<FontAwesomeIcon icon={faBell} />
					</div>
					<div className="topbar__up__personal__profile">
						<img src={profile} alt="profile-pc" />
					</div>
				</div>
			</div>
			<div className="topbar__down">
				<div className="topbar__down__infoText">
					<span className="breadcrumbs">Home</span>
					<span className="greetings">Hello, John!</span>
				</div>
				<div className="btn">Report</div>
			</div>
		</div>
	);
}

export default TopBar;
