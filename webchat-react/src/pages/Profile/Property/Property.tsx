import React from 'react';

export const Property = ({name, value}: {name: string, value: string}) => {
    return (
        <div style={{display: 'flex', margin: '5px 0'}}>
            <div style={{minWidth: 165, color: '#818c99', fontSize: 13}}>{name}:</div>
            <div style={{color: '#2a5885', fontSize: 13}}>{value}</div>
        </div>
    );
}