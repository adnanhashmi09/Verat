/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Form from '../../Components/textform';
import useFetchDetails from '../../Hooks/useFetchDetails';
import ViewInfo from '../../Components/viewinfo';

function Company() {
    const [refCode, setRefCode] = useState(null);
    const [logo, setLogo] = useState(null);

    const initialState = {
        strength: null
    };

    const compDetails = [
        { placeholder: 'Company Name', class: 'name' },
        { placeholder: 'Email (Official)', class: 'email' },
        { placeholder: 'Contact No.', class: 'contact' },
        { placeholder: 'LLP ID (if present)', class: 'id' }
    ];

    const viewDetails = [
        { placeholder: 'Company', class: 'name' },
        { placeholder: 'Email', class: 'email' },
        { placeholder: 'Contact No.', class: 'contact' },
        { placeholder: 'LLP ID', class: 'id' },
        { placeholder: 'Employee Strength', class: 'strength' },
        { placeholder: 'Year of Establishment', class: 'year' },
    ];

    const { isValid, history, details, setDetails } = useFetchDetails('/company/details', initialState);

    const detailsHandler = (e) => {
        details[e.target.className] = e.target.value;
        setDetails({ ...details });
    };

    const logoHandler = (e) => {
        const file = e.target.files[0];

        if (file) {
            details.logoURL = URL.createObjectURL(file);
            setLogo(file);
            setDetails({ ...details });
        }
    };

    const formHandler = (e, action) => {
        e.preventDefault();

        const formData = new FormData();
        let payload = { refCode };

        if (action === 'register') {
            payload = details;
            if (logo) {
                formData.append('logo', logo);
            }
        }
        console.log(payload);
        Object.entries(payload).forEach((detail) => {
            formData.append(detail[0], detail[1]);
        });

        fetch(`/company/${action}`, {
            method: 'POST',
			body: formData
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.err) {
                console.log(res);
            } else {
                console.log(res);
                history.push('/dashboard/profile');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="company">
            { !isValid ? (
                <>
                <div className="company_inner_form">
                    <div className="register">
                        <h1>Register a new company</h1>
                        <form>
                            <div className="details">
                                <Form details={compDetails} changeHandler={detailsHandler} />
                                <input
                                    className="year"
                                    type="number"
                                    placeholder="Year of Establishment"
                                    onChange={detailsHandler}
                                />
                                <select className="strength" onChange={detailsHandler}>
                                    <option value="" disabled selected>Number of employees</option>
                                    <option value="1-5">1-5</option>
                                    <option value="6-20">6-20</option>
                                    <option value="21-200">21-200</option>
                                    <option value="more than 200">More than 200</option>
                                </select>
                            </div>
                            <div className="logo">
                                <label className="logo_upload" htmlFor="logo_upload">
                                    {
                                        details.logoURL
                                        ? <img src={details.logoURL} alt="company logo" />
                                        : <h2>Upload a Company Logo</h2>
                                    }
                                    <input type="file" id="logo_upload" className="logo" onChange={logoHandler} />
                                </label>
                                <button type="submit" onClick={(e) => { formHandler(e, 'register'); }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    <h2 className="division">or</h2>
                    <div className="enroll">
                        <h1>Enroll in a company</h1>
                        <h2>Enter the referral code of the company you want to enroll in</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Enter Code"
                                onChange={(e) => { setRefCode(e.target.value); }}
                            />
                            <button type="submit" onClick={(e) => { formHandler(e, 'enroll'); }}>Enter</button>
                        </form>
                    </div>
                </div>
                </>
            ) : (
                <>
                <div className="company_inner_view">
                    <div className="info">
                        <h1>About the Company</h1>
                        { details.logo && <img src={`http://localhost:5000/${details.logo}`} alt="company logo" />}
                        <div className="info_view">
                            <ViewInfo details={details} info={viewDetails} />
                            <div className="refCode">
                                <h2 className="refCode">
                                    Referral Code
                                    <span className="refCode">
                                        {details.refCode}
                                    </span>
                                </h2>
                                <button
                                    className="icon_copy"
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(details.refCode);
                                    }}
                                >
                                        <FontAwesomeIcon icon={faCopy} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}

export default Company;
