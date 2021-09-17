import React from 'react';

export const MessageSection = ({date, children}: {date: string, children: JSX.Element | JSX.Element[]}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', margin: 5}}>
            <div style={{fontSize: 12.5, margin: '10px 0', textAlign: 'center', color: '#626d7a'}}>{date}</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {children}
            </div>
        </div>
    );
}