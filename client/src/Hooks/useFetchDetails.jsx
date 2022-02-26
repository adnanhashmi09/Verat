/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function useFetchDetails(address, initialState) {
    const [isValid, setIsValid] = useState(true);
    const [details, setDetails] = useState(initialState);
    const history = useHistory();

    useEffect(() => {
        fetch(address)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.err) {
                    const { err } = res;
                    if (err === 'company') {
                        history.push('/dashboard/company');
                    } else {
                        setIsValid(false);
                    }
                } else {
                    setDetails({ ...res.details });
                    console.log(details);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [address, isValid]);

    return { isValid, setIsValid, history, details, setDetails };
}

export default useFetchDetails;
