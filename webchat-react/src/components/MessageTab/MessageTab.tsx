import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {get} from "../../ts/requests";
import {headers} from "../../ts/authorization";

export type MessageTabType = {
    title?: string,
    selected: boolean,
    disableClose?: boolean,
    onClick?: any,
    closeClick?: any,
    key?: any,
    userId?: string,
    newMessageCount?: number
}

export const MessageTab = ({title, selected, userId, newMessageCount, disableClose = true, onClick, closeClick}: MessageTabType) => {
    const [background, setBackground] = useState<string>( selected ? '#F2F3F5' : 'transparent');
    const [closeColor, setCloseColor] = useState<string>('rgba(0, 0, 0, 0.20)');
    const [visibleBtnClose, setVisibleBtnClose] = useState<boolean>(false);
    const [titleName, setTitleName] = useState<string | undefined>(title);

    const handleClick = (event: any) => {
        if (event.target.closest('#closeTab') !== null)
            return;

        onClick();
    }
    const handleMouseMove = () => {
        if (!selected)
            setBackground('#F5F6F8');

        if (!disableClose)
            setVisibleBtnClose(true);
    }
    const handleMouseLeave = () => {
        if (!selected)
            setBackground('transparent');

        if (!disableClose)
            setVisibleBtnClose(false);
    }
    const handleCloseMouseMove = () => {
        setCloseColor('rgba(0, 0, 0, 0.30)');
    }
    const handleCloseMouseLeave = () => {
        setCloseColor('rgba(0, 0, 0, 0.20)');
    }
    const handleLoadData = async () => {
        const response = await get({url: `UserProfiles/GetName/${userId}`, headers: headers});

        if (response.ok) {
            const json = await response.json();
            setTitleName(`${json.firstName} ${json.lastName}`);
        }
    }

    useEffect(() => {
        setBackground(selected ? '#F2F3F5' : 'transparent');
    }, [selected]);

    useEffect(() => {
        if (userId !== undefined)
            handleLoadData();
    }, [userId]);

    return (
        <div style={{display: 'flex', position: 'relative', cursor: 'pointer', height: 32, padding: '0 5px 0 20px', background: background, borderLeft: `2px solid ${selected ? '#5181b8' : 'transparent'}`}} onClick={handleClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span style={{color: selected ? 'black' : '#2a5885', fontWeight: selected ? 500 : 400, fontSize: 13, alignSelf: 'center', maxWidth: 160, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{titleName}</span>
            <div id="closeTab" style={{display: disableClose || !visibleBtnClose ? 'none' : 'flex', position: 'absolute', height: '100%', right: 15}} onClick={closeClick} onMouseMove={handleCloseMouseMove} onMouseLeave={handleCloseMouseLeave}>
                <FontAwesomeIcon icon={faTimes} style={{alignSelf: 'center', width: 14, height: 14, color: closeColor}}/>
            </div>
            <div style={{display: newMessageCount !== undefined && newMessageCount > 0 && !visibleBtnClose ? 'flex' : 'none', position: 'absolute', flexDirection: 'column', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#2a5885', height: '100%', right: 15}}>
                +{newMessageCount}
            </div>
        </div>
    )
};
