import React, {useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {Paper, Button, Divider, IconButton} from "@material-ui/core";
import Scrollbars from "react-custom-scrollbars";
import avatar from '../../assets/images/avatar2.jpg';
import avatar2 from '../../assets/images/deadinside400.jpg';
import {ImageViewer} from "../../components/ImageViewer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        paper: {
            display: 'flex',
            height: 600,
            padding: 24,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        scrollbars: {
            width: '100%',
            height: 600,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        imageItem: {
            position: 'relative',
            maxHeight: 200,
            cursor: 'pointer',
            margin: 5,
            [theme.breakpoints.down('sm')]: {
                height: 100,
            }
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
        },
        backdropImgSection: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            background: '#222222',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        friendBlockLink: {
            color: '#2a5885',
            fontSize: 13,
            maxWidth: 460,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer'
            }
        },
        btnClose: {
            display: 'block',
            position: 'absolute',
            right: 0,
            top: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        },
        btnCloseMobile: {
            display: 'none',
            [theme.breakpoints.down('sm')]: {
                display: 'block',
                position: 'absolute',
                right: 0,
                top: 0,
            }
        }
    }),
);

export const Photos = () => {
    const classes = useStyles();
    const [openImageViewer, setOpenImageViewer] = useState<boolean>(false);

    const ImageItem = ({img}: {img: any}) => {
        return (
            <img src={img} alt="" className={classes.imageItem} onClick={() => setOpenImageViewer(true)}/>
        );
    }

    const ImageSection = ({title, children}: {title: string, children?: JSX.Element | JSX.Element[]}) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{marginLeft: 5, marginBottom: 12, fontSize: 13, fontWeight: 500, color: '#626d7a'}}>{title}</div>
                <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: 12}}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Paper variant="outlined" className={classes.paper}>
                <Scrollbars className={classes.scrollbars}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <ImageSection title="20 September 2020">
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                        </ImageSection>
                        <ImageSection title="20 September 2021">
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar}/>
                            <ImageItem img={avatar2}/>
                            <ImageItem img={avatar2}/>
                        </ImageSection>
                    </div>
                </Scrollbars>
            </Paper>
            <ImageViewer userId="1" photoId="1" isOpen={openImageViewer} closeClick={() => setOpenImageViewer(false)}/>
        </div>
    );
};
