import React from 'react';
import {MessageTab} from "../MessageTab";
import {Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
                flexDirection: 'column',
                minWidth: 200,
                marginLeft: 15,
                height: 'max-content',
                padding: '6px 0'
            }
        }
    }),
);

export const MessageTabManager = () => {
    const classes = useStyles();

    return (
        <Paper variant='outlined' className={classes.paper}>
            <MessageTab title="All chats" selected={document.location.search === '' || document.location.search.startsWith('?tab=messages')}/>
            <MessageTab title="Unread" selected={document.location.search.startsWith('?tab=unread')}/>
        </Paper>
    );
};
