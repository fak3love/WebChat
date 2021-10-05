import React, {useContext, useEffect, useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Scrollbars from "react-custom-scrollbars";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {ImageViewer} from "../../components/ImageViewer";
import {Tooltip} from "@mui/material";
import moment from "moment";
import {get} from "../../ts/requests";
import {getUserId, headers} from "../../ts/authorization";
import {getVisitorId, isVisitor} from "../../utils/common";
import {LoadingScreen} from "../../components/LoadingScreen";
import {LayoutContext} from "../../components/Layout/Layout";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '95%',
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        paper: {
            display: 'flex',
            height: '95%',
            padding: 24,
            [theme.breakpoints.down('sm')]: {
                height: 500,
            }
        },
        scrollbars: {
            width: '100%',
            height: '95%',
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

type Image = {
    id: string,
    slug: string,
    src: string,
    createdAt: string
}

export const Photos = () => {
    const classes = useStyles();
    const [openImageViewer, setOpenImageViewer] = useState<boolean>(false);
    const [images, setImages] = useState<Image[]>([]);
    const [loadingTimeout, setLoadingTimeout] = useState<number>(0);
    const [loadFrom, setLoadFrom] = useState<number>(0);
    const [hasNoPhotos, setHasNoPhotos] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<{slug: string, src: string}>();
    const [loading, setLoading] = useState<boolean>(true);

    const layoutValue = useContext(LayoutContext);

    const loadImages = () => {
        clearTimeout(loadingTimeout);

        const timeoutId: any = setTimeout(async () => {
            const response = await get({url: `UserPhotos/GetPhotos/${isVisitor('/Photos') ? getVisitorId() : getUserId()}?loadFrom=${loadFrom}`, headers: headers});

            if (response.ok) {
                const json = await response.json();

                setImages(images.concat(json));
                setLoadFrom(loadFrom + 10);
            }
            else
                setHasNoPhotos(true);

            setLoading(false);
        }, 500);

        setLoadingTimeout(timeoutId);
    }
    const handleOpenImageViewer = (event: any, slug: string) => {
        const image = images.filter(image => image.slug.toString() === slug)[0];
        setSelectedPhoto({slug: image.slug, src: image.src});
        setOpenImageViewer(true);
    };
    const handleDeletedPhoto = (slug: string) => {
        setImages(images.filter(img => img.slug !== slug));
        setOpenImageViewer(false);

        get({url: `UserProfiles/GetHeader/${getUserId()}`, headers: headers}).then(async response => {
            if (response.ok) {
                const json = await response.json();
                layoutValue.updateHeader(json.firstName, json.lastName, json.avatar);
            }
        });
    }

    useEffect(() => {
        loadImages();

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading)
        return <LoadingScreen open={loading}/>

    return (
        <div className={classes.root}>
            <Paper variant="outlined" className={classes.paper}>
                <Scrollbars onScrollFrame={(value) => {
                    if (!hasNoPhotos && value.top >= 0.8)
                        loadImages();
                }}>
                    <ImageList
                        sx={{
                            transform: 'translateZ(0)',
                        }}
                        rowHeight={200}
                        gap={5}
                        style={{margin: 0, width: '100%'}}
                    >
                        {images.map((item, index) => {
                            let cols = index % 5 === 0 ? 2 : 1;
                            let rows = index % 5 === 0 ? 2 : 1;

                            return (
                                <Tooltip key={item.slug} title={moment(item.createdAt).format('LL')} arrow placement="bottom" enterDelay={1000} enterNextDelay={1000}>
                                    <ImageListItem cols={cols} rows={rows}>
                                        <img
                                            src={item.src}
                                            style={{width: '100%', height: 200, cursor: 'pointer'}}
                                            alt={item.slug}
                                            loading="lazy"
                                            onClick={(event: any) => {handleOpenImageViewer(event, item.slug)}}
                                        />
                                    </ImageListItem>
                                </Tooltip>
                            );
                        })}
                    </ImageList>
                </Scrollbars>
            </Paper>
            <ImageViewer userId={isVisitor('/Photos') ? getVisitorId() : getUserId()} viewPhoto={selectedPhoto} isOpen={openImageViewer} closeClick={() => setOpenImageViewer(false)} onDeleted={handleDeletedPhoto}/>
        </div>
    );
};