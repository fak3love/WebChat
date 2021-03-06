import React, {useContext, useEffect, useState} from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";
import {goToAuthorization} from "../../../utils/common";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import "./MenuList.css";
import {CustomBadge} from "../../CustomBadge";
import {SignalRContext} from "../../../contextes/SignalRContext";

const StyledBadge = withStyles((theme: Theme) => createStyles({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700c7',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);

export const MenuList = ({firstName, lastName, avatar, handleToggleDrawer}: {firstName: string, lastName: string, avatar?: string, handleToggleDrawer: any}) => {
    const signalRContext = useContext(SignalRContext);

    return (
        <div
            className="list"
            role="presentation"
            onClick={handleToggleDrawer(false)}
            onKeyDown={handleToggleDrawer(false)}
        >
            <List>
                <ListItem button>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        variant="dot"
                    >
                        <Avatar src={avatar}/>
                    </StyledBadge>
                    <div className="list__userInfo">
                        <div className="list__userWrapper">
                            <div className="list__userFirstName">{firstName}</div>
                            <div className="list__userLastName">{lastName}</div>
                        </div>
                        <span className="list__userOnlineStatus">online</span>
                    </div>
                    <ChevronRightIcon style={{marginLeft: 'auto', color: '#B0B7BF'}}/>
                    <Link to="/Profile" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <path id="message_outline_20__Shape" opacity=".4" d="M0 0h20v20H0z"/>
                                <path fill="rgb(27, 146, 216)" fillRule="nonzero" d="M6.83 15.75c.2-.23.53-.31.82-.2.81.3 1.7.45 2.6.45 3.77 0 6.75-2.7 6.75-6s-2.98-6-6.75-6S3.5 6.7 3.5 10c0 1.21.4 2.37 1.14 3.35.1.14.16.31.15.49-.04.76-.4 1.78-1.08 3.13 1.48-.11 2.5-.53 3.12-1.22zM3.24 18.5a1.2 1.2 0 01-1.1-1.77A10.77 10.77 0 003.26 14 7 7 0 012 10c0-4.17 3.68-7.5 8.25-7.5S18.5 5.83 18.5 10s-3.68 7.5-8.25 7.5c-.92 0-1.81-.13-2.66-.4-1 .89-2.46 1.34-4.35 1.4z"/>
                            </g>
                        </svg>
                    </ListItemIcon>
                    <ListItemText>Messages</ListItemText>
                    <CustomBadge badgeProps={{overlap: 'circular', badgeContent: signalRContext.uniqueMessageUserIds.length, style: {marginRight: 16}}}/>
                    <Link to="/Messages" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <svg width="24" height="24" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <g fill="rgb(27, 146, 216)">
                                <g clipRule="evenodd" fillRule="evenodd">
                                    <path d="M6.25 3.5a3 3 0 100 6 3 3 0 000-6zm-1.5 3a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM2.69 11.57c.96-.55 2.22-.82 3.56-.82s2.6.27 3.56.82c.98.56 1.69 1.47 1.69 2.68 0 .7-.28 1.3-.78 1.71-.48.39-1.1.54-1.72.54H3.5c-.61 0-1.24-.15-1.72-.54-.5-.4-.78-1-.78-1.71 0-1.21.71-2.12 1.69-2.68zm.75 1.3c-.65.37-.94.84-.94 1.38 0 .3.1.44.22.54.14.11.4.21.78.21H9c.39 0 .64-.1.78-.21.12-.1.22-.25.22-.54 0-.54-.29-1-.94-1.38-.66-.39-1.65-.62-2.81-.62s-2.15.23-2.81.62zM13.75 3.5a3 3 0 100 6 3 3 0 000-6zm-1.5 3a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"/>
                                </g>
                                <path d="M13.75 12.25c-.23 0-.45.01-.68.03a.75.75 0 11-.14-1.49c.27-.03.54-.04.82-.04 1.34 0 2.6.27 3.56.82.98.56 1.69 1.47 1.69 2.68 0 .7-.28 1.3-.78 1.71-.48.39-1.1.54-1.72.54h-3a.75.75 0 010-1.5h3c.39 0 .64-.1.78-.21.12-.1.22-.25.22-.54 0-.54-.29-1-.94-1.38a5.77 5.77 0 00-2.81-.62z"/>
                            </g>
                        </svg>
                    </ListItemIcon>
                    <ListItemText>Friends</ListItemText>
                    <CustomBadge badgeProps={{overlap: 'circular', badgeContent: 0, style: {marginRight: 16}}}/>
                    <Link to="/Friends" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <svg width="24" height="24" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill="rgb(27, 146, 216)" fillRule="evenodd" clipRule="evenodd" d="M6.84 16.44c.76.06 1.74.06 3.16.06 1.42 0 2.4 0 3.16-.06a3.75 3.75 0 001.43-.32 3.5 3.5 0 001.53-1.53c.15-.29.26-.69.32-1.43l.03-.63-1.3-1.3c-.3-.3-.5-.5-.67-.64a.86.86 0 00-.27-.18.75.75 0 00-.46 0 .86.86 0 00-.27.18c-.16.13-.36.33-.67.64l-2.3 2.3a.75.75 0 01-1.06 0l-.3-.3c-.3-.3-.5-.5-.67-.64a.86.86 0 00-.27-.18.75.75 0 00-.46 0 .86.86 0 00-.27.18c-.16.13-.36.33-.67.64L4.56 15.5c.25.24.53.45.85.6.29.16.69.27 1.43.33zm9.39-6.27l.27.27V10c0-1.42 0-2.4-.06-3.16a3.75 3.75 0 00-.32-1.43 3.5 3.5 0 00-1.53-1.53 3.75 3.75 0 00-1.43-.32A43.2 43.2 0 0010 3.5c-1.42 0-2.4 0-3.16.06-.74.06-1.14.17-1.43.32a3.5 3.5 0 00-1.53 1.53c-.15.29-.26.69-.32 1.43A43.2 43.2 0 003.5 10c0 1.42 0 2.4.06 3.16.04.47.1.8.17 1.05l2.04-2.04.02-.02c.28-.28.52-.52.74-.7.23-.2.47-.37.77-.47.46-.15.94-.15 1.4 0 .3.1.54.27.77.46.16.14.34.3.53.5l1.77-1.77.02-.02c.28-.28.52-.52.74-.7.23-.2.47-.37.77-.47.46-.15.94-.15 1.4 0 .3.1.54.27.77.46.22.19.46.43.74.7zM2.54 4.73C2 5.8 2 7.2 2 10c0 2.8 0 4.2.54 5.27a5 5 0 002.19 2.19C5.8 18 7.2 18 10 18c2.8 0 4.2 0 5.27-.54a5 5 0 002.19-2.19C18 14.2 18 12.8 18 10c0-2.8 0-4.2-.55-5.27a5 5 0 00-2.18-2.19C14.2 2 12.8 2 10 2c-2.8 0-4.2 0-5.27.54a5 5 0 00-2.19 2.19zM7.25 6a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"/>
                        </svg>
                    </ListItemIcon>
                    <ListItemText>Photos</ListItemText>
                    <CustomBadge badgeProps={{overlap: 'circular', badgeContent: 0, style: {marginRight: 16}}}/>
                    <Link to="/Photos" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => {goToAuthorization()}}>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{width: 24, height: 24}}/>
                    </ListItemIcon>
                    <ListItemText>Sign out</ListItemText>
                </ListItem>
            </List>
        </div>
    );
}