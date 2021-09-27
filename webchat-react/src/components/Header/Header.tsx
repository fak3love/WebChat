import React, {useEffect, useState} from 'react';
import {alpha, makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {NotificationButton} from "../NotificationButton";
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import {Button} from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Menu from "@material-ui/core/Menu";
import {isEmptyStorage, logout} from "../../ts/authorization";
import {getProfileHeader} from "./utils";
import {MenuList} from "./MenuList";

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
        }
    }),
);

type User = {
    firstName: string,
    lastName: string,
    avatar?: string
}

const defaultUser: User = {
    firstName: 'FirstName',
    lastName: 'LastName',
    avatar: undefined
}

export const Header = ({handleUpdate}: {handleUpdate: any}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<User>(defaultUser);
    const [state, setState] = useState({left: false});

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift'))
            return;

        setState({ ...state, left: open });
    };

    const handleUpdateHeader = (firstName: string, lastName: string, avatar: string | undefined) => {
        setUser({...user, firstName: firstName, lastName: lastName, avatar: avatar});
    }

    useEffect(() => {
        handleUpdate.current = handleUpdateHeader;

        if (document.location.pathname !== '/Authorization' && !isEmptyStorage()) {
            getProfileHeader().then(profile => {
                setUser(profile === undefined ? user : profile);
            });
        }
    }, []);

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
                        <Button id="profile-menu" aria-controls="menu" aria-haspopup="true" style={{color: '#edeef0'}} disableTouchRipple={true} onClick={(event: any) => setAnchorEl(event.currentTarget)}>
                            <div style={{fontWeight: 500, maxWidth: 220, alignSelf: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 16, textTransform: 'none'}}>{user.firstName}</div>
                            <Avatar style={{width: 38, height: 38, margin: "0 7.5px 0 10px", alignSelf: "center"}} src={user.avatar}/>
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
                <MenuList firstName={user.firstName} lastName={user.lastName} avatar={user.avatar} handleToggleDrawer={toggleDrawer}/>
            </SwipeableDrawer>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                style={{marginTop: '48px'}}
            >
                <React.Fragment>
                    <MenuItem onClick={() => setAnchorEl(null)} disableTouchRipple={true} style={{width: 133, fontSize: 14}}>
                        Settings
                        <Link to="/Settings" style={{position: 'absolute', marginLeft: -16, display: 'block', width: '100%', height: '100%'}}/>
                    </MenuItem>
                    <Divider style={{margin: "8px 0"}}/>
                    <MenuItem onClick={() => {setAnchorEl(null); logout(); document.location.pathname = "/Authorization"}} disableTouchRipple={true} style={{width: 133, fontSize: 14}}>Sign out</MenuItem>
                </React.Fragment>
            </Menu>
        </div>
    );
}