import React from 'react';
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            display: 'flex',
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'transparent',
            width: '100%',
            height: 50
        },
        searchIcon: {
            height: '100%',
            pointerEvents: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#93A3BC',
            padding: 8,
            alignSelf: 'center'
        },
        searchParameters: {
            padding: 8
        },
        inputRoot: {
            width: '100%',
            fontSize: 13
        },
        inputInput: {
            width: '100%',
            paddingRight: 16
        }
    }),
);

export const Searchbar = (props: any) => {
    const classes = useStyles();

    return (
        <div className={classes.search} style={props.style}>
            <SearchIcon className={classes.searchIcon} />
            <InputBase
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                onChange={props.onChange}
                value={props.value}
            />
            <IconButton style={{width: 28, height: 28, alignSelf: 'center', marginRight: 8}} disableTouchRipple={true} onClick={props.onClickToClose}>
                <FontAwesomeIcon icon={faTimes} style={{width: 16, height: 16, color: 'rgb(166, 172, 183)'}}/>
            </IconButton>
        </div>
    );
};
