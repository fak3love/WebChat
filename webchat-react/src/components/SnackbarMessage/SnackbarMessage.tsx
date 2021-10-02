import React, {useEffect} from 'react';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Avatar} from "@material-ui/core";
import "./SnackbarMessage.css";
import {useHistory} from 'react-router-dom'
import {isEmptyOrSpaces} from "../../utils/validators";
import {RawMessage} from "../../pages/Messages/Messages";

export interface ISnackbarMessage {
    message: string;
    key: number;
}

export interface State {
    open: boolean;
    snackPack: readonly ISnackbarMessage[];
    messageInfo?: ISnackbarMessage;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%'
        },
        message: {
            width: '100%',
        }
    }),
);

export const SnackbarMessage = ({message, user}: {message: RawMessage | undefined, user: {firstName: string, lastName: string, avatar: string} | undefined}) => {
    const classes = useStyles();
    const history = useHistory();

    const [open, setOpen] = React.useState(false);

    const handleClose = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };
    const handleClick = (event: any) => {
        if (event.target.closest("#btnCloseMessageBox") !== null)
            return;

        setOpen(false);
        history.push(`/Messages/${message?.userId}?peers=${message?.userId}`);
    }

    useEffect(() => {
        if (message !== undefined && !document.location.pathname.startsWith('/Messages'))
            setOpen(true);

    }, [message]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            onClick={handleClick}
            ContentProps={{classes: classes, style: {background: 'rgb(65 65 65)', cursor: 'pointer'}}}
            message={
                <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <div style={{display: 'flex', width: '100%'}}>
                        <div style={{fontSize: 13, fontWeight: 500, width: '100%'}}>New message</div>
                        <CloseIcon id="btnCloseMessageBox" style={{width: 18, height: 18, alignSelf: 'center'}} onClick={handleClose}/>
                    </div>
                    <div style={{display: 'flex', marginTop: 8}}>
                        <Avatar src={user?.avatar} style={{width: 45, height: 45}}/>
                        <div className="sideMessageBox">
                            <div style={{fontWeight: 600, color: '#a0cfff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400}}>{user?.firstName} {user?.lastName}</div>
                            <div style={{marginTop: 5}}>
                                {message !== undefined ? (isEmptyOrSpaces(message.messageText) && message.messageImages.length > 0 ? 'sent you a private message' : message.messageText) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
};
