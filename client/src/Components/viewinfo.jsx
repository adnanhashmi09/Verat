/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

function ViewInfo({ info, details }) {
    return (
        <>
        {
            info.map((it) => {
                if (details[it.class]) {
                    return (
                        <h2 className={it.class} key={it.class}>
                            {it.placeholder}
                            <span className={it.class}>
                                {details[it.class]}
                            </span>
                        </h2>
                    );
                }
            })
        }
        </>
    );
}

export default ViewInfo;
