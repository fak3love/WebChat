import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Button, Divider} from "@material-ui/core";
import {Link} from "react-router-dom";
import avatar1 from "../../assets/images/avatar2.jpg";
import avatar2 from "../../assets/images/deadinside400.jpg";
import {getTimeDurationByDate} from "../../utils/dates";
import Scrollbars from "react-custom-scrollbars";
import {UserBlock} from "../../components/UserBlock";

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
                    <Typography>{children}</Typography>
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
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                width: 600
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        tabContainerRoot: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #dce1e6',
        },
        appBar: {
            display: 'flex',
            flexDirection: 'row',
            boxShadow: 'none',
            borderBottom: '1px solid #dce1e6',
            background: '#fafbfc',
            justifyContent: 'space-around',
        },
        tabs: {
            background: '#fafbfc'
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

export const Friends = () => {
    const classes = useStyles();
    const tabClasses = useTabStyles();
    const [value, setValue] = React.useState(document.location.pathname === "/Friends" ? 0 : document.location.pathname === "/Followers" ? 1 : 2);

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

    return (
        <React.Fragment>
            <div className={classes.sectionDesktop}>
                <div className={classes.tabContainerRoot}>
                    <AppBar position="static" className={classes.appBar}>
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" indicatorColor="secondary" classes={classes} className={classes.tabs}>
                            <Tab label={<TabLabel name="All friends" count={14}/>} {...a11yProps(0)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Followers" count={19}/>} {...a11yProps(1)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Subscriptions" count={16}/>} {...a11yProps(2)} classes={tabClasses} disableTouchRipple={true}/>
                        </Tabs>
                        <Button variant="contained" color="primary" style={{width: 100, height: 26, alignSelf: 'center', fontSize: 13, textTransform: 'none', padding: 0, fontWeight: 400, background: '#5181b8'}} disableTouchRipple={true}>
                            Find friends
                            <Link to="/Search" style={{position: 'absolute', width: '100%', height: '100%'}}/>
                        </Button>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 6, 1), endDate: new Date()})}/>
                        <Divider style={{margin: '24px 0'}}/>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 8), endDate: new Date()})}/>
                        <Divider style={{margin: '24px 0'}}/>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 8, 13, 0, 1), endDate: new Date(), include: 'time'})}/>
                        <Divider style={{margin: '24px 0'}}/>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 2), endDate: new Date()})}/>
                        <Divider style={{margin: '24px 0'}}/>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 7), endDate: new Date()})}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 6, 1), endDate: new Date()})}/>
                        <Divider style={{margin: '24px 0'}}/>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 8), endDate: new Date()})}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 6, 1), endDate: new Date()})}/>
                    </TabPanel>
                </div>
            </div>
            <div className={classes.sectionMobile}>
                <div className={classes.tabContainerRoot}>
                    <AppBar position="static" className={classes.appBar}>
                        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="simple tabs example" indicatorColor="secondary" classes={classes} className={classes.tabs} style={{width: 295}}>
                            <Tab label={<TabLabel name="All friends" count={14}/>} {...a11yProps(0)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Followers" count={19}/>} {...a11yProps(1)} classes={tabClasses} disableTouchRipple={true}/>
                            <Tab label={<TabLabel name="Subscriptions" count={16}/>} {...a11yProps(2)} classes={tabClasses} disableTouchRipple={true}/>
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Scrollbars style={{height: 450}}>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 6, 1), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 8), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 8, 9), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 2), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 7), endDate: new Date()})}/>
                        </Scrollbars>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Scrollbars style={{height: 450}}>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 8, 9), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 2), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 7), endDate: new Date()})}/>
                        </Scrollbars>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Scrollbars style={{height: 450}}>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={true} avatarSrc={avatar1} info={getTimeDurationByDate({startDate: new Date(2021, 6, 1), endDate: new Date()})}/>
                            <Divider style={{margin: '24px 0'}}/>
                            <UserBlock userId="faust"  firstName="Faust" lastName="King" isOnline={false} avatarSrc={avatar2} info={getTimeDurationByDate({startDate: new Date(2021, 8, 8), endDate: new Date()})}/>
                        </Scrollbars>
                    </TabPanel>
                </div>
            </div>
        </React.Fragment>
    );
};
