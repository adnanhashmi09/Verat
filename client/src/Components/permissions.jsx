const Permissions = ({ options, onCheck, perm }) => {
    const list = options.map((option) => (
            <label htmlFor={option.id} key={option.id}>
                {option.label}
                <input type="checkbox" id={option.id} onChange={onCheck} defaultChecked={perm[option.id]} key={Math.random()} />
            </label>
        ));
    return (
        <>
            {list}
        </>
    );
};

export default Permissions;
