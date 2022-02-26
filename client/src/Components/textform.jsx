function Form({ details, changeHandler }) {
    return (
        <>
        {
            details.map((detail) => (
                <input
                    type="text"
                    placeholder={detail.placeholder}
                    className={detail.class}
                    onChange={changeHandler}
                    key={detail.class}
                />
            ))
        }
        </>
    );
}

export default Form;
