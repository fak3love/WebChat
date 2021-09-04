import React from 'react';
import { alpha, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import {Link} from "react-router-dom";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faGrinHearts } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import deadInsideLogo from '../../assets/images/deadinside400.jpg';
import {Button} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {NotificationButton} from "../NotificationButton";
import "./Header.css";

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
            // vertical padding + font size from searchIcon
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
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        list: {
            width: 250
        }
    }),
);

export const Header = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({left: false});
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, left: open });
    };

    const StyledBadge = withStyles((theme: Theme) =>
        createStyles({
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
        }),
    )(Badge);
    const list = () => (
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
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={faUsers} style={{width: 24, height: 24, color: 'rgb(27 146 216)'}}/>
                    </ListItemIcon>
                    <ListItemText>Friends</ListItemText>
                    <Badge color="secondary" overlap="circular" badgeContent={10} style={{marginRight: 16}}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={faPhotoVideo} style={{width: 24, height: 24, color: 'rgb(27 146 216)'}}/>
                    </ListItemIcon>
                    <ListItemText>Photos</ListItemText>
                    <Badge color="secondary" overlap="circular" badgeContent={999} style={{marginRight: 16}}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={faGrinHearts} style={{width: 24, height: 24, color: 'rgb(27 146 216)'}}/>
                    </ListItemIcon>
                    <ListItemText>Reactions</ListItemText>
                    <Badge color="secondary" overlap="circular" badgeContent={3} style={{marginRight: 16}}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FontAwesomeIcon icon={faComments} style={{width: 24, height: 24, color: 'rgb(27 146 216)'}}/>
                    </ListItemIcon>
                    <ListItemText>Comments</ListItemText>
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
                    <div className={classes.sectionDesktop} style={{position: "absolute", height: "100%", right: 0, padding: "0 5px"}}>
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
                {list()}
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
                    <MenuItem onClick={handleClose} disableTouchRipple={true} style={{width: 133, fontSize: 15}}>Settings</MenuItem>
                    <Divider style={{margin: "8px 0"}}/>
                    <MenuItem onClick={handleClose} disableTouchRipple={true} style={{width: 133, fontSize: 15}}>Sign out</MenuItem>
                </React.Fragment>
            </Menu>
        </div>
    );
}