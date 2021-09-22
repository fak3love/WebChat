import React from 'react';
import {Stack} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

export const LoadingScreen = ({open}: {open: boolean}) => {
    return (
        <div>
            <Backdrop
                sx={{ color: 'rgba(42,88,133,0.65)', background: '#EDEEF0', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <Stack>
                    <CircularProgress color="inherit" style={{alignSelf: 'center'}}/>
                    <h1>page loading please wait</h1>
                </Stack>
            </Backdrop>
        </div>
    );
};
