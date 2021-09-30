import React from 'react';
import Badge from "@material-ui/core/Badge";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        customBadge: {
            backgroundColor: "#99A2AD",
            color: "white"
        }
    }),
);

export const CustomBadge = ({badgeProps, children}: {badgeProps: any, children?: any}) => {
    const classes = useStyles();

    return (
        <Badge {...badgeProps} classes={{badge: classes.customBadge}}>
            {children}
        </Badge>
    );
};
