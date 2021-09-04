import React from 'react';
import "./ShowErrors.css";

type ShowErrorsType = {
    children: JSX.Element | JSX.Element[]
}

export const ShowErrors = ({children}: ShowErrorsType) => {
    return (
        <div className="ShowErrors">
            {children}
        </div>
    );
};
