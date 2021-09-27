import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SideNavLi({ icon, text, id, selectedList, selectListItem }) {
	return (
		<Link
			to="#"
			className={`sidenav__link ${id === selectedList ? 'selected' : ''}`}
			onClick={() => {
				selectListItem(id);
			}}
		>
			<div className="sidenav__link__icon-container">
				<FontAwesomeIcon className="sidenav__link__icon" icon={icon} />
			</div>
			<span className="sidenav__link__text">{text}</span>
		</Link>
	);
}

export default SideNavLi;
