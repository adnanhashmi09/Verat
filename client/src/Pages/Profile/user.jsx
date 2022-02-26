import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useFetchDetails from '../../Hooks/useFetchDetails';
import Form from '../../Components/textform';
import ViewInfo from '../../Components/viewinfo';
import { setUser } from '../../Features/userSlice';

function Profile() {
    const [photo, setPhoto] = useState(null);
    const dispatch = useDispatch();

    const initialState = {};

    const userDetails = [
        { placeholder: 'First Name', class: 'firstName' },
        { placeholder: 'Last Name', class: 'lastName' },
        { placeholder: 'Contact Number', class: 'contact' },
        { placeholder: 'Email', class: 'email' },
        { placeholder: 'State of Residence', class: 'state' },
        { placeholder: 'Country of Residence', class: 'country' },
        { placeholder: 'Applying for ....', class: 'title' }
    ];

    const viewDetails = [
        { placeholder: 'First Name', class: 'firstName' },
        { placeholder: 'Last Name', class: 'lastName' },
        { placeholder: 'Email', class: 'email' },
        { placeholder: 'Contact No.', class: 'contact' },
        { placeholder: 'Date of Birth', class: 'dob' },
        { placeholder: 'State', class: 'state' },
        { placeholder: 'Country', class: 'country' }
    ];

    const { isValid, setIsValid, details, setDetails } = useFetchDetails('/profile/details', initialState);

    const detailsHandler = (e) => {
        details[e.target.className] = e.target.value;
        setDetails({ ...details });
    };

    const photoHandler = (e) => {
        const file = e.target.files[0];

        if (file) {
            details.photoURL = URL.createObjectURL(file);
            setPhoto(file);
            setDetails({ ...details });
        }
    };

    const formHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (photo) {
            formData.append('photo', photo);
        }
        Object.entries(details).forEach((detail) => {
            formData.append(detail[0], detail[1]);
        });
        console.log('hello');
        fetch('/profile/setup', {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.err) {
                console.log(res);
            } else {
                console.log(res);
                setIsValid(true);
                dispatch(setUser({ firstName: true, photo: true }));
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="profile">
            <div className="profile_inner">
                { !isValid ? (
                    <>
                    <div className="profile_inner_form">
                        <h1>Setup your profile</h1>
                        <form className="setup">
                                <div className="setup_inner">
                                    <div className="photo">
                                        <label className="photo_upload" htmlFor="photo_upload">
                                            {
                                            details.photoURL
                                            ? <img src={details.photoURL} alt="company logo" />
                                            : <h2>Upload a Profile photo</h2>
                                            }
                                            <input type="file" className="photoURL" id="photo_upload" onChange={photoHandler} />
                                        </label>
                                    </div>
                                    <div className="details">
                                        <Form
                                            details={userDetails}
                                            changeHandler={detailsHandler}
                                        />
                                        <input type="date" placeholder="Date of Birth" className="dob" onChange={detailsHandler} />
                                    </div>
                                </div>
                                <button type="submit" onClick={formHandler}>Submit</button>
                        </form>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="profile_inner_view">
                        <h1>Your Profile</h1>
                        <div className="info">
                            {details.photo && <img src={`http://localhost:5000/${details.photo}`} alt="profile" /> }
                            <div className="info_inner">
                                <ViewInfo details={details} info={viewDetails} />
                                <h2 className="title">
                                    {
                                        details.review ? 'Job Title' : 'Applied for'
                                    }
                                    <span>{details.title}</span>
                                </h2>
                                <h2 className="review">
                                    Approval Status
                                    {
                                        details.review
                                        ? <span className="review_true">Approved</span>
                                        : <span className="review_false">Under Review</span>
                                    }
                                </h2>
                            </div>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;
