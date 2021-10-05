import React from 'react';
import "./MessageSection.css";

export const MessageSection = ({date, children}: {date: string, children: JSX.Element | JSX.Element[]}) => {
    return (
        <div className="MessageSection">
            <div className="MessageSection__date">{date}</div>
            <div className="MessageSection__children">
                {children}
            </div>
        </div>
    );
}