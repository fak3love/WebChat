import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {Button, Divider} from "@material-ui/core";
import {Link} from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";
import {UserBlock} from "../../components/UserBlock";
import moment from "moment";
import {LoadingScreen} from "../../components/LoadingScreen";
import {getFamiliars} from "./utils";
import {getVisitorId, isVisitor} from "../../utils/common";
import {getUserId} from "../../ts/authorization";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        sectionDesktop: {
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
                width: 600
            },
        },
        tabContainerRoot: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #dce1e6',
        },
        btnFind: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'grid',
            },
        },
        appBarRoot: {
            display: 'flex',
            flexDirection: 'row',
            boxShadow: 'none',
            borderBottom: '1px solid #dce1e6',
            background: '#fafbfc',
            justifyContent: 'space-around',
        },
        tabs: {
            background: '#fafbfc',
            width: 295,
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                width: 'auto',
            },
        },
        indicator: {
            background: '#5181b8'
        },
        friendBlockLink: {
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

const useTabStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: 'black',
            textTransform: 'none',
            fontWeight: 400,
            fontSize: 14,
            padding: 6,
            minWidth: 130
        },
        wrapper: {
            flexDirection: 'row',
            justifyContent: 'space-around'
        }
    }),
);

export type Familiar = {
    userId: string,
    firstName: string,
    lastName: string,
    isOnline: boolean,
    avatar?: string,
    modifiedDate: string
}

export const Friends = () => {
    const classes = useStyles();
    const tabClasses = useTabStyles();
    const [loading, setLoading] = useState<boolean>(true);
    const [value, setValue] = React.useState(document.location.pathname.startsWith("/Friends") ? 0 : document.location.pathname.startsWith("/Followers") ? 1 : 2);
    const [friends, setFriends] = useState<Familiar[]>([]);
    const [followers, setFollowers] = useState<Familiar[]>([]);
    const [subscriptions, setSubscriptions] = useState<Familiar[]>([]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const TabLabel = ({name, count}: {name: string, count: number}) => {
        return (
            <React.Fragment>
                <div>{name}</div>
                <div style={{color: '#939393'}}>{count}</div>
            </React.Fragment>
        );
    }

    useEffect(() => {
        const visitor = isVisitor('/Friends')
        const visitorId = getVisitorId();
        const mainUserId = getUserId();

        Promise.all([
            getFamiliars('GetFriends', visitor ? visitorId : mainUserId),
            getFamiliars('GetFollowers', visitor ? visitorId : mainUserId),
            getFamiliars('GetSubscriptions', visitor ? visitorId : mainUserId)
        ]).then(result => {
            setFriends(result[0] !== undefined ? result[0] : []);
            setFollowers(result[1] !== undefined ? result[1] : []);
            setSubscriptions(result[2] !== undefined ? result[2] : []);
            setLoading(false);
        })
    }, []);

    if (loading)
        return <LoadingScreen open={loading}/>

    return (
        <React.Fragment>
            <div className={classes.sectionDesktop}>
                <div className={classes.tabContainerRoot}>
                    <AppBar position="static" classes={{root: classes.appBarRoot}}>
                        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="simple tabs example" indicatorColor="secondary" classes={classes} className={classes.tabs}>
                            <Tab label={<TabLabel name="All friends" count={friends.length}/>} {...a11yProps(0)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Followers" count={followers.length}/>} {...a11yProps(1)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Subscriptions" count={subscriptions.length}/>} {...a11yProps(2)} classes={tabClasses} disableTouchRipple={true}/>
                        </Tabs>
                        <Button className={classes.btnFind} variant="contained" color="primary" style={{width: 100, height: 26, alignSelf: 'center', fontSize: 13, textTransform: 'none', padding: 0, fontWeight: 400, background: '#5181b8'}} disableTouchRipple={true}>
                            Find friends
                            <Link to="/Search" style={{position: 'absolute', width: '100%', height: '100%', left: 0}}/>
                        </Button>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Scrollbars style={{height: 450}}>
                            {friends.map((familiar, index) => {
                                return (
                                    <div key={familiar.userId}>
                                        <UserBlock userId={familiar.userId}  firstName={familiar.firstName} lastName={familiar.lastName} isOnline={familiar.isOnline} avatarSrc={familiar.avatar} info={moment(familiar.modifiedDate).startOf('minutes').fromNow()}/>
                                        {index < friends.length - 1 ? <Divider style={{margin: '24px 0'}}/> : ''}
                                    </div>
                                )
                            })}
                        </Scrollbars>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Scrollbars style={{height: 450}}>
                            {followers.map((familiar, index) => {
                                return (
                                    <div key={familiar.userId}>
                                        <UserBlock userId={familiar.userId}  firstName={familiar.firstName} lastName={familiar.lastName} isOnline={familiar.isOnline} avatarSrc={familiar.avatar} info={moment(familiar.modifiedDate).startOf('minutes').fromNow()}/>
                                        {index < friends.length - 1 ? <Divider style={{margin: '24px 0'}}/> : ''}
                                    </div>
                                )
                            })}
                        </Scrollbars>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Scrollbars style={{height: 450}}>
                            {subscriptions.map((familiar, index) => {
                                return (
                                    <div key={familiar.userId}>
                                        <UserBlock userId={familiar.userId}  firstName={familiar.firstName} lastName={familiar.lastName} isOnline={familiar.isOnline} avatarSrc={familiar.avatar} info={moment(familiar.modifiedDate).startOf('minutes').fromNow()}/>
                                        {index < friends.length - 1 ? <Divider style={{margin: '24px 0'}}/> : ''}
                                    </div>
                                )
                            })}
                        </Scrollbars>
                    </TabPanel>
                </div>
            </div>
        </React.Fragment>
    );
};
