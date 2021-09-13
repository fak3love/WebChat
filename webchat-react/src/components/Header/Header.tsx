import React, {useState} from 'react';
import {alpha, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {NotificationButton} from "../NotificationButton";
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import {faGrinHearts} from '@fortawesome/free-regular-svg-icons'
import {faCommentDots} from '@fortawesome/free-regular-svg-icons'
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import {Button} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from "@material-ui/core/Menu";
import deadInsideLogo from '../../assets/images/deadinside400.jpg';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
            color: 'white'
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
                width: '165px',
                textDecoration: 'none',
                color: '#EDEEF0'
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        list: {
            width: 250
        }
    }),
);

export const Header = () => {
    const classes = useStyles();
    const [state, setState] = useState({left: false});
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const StyledBadge = withStyles((theme: Theme) => createStyles({
            badge: {
                backgroundColor: '#44b700',
                color: '#44b700',
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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift'))
            return;

        setState({ ...state, left: open });
    };

    const MenuList = () => {
        return (
            <div
                className={classes.list}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
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
                            <Avatar src={deadInsideLogo}/>
                        </StyledBadge>
                        <div style={{marginLeft: 16, display: "flex", flexDirection: "column"}}>
                            <div style={{display: "flex", fontWeight: 500}}>
                                <div style={{margin: "0 5px 0 0", maxWidth: 80,  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>Faust</div>
                                <div style={{maxWidth: 80,  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>King</div>
                            </div>
                            <span style={{fontSize: 13, color: "#44b700"}}>online</span>
                        </div>
                        <ChevronRightIcon style={{marginLeft: 'auto', color: '#B0B7BF'}}/>
                        <Link to="/#profileId" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <path id="message_outline_20__Shape" opacity=".4" d="M0 0h20v20H0z"/>
                                    <path fill="rgb(27, 146, 216)" fill-rule="nonzero" d="M6.83 15.75c.2-.23.53-.31.82-.2.81.3 1.7.45 2.6.45 3.77 0 6.75-2.7 6.75-6s-2.98-6-6.75-6S3.5 6.7 3.5 10c0 1.21.4 2.37 1.14 3.35.1.14.16.31.15.49-.04.76-.4 1.78-1.08 3.13 1.48-.11 2.5-.53 3.12-1.22zM3.24 18.5a1.2 1.2 0 01-1.1-1.77A10.77 10.77 0 003.26 14 7 7 0 012 10c0-4.17 3.68-7.5 8.25-7.5S18.5 5.83 18.5 10s-3.68 7.5-8.25 7.5c-.92 0-1.81-.13-2.66-.4-1 .89-2.46 1.34-4.35 1.4z"/>
                                </g>
                            </svg>
                        </ListItemIcon>
                        <ListItemText>Messages</ListItemText>
                        <Badge color="secondary" overlap="circular" badgeContent={999} style={{marginRight: 16}}/>
                        <Link to="/Messages" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <svg width="24" height="24" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <g fill="rgb(27, 146, 216)">
                                    <g clip-rule="evenodd" fill-rule="evenodd">
                                        <path d="M6.25 3.5a3 3 0 100 6 3 3 0 000-6zm-1.5 3a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM2.69 11.57c.96-.55 2.22-.82 3.56-.82s2.6.27 3.56.82c.98.56 1.69 1.47 1.69 2.68 0 .7-.28 1.3-.78 1.71-.48.39-1.1.54-1.72.54H3.5c-.61 0-1.24-.15-1.72-.54-.5-.4-.78-1-.78-1.71 0-1.21.71-2.12 1.69-2.68zm.75 1.3c-.65.37-.94.84-.94 1.38 0 .3.1.44.22.54.14.11.4.21.78.21H9c.39 0 .64-.1.78-.21.12-.1.22-.25.22-.54 0-.54-.29-1-.94-1.38-.66-.39-1.65-.62-2.81-.62s-2.15.23-2.81.62zM13.75 3.5a3 3 0 100 6 3 3 0 000-6zm-1.5 3a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"/>
                                    </g>
                                    <path d="M13.75 12.25c-.23 0-.45.01-.68.03a.75.75 0 11-.14-1.49c.27-.03.54-.04.82-.04 1.34 0 2.6.27 3.56.82.98.56 1.69 1.47 1.69 2.68 0 .7-.28 1.3-.78 1.71-.48.39-1.1.54-1.72.54h-3a.75.75 0 010-1.5h3c.39 0 .64-.1.78-.21.12-.1.22-.25.22-.54 0-.54-.29-1-.94-1.38a5.77 5.77 0 00-2.81-.62z"/>
                                </g>
                            </svg>
                        </ListItemIcon>
                        <ListItemText>Friends</ListItemText>
                        <Badge color="secondary" overlap="circular" badgeContent={10} style={{marginRight: 16}}/>
                        <Link to="/Friends?#userId" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <svg width="24" height="24" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill="rgb(27, 146, 216)" fill-rule="evenodd" clip-rule="evenodd" d="M6.84 16.44c.76.06 1.74.06 3.16.06 1.42 0 2.4 0 3.16-.06a3.75 3.75 0 001.43-.32 3.5 3.5 0 001.53-1.53c.15-.29.26-.69.32-1.43l.03-.63-1.3-1.3c-.3-.3-.5-.5-.67-.64a.86.86 0 00-.27-.18.75.75 0 00-.46 0 .86.86 0 00-.27.18c-.16.13-.36.33-.67.64l-2.3 2.3a.75.75 0 01-1.06 0l-.3-.3c-.3-.3-.5-.5-.67-.64a.86.86 0 00-.27-.18.75.75 0 00-.46 0 .86.86 0 00-.27.18c-.16.13-.36.33-.67.64L4.56 15.5c.25.24.53.45.85.6.29.16.69.27 1.43.33zm9.39-6.27l.27.27V10c0-1.42 0-2.4-.06-3.16a3.75 3.75 0 00-.32-1.43 3.5 3.5 0 00-1.53-1.53 3.75 3.75 0 00-1.43-.32A43.2 43.2 0 0010 3.5c-1.42 0-2.4 0-3.16.06-.74.06-1.14.17-1.43.32a3.5 3.5 0 00-1.53 1.53c-.15.29-.26.69-.32 1.43A43.2 43.2 0 003.5 10c0 1.42 0 2.4.06 3.16.04.47.1.8.17 1.05l2.04-2.04.02-.02c.28-.28.52-.52.74-.7.23-.2.47-.37.77-.47.46-.15.94-.15 1.4 0 .3.1.54.27.77.46.16.14.34.3.53.5l1.77-1.77.02-.02c.28-.28.52-.52.74-.7.23-.2.47-.37.77-.47.46-.15.94-.15 1.4 0 .3.1.54.27.77.46.22.19.46.43.74.7zM2.54 4.73C2 5.8 2 7.2 2 10c0 2.8 0 4.2.54 5.27a5 5 0 002.19 2.19C5.8 18 7.2 18 10 18c2.8 0 4.2 0 5.27-.54a5 5 0 002.19-2.19C18 14.2 18 12.8 18 10c0-2.8 0-4.2-.55-5.27a5 5 0 00-2.18-2.19C14.2 2 12.8 2 10 2c-2.8 0-4.2 0-5.27.54a5 5 0 00-2.19 2.19zM7.25 6a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"/>
                            </svg>
                        </ListItemIcon>
                        <ListItemText>Photos</ListItemText>
                        <Badge color="secondary" overlap="circular" badgeContent={999} style={{marginRight: 16}}/>
                        <Link to="/Photos?#userId" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faSignOutAlt} style={{width: 24, height: 24}}/>
                        </ListItemIcon>
                        <ListItemText>Sign out</ListItemText>
                    </ListItem>
                </List>
            </div>
        );
    }

    return (
        <div className={classes.grow}>
            <AppBar position="static" elevation={0} color="transparent">
                <Toolbar>
                    <Link className={classes.title} to="/Profile">
                        <FontAwesomeIcon icon={faPaperPlane} style={{width: 24, height: 24, marginRight: 16}}/>
                        <Typography variant="h6" noWrap>
                            WebChat
                        </Typography>
                    </Link>
                    <IconButton color="inherit" className={classes.sectionMobile} style={{margin: '0 16px 0 -16px'}} onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <NotificationButton/>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop} style={{position: "absolute", height: "100%", right: 0, padding: 0}}>
                        <Button id="profile-menu" aria-controls="menu" aria-haspopup="true" style={{color: '#edeef0'}} disableTouchRipple={true} onClick={handleClick}>
                            <div style={{fontWeight: 500, maxWidth: 220, alignSelf: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 16, textTransform: 'none'}}>Faust</div>
                            <Avatar style={{width: 38, height: 38, margin: "0 7.5px 0 10px", alignSelf: "center"}} src={deadInsideLogo}/>
                            <ExpandMoreIcon style={{alignSelf: "center", width: 20, height: 20}}/>
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                anchor={'left'}
                open={state.left}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <MenuList/>
            </SwipeableDrawer>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{marginTop: '48px'}}
            >
                <React.Fragment>
                    <MenuItem onClick={handleClose} disableTouchRipple={true} style={{width: 133, fontSize: 14}}>
                        Settings
                        <Link to="/Settings" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </MenuItem>
                    <Divider style={{margin: "8px 0"}}/>
                    <MenuItem onClick={handleClose} disableTouchRipple={true} style={{width: 133, fontSize: 14}}>Sign out</MenuItem>
                </React.Fragment>
            </Menu>
        </div>
    );
}