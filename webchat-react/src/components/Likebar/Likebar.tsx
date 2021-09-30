import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {IconButton} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {Tooltip} from "@mui/material";

export type LikebarType = {
    likeCount?: number,
    isLiked?: boolean,
    btnWidth?: number,
    btnHeight?: number,
    iconWidth?: number,
    iconHeight?: number,
    fontSize?: number,
    onChange?: any
}

const useStyles = makeStyles(() =>
    createStyles({
        likeSection: {
            display: 'flex',
            minWidth: 'max-content'
        },
        textLike: {
            alignSelf: 'center',
            fontWeight: 700,
            marginRight: 10,
            marginLeft: -5
        }
    }),
);

export const Likebar = ({likeCount, isLiked, btnWidth = 26, btnHeight = 26, iconWidth = 14, iconHeight = 14, fontSize = 12, onChange}: LikebarType) => {
    const classes = useStyles();

    const [liked, setLiked] = useState<boolean>(isLiked !== undefined ? isLiked : false);
    const [likes, setLikes] = useState<number>(likeCount !== undefined ? likeCount : 0);
    const [iconLikeColor, setIconLikeColor] = useState<'#C3C7CE' | '#828A99' | '#FF3347'>(liked ? '#FF3347' : '#C3C7CE');
    const [textLikeColor, setTextLikeColor] = useState<'#FF3347' | '#626d7a'>(liked ? '#FF3347' : '#626d7a');

    const handleClick = () => {
        onChange(!liked);
        setLiked(!liked);
        setLikes(!liked ? likes + 1 : likes > 0 ? likes - 1 : 0);
    }
    const handleMove = () => {
        setIconLikeColor('#828A99');
        setTextLikeColor('#626d7a');
    }
    const handleLeave = () => {
        setIconLikeColor(liked ? '#FF3347' : '#C3C7CE');
        setTextLikeColor(liked ? '#FF3347' : '#626d7a');
    }

    useEffect(() => {
        if (likeCount !== undefined && likes !== likeCount)
            setLikes(likeCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likeCount]);

    useEffect(() => {
        if (isLiked !== undefined && liked !== isLiked) {
            setLiked(isLiked);
            setIconLikeColor(isLiked ? '#FF3347' : '#C3C7CE');
            setTextLikeColor(isLiked ? '#FF3347' : '#626d7a');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLiked]);

    return (
        <div className={classes.likeSection}>
            <Tooltip title={liked ? 'Unlike' : 'Like'} arrow>
                <IconButton style={{width: btnWidth, height: btnHeight, marginRight: 10}} disableTouchRipple onClick={handleClick} onMouseMove={handleMove} onMouseLeave={handleLeave}>
                    <FavoriteIcon style={{width: iconWidth, height: iconHeight, color: iconLikeColor}}/>
                </IconButton>
            </Tooltip>
            <div className={classes.textLike} style={{display: likes > 0 ? 'block' : 'none', fontSize: fontSize, color: textLikeColor, fontWeight: liked ? 700 : 500}}>{likes}</div>
        </div>
    );
};