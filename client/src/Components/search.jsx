import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Search() {
	const [searchInput, setSearchInput] = useState('');
	return (
		<form className="searchBox" aria-label="search box">
			<input
				className="searchBox__input "
				value={searchInput}
				placeholder="Search"
				id="header-search"
				type="text"
				onInput={(e) => {
					setSearchInput(e.target.value);
				}}
			/>
			<button
				className="searchBox__btn "
				type="submit"
				aria-label="search button"
			>
				<FontAwesomeIcon icon={faSearch} />
			</button>
		</form>
	);
}

export default Search;
