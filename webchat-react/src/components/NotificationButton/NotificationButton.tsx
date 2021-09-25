import React, {useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import {Button} from "@material-ui/core";
import {Scrollbars} from 'react-custom-scrollbars';
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Menu from "@material-ui/core/Menu";
import "./NotificationButton.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            display: 'flex',
            justifyContent: 'center',
            width: 400,
            height: 325,
            marginTop: 48,
            overflow: 'hidden',
            [theme.breakpoints.down('sm')]: {
                marginTop: 40,
                height: 325,
                width: '100%',
            }
        },
        list: {
            width: '100%',
            height: 'auto',
            padding: 8,
        }
    }),
);

type NotificationBlockType = {
    notificationType: 'like' | 'comment' | 'add-friend',
    subjectType: 'photo' | 'comment' | 'friend',
    subjectLink: string,
    targetLink: string,
    targetName: string,
    date: string
}

export const NotificationButton = () => {
    const classes = useStyles();
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<Array<NotificationBlockType>>([
        {notificationType: "comment", subjectType: "comment", subjectLink: "/Profile", targetLink: "/Profile", targetName: "Faust King", date: "10.10.2009"},
        {notificationType: "comment", subjectType: "photo", subjectLink: "/Profile", targetLink: "/Profile", targetName: "Faust King", date: "07.09.2010"},
        {notificationType: "like", subjectType: "comment", subjectLink: "/Profile", targetLink: "/Profile", targetName: "Faust King", date: "24.09.2011"},
        {notificationType: "like", subjectType: "photo", subjectLink: "/Profile", targetLink: "/Profile", targetName: "Faust King", date: "12.10.2011"},
        {notificationType: "add-friend", subjectType: "friend", subjectLink: "/Profile", targetLink: "/Profile", targetName: "Faust King", date: "10.10.2012"}
    ]);

    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };
    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };
    const handleClearNotifications = () => {
        setNotifications([]);
    }

    const NotificationBlock = ({notificationType, subjectType, subjectLink, targetLink, targetName, date}: NotificationBlockType) => {
        let backColor: string = "";
        let message: string = "";
        let icon: JSX.Element;

        switch (notificationType) {
            case "like":
                backColor = '#FDECEA';
                message = 'liked your ' + subjectType;
                icon = <FavoriteBorderIcon style={{marginLeft: 5, marginTop: 5, width: 20, height: 20, color: 'rgb(245 0 87)'}}/>
                break;
            case "comment":
                backColor = '#E8F4FD';

                if (subjectType === 'comment')
                    message = 'replied to your comment';

                if (subjectType === 'photo')
                    message = 'commented on your photo';

                icon = <FontAwesomeIcon style={{marginLeft: 5, marginTop: 5, width: 20, height: 20, color: 'rgb(27 146 216)'}} icon={faComment}/>
                break;
            case "add-friend":
                backColor = 'rgb(237 247 237)';
                message = 'added as a friend';
                icon = <FontAwesomeIcon style={{marginLeft: 5, marginTop: 5, width: 20, height: 20, color: '#4caf50'}} icon={faUser}/>
                break;
        }

        return (
            <div style={{display: 'flex', height: 50, background: backColor, margin: '4px 0', borderRadius: 4}} onClick={handleNotificationClose}>
                <div style={{display: 'flex', width: 50}}>
                    <div style={{borderRadius: 360, marginLeft: 10, marginTop: 10, width: 30, height: 30, background: 'white'}}>
                        {icon}
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10, width: '100%', alignSelf: 'center'}}>
                    <div className="NotificationButton__description">
                        <Link to={targetLink} className="NotificationButton__link">
                            {targetName}
                        </Link>
                        <br/>
                        <Link to={subjectLink} className="NotificationButton__no-link">
                            {message}
                        </Link>
                    </div>
                </div>
                <div style={{fontSize: 12, bottom: 0, alignSelf: 'flex-end', margin: '0 5px 5px 0', color: 'rgba(0, 0, 0, 0.7)'}}>
                    {date}
                </div>
            </div>
        );
    }

    return (
        <div className="NotificationButton">
            <IconButton aria-controls="notification-menu" aria-label="show 17 new notifications" color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={17} color="secondary">
                    <FontAwesomeIcon icon={faBell} style={{width: 20, height: 20}}/>
                </Badge>
            </IconButton>
            <Menu
                id="notification-menu"
                anchorEl={notificationAnchorEl}
                keepMounted
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                classes={classes}
            >
                <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{fontSize: 14, fontWeight: 500, alignSelf: 'center', color: 'rgb(78 106 123)'}}>Notifications</div>
                        <IconButton style={{width: 32, height: 32}}>
                            <FontAwesomeIcon icon={faCog} style={{width: 18, height: 18, color: 'rgb(78 106 123)'}}/>
                        </IconButton>
                    </div>
                    <Scrollbars style={{marginTop: 8}} autoHide autoHideDuration={400}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {notifications.length > 0 ? notifications.map(block => {
                                return <NotificationBlock key={block.date}
                                                          notificationType={block.notificationType}
                                                          subjectType={block.subjectType}
                                                          subjectLink={block.subjectLink}
                                                          targetLink={block.targetLink}
                                                          targetName={block.targetName}
                                                          date={block.date}
                                />
                            }) : 'Notification list is empty'}
                        </div>
                    </Scrollbars>
                    <Button style={{textTransform: 'none', fontWeight: 400, alignSelf: 'flex-end'}} onClick={handleClearNotifications}>
                        clear all
                    </Button>
                </div>
            </Menu>
        </div>
    );
};
