import React, {useEffect, useState} from 'react';
import {Avatar, IconButton, Tooltip} from "@material-ui/core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {getUserId} from "../../ts/authorization";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            color: '#2a5885',
            fontSize: 12.5,
            fontWeight: 600,
            maxWidth: 220,
            textDecoration: 'none',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            '&:hover': {
                textDecoration: 'underline'
            },
            [theme.breakpoints.down('sm')]: {
                maxWidth: 150,
            }
        },
        img: {
            maxWidth: 160,
            [theme.breakpoints.up('sm')]: {
                maxHeight: 175,
                width: 'auto',
                maxWidth: '100%',
                margin: '5px 10px 5px 0'
            }
        }
    }),
);

export type MessageType = {
    userId: string,
    messageId: string,
    firstName: string,
    avatarSrc?: any,
    writtenDate: string,
    showInfo?: boolean,
    messageText?: string,
    messageImages?: Array<any>,
    unread?: boolean,
    selected?: boolean,
    editable: boolean,
    onClick: any,
    onEditClick: any,
    editedDate?: string
}

export const Message = ({userId, messageId, firstName, avatarSrc, writtenDate, messageText, onEditClick, editedDate, editable, onClick, messageImages = [], showInfo = false, unread = false, selected = false}: MessageType) => {
    const classes = useStyles();
    const [showChecked, setShowChecked] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isNotDelivered, setIsNotDelivered] = useState<boolean>(false);

    const handleMove = () => {
        setShowChecked(true);
        setShowEdit(true);
    }
    const handleLeave = () => {
        setShowChecked(false);
        setShowEdit(false);
    }

    useEffect(() => {
        setIsNotDelivered(isNaN(parseInt(messageId)));
    }, [messageId]);

    return (
        <div style={{display: 'flex', padding: '0 21px 0 5px', background: selected ? '#F0F2F5' : 'transparent', cursor: 'pointer', marginTop: showInfo ? 5 : 0}} onClick={(event: any) => {onClick(event, messageId)}} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <div style={{display: 'flex', maxHeight: 51}}>
                <FontAwesomeIcon icon={faCheckCircle} style={{visibility: !selected ? showChecked ? 'visible' : 'hidden' : 'visible', width: 16, height: 16, color: selected ? '#5181B8' : '#86A7CD', alignSelf: 'center'}}/>
            </div>
            <div style={{display: 'flex', background: unread ? '#F0F2F5' : 'transparent', padding: '5px 0', marginLeft: 2.5, width: '100%'}}>
                <Link to={userId.toString() === getUserId() ? '/Profile' : `/Profile/${userId}`} style={{visibility: showInfo ? 'visible' : 'hidden', display: 'inline-block', height: showInfo ? 'max-content' : 0, margin: '0 10px'}}>
                    <Avatar src={avatarSrc} style={{width: 36, height: 36}}/>
                </Link>
                <div style={{display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'space-around', width: '100%'}}>
                    <div style={{display: showInfo ? 'flex' : 'none', width: '100%'}}>
                        <Link to={userId.toString() === getUserId() ? '/Profile' : `/Profile/${userId}`} className={classes.link}>{firstName}</Link>
                        <span style={{marginLeft: 10, color: '#818c99', fontSize: 12, alignSelf: 'center'}}>{writtenDate}</span>
                    </div>
                    <div style={{display: 'flex', position: 'absolute', right: 10, top: -1}}>
                        <Tooltip title="Message is expected to be sent" arrow placement="top">
                            <div style={{visibility: isNotDelivered ? 'visible' : 'hidden', borderRadius: '100%', background: 'rgb(81 129 184 / 80%)', width: 10, height: 10, alignSelf: 'center'}}/>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                            <IconButton style={{width: 18, height: 18, visibility: editable && showEdit && !isNotDelivered ? 'visible' : 'collapse'}} className="icon-edit" disableTouchRipple onClick={(event: any) => onEditClick(event, messageId)}/>
                        </Tooltip>
                    </div>
                    <div style={{display: messageText !== undefined ? 'block' : 'none', marginTop: 5}}>
                        <div style={{fontSize: 13, lineHeight: 1.4, paddingRight: 80, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap'}}>{messageText}</div>
                    </div>
                    <div style={{display: messageImages !== undefined ? 'flex' : 'none', flexWrap: 'wrap', marginTop: 2.5}}>
                        {messageImages?.map((src, index) => <img key={index} className={classes.img} src={src} alt={src}/>)}
                    </div>
                    <Tooltip title={`Edited at ${editedDate}`} placement="bottom" arrow>
                        <span style={{display: editedDate !== undefined ? 'inline' : 'none', color: '#99a2ad', fontSize: 13, width: 'max-content'}}>(edited)</span>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
