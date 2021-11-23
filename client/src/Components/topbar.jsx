import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Search from './search';
import profile from '../Assets/IMG/profile.jpg';

function TopBar({ path, name, photo }) {
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
						<Link to="/dashboard/profile">
							<img src={photo ? `http://localhost:5000/${photo}` : profile} alt="profile-pc" />
						</Link>
					</div>
				</div>
			</div>
			<div className="topbar__down">
				<div className="topbar__down__infoText">
					<span className="breadcrumbs">{path.charAt(0).toUpperCase() + path.slice(1)}</span>
					<span className="greetings">
						{ !name ? 'Hello' : `Hello, ${name}`}
					</span>
				</div>
				<div className="btn">Report</div>
			</div>
		</div>
	);
}

export default TopBar;
