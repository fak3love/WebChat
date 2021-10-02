import React from 'react';
import {createStyles, makeStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            color: '#2a5885',
            fontSize: 13,
            maxWidth: 460,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    }),
);

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            width: 10,
            height: 10,
            borderRadius: '100%',
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
        }
    }),
)(Badge);

export type UserBlockType = {
    userId: string,
    firstName: string,
    lastName: string,
    avatarSrc: any,
    isOnline: boolean,
    info?: string
}

export const UserBlock = ({userId, firstName, lastName, avatarSrc, isOnline, info}: UserBlockType) => {
    const classes = useStyles();

    return (
        <div style={{display: 'flex'}}>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                variant={isOnline ? "dot" : "standard"}
            >
                <Link to={`/Profile/${userId}`}>
                    <Avatar alt="Remy Sharp" src={avatarSrc} style={{width: 70, height: 70}} />
                </Link>
            </StyledBadge>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 15}}>
                <Link to={`/Profile/${userId}`} className={classes.link} style={{fontWeight: 700}}>{firstName} {lastName}</Link>
                <Link to={`/Messages/${userId}?peers=${userId}`} className={classes.link} style={{margin: '-2px 0'}}>Write message</Link>
                <div style={{fontSize: 12, color: '#939393'}}>{info}</div>
            </div>
        </div>
    );
};
