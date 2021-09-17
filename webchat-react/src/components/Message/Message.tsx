import React, {useState} from 'react';
import {Avatar, IconButton, Tooltip} from "@material-ui/core";
import avatar2 from "../../assets/images/avatar2.jpg";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

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
    onClick: any,
    onEditClick: any,
    editedDate?: string
}

export const Message = ({userId, messageId, firstName, avatarSrc, writtenDate, messageText, onEditClick, editedDate, onClick, messageImages = [], showInfo = false, unread = false, selected = false}: MessageType) => {
    const classes = useStyles();
    const [showChecked, setShowChecked] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);

    const handleMove = () => {
        setShowChecked(true);
        setShowEdit(true);
    }
    const handleLeave = () => {
        setShowChecked(false);
        setShowEdit(false);
    }

    return (
        <div className="message" data-messageid={messageId} style={{display: 'flex', padding: '0 5px', background: selected ? '#F0F2F5' : 'transparent', cursor: 'pointer', marginTop: showInfo ? 5 : 0}} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <div style={{display: 'flex', maxHeight: 51}}>
                <FontAwesomeIcon icon={faCheckCircle} style={{visibility: !selected ? showChecked ? 'visible' : 'hidden' : 'visible', width: 16, height: 16, color: selected ? '#5181B8' : '#86A7CD', alignSelf: 'center'}}/>
            </div>
            <div style={{display: 'flex', background: unread ? '#F0F2F5' : 'transparent', padding: '5px 0', marginLeft: 2.5, width: '100%'}}>
                <Link to={`/Profile/${userId}`} style={{visibility: showInfo ? 'visible' : 'hidden', display: 'inline-block', height: showInfo ? 'auto' : 0, margin: '0 10px'}}>
                    <Avatar src={avatarSrc} style={{width: 36, height: 36}}/>
                </Link>
                <div style={{display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'space-around', width: '100%'}}>
                    <div style={{display: showInfo ? 'flex' : 'none', width: '100%'}}>
                        <Link to={`/Profile/${userId}`} className={classes.link}>{firstName}</Link>
                        <span style={{marginLeft: 10, color: '#818c99', fontSize: 12, alignSelf: 'center'}}>{writtenDate}</span>
                    </div>
                    <div style={{position: 'absolute', right: 10, top: -1}}>
                        <Tooltip title="Edit" placement="top" arrow>
                            <IconButton style={{width: 18, height: 18, visibility: showEdit ? 'visible' : 'collapse'}} className="icon-edit" disableTouchRipple onClick={onEditClick}/>
                        </Tooltip>
                    </div>
                    <div style={{display: messageText !== undefined ? 'block' : 'none', marginTop: 2.5}}>
                        <div style={{fontSize: 13, lineHeight: 1.4, paddingRight: 80, overflowWrap: 'anywhere'}}>{messageText}</div>
                    </div>
                    <div style={{display: messageImages !== undefined ? 'flex' : 'none', flexWrap: 'wrap', marginTop: 2.5}}>
                        {messageImages?.map(src => <img style={{maxHeight: 175, margin: '5px 10px 5px 0'}} src={src} alt={src}/>)}
                    </div>
                    <Tooltip title={`edited at ${editedDate}`} placement="top" arrow>
                        <span style={{display: editedDate !== undefined ? 'inline' : 'none', color: '#99a2ad', fontSize: 13, width: 'max-content'}}>(edited)</span>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
