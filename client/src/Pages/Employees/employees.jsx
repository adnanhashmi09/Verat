/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faQuestion } from '@fortawesome/free-solid-svg-icons';
import useFetchDetails from '../../Hooks/useFetchDetails';
import ViewInfo from '../../Components/viewinfo';
import Permissions from '../../Components/permissions';

const GenList = ({ data, id, onSelect }) => {
    const empList = data.map((emp) => {
            return (
                <li id={emp.soul} key={emp.soul}>
                    {id
                    ? (
                        <button type="button" id={emp.soul} onClick={onSelect} className="active">
                            <img src={`http://localhost:5000/${emp.photo}`} alt="" />
                            <div className="details">
                                <h2>
                                    { `${emp.firstName} ${emp.lastName}` }
                                </h2>
                                <h3>
                                    { emp.title }
                                </h3>
                            </div>
                            <div className="icon">
                                { emp.review
                                ? (
                                    <FontAwesomeIcon icon={faCheck} className="icon_approved" />
                                ) : (
                                    <FontAwesomeIcon icon={faQuestion} className="icon_pending" />
                                )}
                            </div>
                        </button>
                    ) : (
                        <button type="button" id={emp.soul} onClick={onSelect} className="inactive">
                            <img src={`http://localhost:5000/${emp.photo}`} alt="" />
                            <div className="details">
                                <h2>
                                    { `${emp.firstName} ${emp.lastName}` }
                                </h2>
                                <h3>
                                    { emp.email }
                                </h3>
                            </div>
                            <div className="info">
                            { emp.review
                            ? (
                                <h3>
                                    Job Title
                                    <br />
                                    <span>{emp.title}</span>
                                </h3>
                            ) : (
                                <h3>
                                    Enrolled for
                                    <br />
                                    <span>{emp.title}</span>
                                </h3>
                            )}
                            </div>
                            <div className="icon">
                                { emp.review
                                ? (
                                    <FontAwesomeIcon icon={faCheck} className="icon_approved" />
                                ) : (
                                    <FontAwesomeIcon icon={faQuestion} className="icon_pending" />
                                )}
                            </div>
                        </button>
                    )}
                </li>
            );
    });

    return (
        <ul>
            { empList }
        </ul>
    );
};

const EmployeeDetails = ({ details, onClose, id, onApprove }) => {
    const [review, setReview] = useState({});
    const [titles, setTitles] = useState({});
    const [perms, setPerms] = useState({});
    const [customTitle, setCustomTitle] = useState(null);

    const viewInfo = [
        { placeholder: 'First Name', class: 'firstName' },
        { placeholder: 'Last Name', class: 'lastName' },
        { placeholder: 'Email', class: 'email' },
        { placeholder: 'Contact No.', class: 'contact' },
        { placeholder: 'Date of Birth', class: 'dob' },
        { placeholder: 'State', class: 'state' },
        { placeholder: 'Country', class: 'country' }
    ];

    const permissions = [
        { label: 'View Users', id: 'viewUsers' },
        { label: 'Delete Users', id: 'deleteUsers' },
        { label: 'Approve Users', id: 'approveUsers' },
        { label: 'Manage Orders', id: 'manageOrders' },
        { label: 'View Orders', id: 'viewOrders' }
    ];

    const roles = {
        Admin: {
            viewUsers: true,
            deleteUsers: true,
            approveUsers: true,
            manageOrders: true,
            viewOrders: true
        },
        Management: {
            viewUsers: false,
            deleteUsers: false,
            approveUsers: false,
            manageOrders: true,
            viewOrders: true
        },
        'Human Resources': {
            viewUsers: true,
            deleteUsers: true,
            approveUsers: true,
            manageOrders: false,
            viewOrders: false
        },
        Custom: {
            viewUsers: false,
            deleteUsers: false,
            approveUsers: false,
            manageOrders: false,
            viewOrders: false
        },
    };

    const reviewHandler = () => {
        if (!review[id]) {
            review[id] = true;
            setReview({ ...review });
        } else {
            const title = (titles[id] === 'Custom') ? customTitle : titles[id];
            const data = {
                userSoul: id,
                title,
                userPermissions: perms
            };
            fetch('/profile/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                onApprove(null);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    const titleHandler = (e) => {
        titles[id] = e.target.value;
        setTitles({ ...titles });
        setPerms(roles[titles[id]]);
    };

    const checkHandler = (e) => {
        perms[e.target.id] = e.target.checked;
        setPerms({ ...perms });
    };

    useEffect(() => {
        if (!titles[id]) {
            titles[id] = 'Admin';
            setTitles({ ...titles });
        }
        setPerms(roles[titles[id]]);
    }, [id]);

    return (
        <div className="emp_class_active">
            <div className="emp_class_active_info">
                <div className="utilities">
                    <button type="button" onClick={onClose}>
                        &#x2715;
                    </button>
                </div>
                {details.photo && <img src={`http://localhost:5000/${details.photo}`} alt="profile" />}
                <div className="text">
                    <ViewInfo details={details} info={viewInfo} />
                </div>
                {!details.review
                ? (
                    <div className="review">
                        {review[id]
                        && (
                            <div className="review_active">
                                <hr />
                                <h2>Add a Job Title / Role</h2>
                                <select id="title" onChange={titleHandler} defaultValue={titles[id]}>
                                    <option value={null} disabled hidden>
                                        Choose a predefined role
                                    </option>
                                    <option value="Admin" selected={(titles[id] === 'Admin') ? 'selected' : ''}>Admin</option>
                                    <option value="Management" selected={(titles[id] === 'Management') ? 'selected' : ''}>Management</option>
                                    <option value="Human Resources" selected={(titles[id] === 'Human Resources') ? 'selected' : ''}>Human Resources</option>
                                    <option value="Custom" selected={(titles[id] === 'Custom') ? 'selected' : ''}>Custom Role</option>
                                </select>
                                { (titles[id] === 'Custom')
                                && (
                                    <input
                                        type="text"
                                        placeholder="Custom Title"
                                        id="title"
                                        onChange={(e) => { setCustomTitle(e.target.value); }}
                                    />
                                )}
                                <div className="permissions">
                                    <h3>Set Permissions for the job</h3>
                                    <Permissions
                                        options={permissions}
                                        onCheck={checkHandler}
                                        perm={perms}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="actions">
                            <button className="drop" type="button">
                                Drop user
                            </button>
                            <button
                                className="approve"
                                type="button"
                                onClick={() => { reviewHandler(); }}
                            >
                                Approve user
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="enrolled">
                        hi
                    </div>
                )}
            </div>
        </div>
    );
};

const Employees = () => {
    const initialState = {};
    const [pending, setPending] = useState(false);
    const [employeeID, setEmployeeID] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);

    const { isValid, details, setIsValid } = useFetchDetails('/company/employees', initialState);

    const selectionHandler = (e, review) => {
        e.preventDefault();
        setEmployeeID(e.currentTarget.id);
        setPending(review);
    };

    const closeHandler = () => {
        setEmployeeDetails(null);
        setEmployeeID(null);
    };

    const toggleValid = () => {
        setEmployeeID(null);
        const valid = !isValid;
        setIsValid(valid);
    };

    useEffect(() => {
        const data = { soul: employeeID };
        const address = pending ? 'empdata' : 'profdata';
        if (employeeID) {
            fetch(`/company/${address}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setEmployeeDetails(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [employeeID]);

    return (
        <div className="emp_class">
            {
                (employeeID && employeeDetails)
                && (
                <EmployeeDetails
                    details={employeeDetails}
                    onClose={closeHandler}
                    id={employeeID}
                    onApprove={toggleValid}
                />
            )
            }
            {(details.complete && details.complete.length !== 0)
            && (
            <div className="emp_class_list">
                <GenList
                    data={details.complete}
                    id={employeeID}
                    onSelect={(e) => { selectionHandler(e, false); }}
                />
            </div>
            )}
            {(details.pending && details.pending.length !== 0)
            && (
            <div className="emp_class_list">
                <GenList
                data={details.pending}
                id={employeeID}
                onSelect={(e) => { selectionHandler(e, true); }}
                />
            </div>
            )}
        </div>
    );
};

export default Employees;
