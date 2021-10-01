import React, {useState} from 'react';
import {createStyles, makeStyles, Theme, withStyles} from "@material-ui/core/styles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link} from "react-router-dom";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import {tryAddPeerByUserId} from "../MessageTabManager/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chat: {
            display: 'flex',
            cursor: 'pointer',
            height: 70,
            position: 'relative'
        },
        name: {
            fontSize: 13,
            maxWidth: 525,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 500,
            [theme.breakpoints.down('sm')]: {
                maxWidth: 155
            },
        },
        message: {
            fontSize: 13,
            color: '#626d7a',
            borderRadius: 3,
            width: '100%',
            maxWidth: 350,
            height: 25,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            alignSelf: 'center',
            [theme.breakpoints.down('sm')]: {
                maxWidth: 175
            },
        },
        unreadCount: {
            right: 0,
            marginLeft: 35,
            background: '#5181b8',
            borderRadius: '100%',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 11,
            color: 'white',
            lineHeight: '19px',
            width: 18,
            height: 18
        }
    }),
);

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            width: 8,
            height: 8,
            borderRadius: '100%',
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
        }
    }),
)(Badge);

export type TargetType = {
    userId: string,
    avatarSrc: string,
    firstName: string,
    lastName: string,
    isOnline: boolean,
}

export type ChatType = {
    avatarSrc: any,
    message: string,
    writtenDate: string,
    unreadCount?: number,
    unread: boolean,
    sender: 'user' | 'target',
    target: TargetType,
}

export const Chat = ({avatarSrc, message, writtenDate, unreadCount, unread, sender, target}: ChatType) => {
    const classes = useStyles();
    const isUnreadUser = unread && sender === 'user';
    const isUnreadTarget = unread && sender === 'target';
    const [background, setBackground] = useState<'transparent' | 'rgb(174 183 194 / 12%)'>(isUnreadTarget ? 'rgb(174 183 194 / 12%)' : 'transparent')
    const [btnRemoveChatDisplay, setBtnRemoveChatDisplay] = useState<'block' | 'none'>('none');

    const handleMouseMove = () => {
        setBackground('rgb(174 183 194 / 12%)');
        setBtnRemoveChatDisplay('block');
    }
    const handleMouseLeave = () => {
        setBackground(isUnreadTarget ? 'rgb(174 183 194 / 12%)' : 'transparent');
        setBtnRemoveChatDisplay('none');
    }
    const handleRemoveChat = () => {
        alert('Remove...');
    }

    return (
        <div className={classes.chat} style={{background: background}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div style={{display: 'flex', padding: '0 28px', width: '100%'}}>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant={target.isOnline ? "dot" : "standard"}
                    style={{alignSelf: 'center'}}
                >
                    <Avatar alt="Remy Sharp" src={target.avatarSrc} style={{width: 50, height: 50}} />
                </StyledBadge>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: 15, alignSelf: 'center', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className={classes.name}>{target.firstName} {target.lastName}</div>
                        <div style={{fontSize: 13, color: 'rgb(147, 147, 147)'}}>{writtenDate}</div>
                    </div>
                    <div style={{display: 'flex', position: 'relative', marginTop: 7.5}}>
                        <Avatar alt="Remy Sharp" src={sender === 'target' ? null : avatarSrc} style={{display: sender === 'user' ? 'inherit' : 'none', width: 25, height: 25, alignSelf: 'center'}} />
                        <div style={{marginLeft: isUnreadUser ? 7.5 : sender === 'user' ? 5 : 0, background: isUnreadUser ? 'rgb(174 183 194 / 12%)' : 'transparent', lineHeight: sender === 'user' ? '25px' : 'auto', paddingLeft: sender === 'user' ? 5 : 0}} className={classes.message}>{message}</div>
                        <div style={{display: isUnreadTarget ? 'block' : 'none'}} className={classes.unreadCount}>{unreadCount}</div>
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={faTimes} style={{display: btnRemoveChatDisplay, position: 'absolute', width: 11, height: 11, marginTop: 12.5, right: 10, color: 'rgb(147, 147, 147)', zIndex: 2}} onClick={handleRemoveChat}/>
            <Link to={`/Messages/${target.userId}${tryAddPeerByUserId(target.userId)}`} style={{position: 'absolute', width: '100%', height: '100%'}}/>
        </div>
    );
};
