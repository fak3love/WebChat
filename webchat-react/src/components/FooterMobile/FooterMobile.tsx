import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Badge} from "@material-ui/core";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MailIcon from '@material-ui/icons/Mail';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 'max'
        },
        sectionMobile: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        }
    }),
);

export const FooterMobile = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div className={classes.sectionMobile}>
            <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
                <BottomNavigationAction label="Photo" value="photo" icon={
                    <Badge color="secondary">
                        <AddAPhotoIcon/>
                    </Badge>
                }/>
                <BottomNavigationAction label="Messages" value="messages" icon={
                    <Badge badgeContent={21} color="secondary">
                        <MailIcon/>
                    </Badge>
                }/>
                <BottomNavigationAction label="Favorites" value="favorites" icon={
                    <Badge color="secondary">
                        <FavoriteIcon/>
                    </Badge>
                }/>
            </BottomNavigation>
        </div>
    );
};
