import React from 'react';
import {Link} from "react-router-dom";

export const Section = ({userId, isVisitor, name, count, url}: {userId: string, isVisitor: boolean, name: string, count: number, url: string}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', position: 'relative', padding: '15px 7px', cursor: 'pointer', minWidth: 60}}>
            <div style={{textAlign: 'center', color: '#2A5885', fontSize: 19}}>{count}</div>
            <div style={{textAlign: 'center', fontSize: 13, color: '#626d7a'}}>{name}</div>
            <Link to={isVisitor ? `${url}/${userId}` : url} style={{position: 'absolute', width: '100%', height: '100%', margin: '-15px -7px'}}/>
        </div>
    );
}