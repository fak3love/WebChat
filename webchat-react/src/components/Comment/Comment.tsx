import React from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

export type ReplyCommentType = {
    userId: string,
    firstName: string,
    lastName: string,
    commentId: string
}
export type CommentBlockType = {
    userId: string,
    firstName: string,
    lastName: string,
    addedDate: string,
    message: string,
    commentId: string,
    avatarSrc?: any,
    likeCount?: number,
    isLiked?: boolean,
    reply?: ReplyCommentType
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            margin: 10
        },
        linkAvatar: {
            width: 40,
            height: 40
        },
        link: {
            color: '#2a5885',
            fontSize: 13,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            display: 'inline-block',
            width: 'max-content',
            maxWidth: 235,
            '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer'
            }
        },
        commentBody: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'space-around',
            marginLeft: 15
        },
        actionBody: {
            display: 'flex',
            position: 'relative'
        },
        date: {
            fontSize: 12.5,
            color: '#939393',
            alignSelf: 'center'
        },
        btnLike: {
            display: 'flex',
            position: 'absolute',
            cursor: 'pointer',
            right: 0,
            bottom: 0
        },
        iconLike: {
            width: 18,
            height: 18,
            color: '#FF3347'
        },
        textLike: {
            marginLeft: 5,
            alignSelf: 'center',
            color: 'rgb(109 109 109)',
            fontSize: 12.5,
            marginRight: 15
        }
    }),
);

export const Comment = ({userId, firstName, lastName, addedDate, message, commentId, avatarSrc, likeCount, isLiked, reply}: CommentBlockType) => {
    const classes = useStyles();

    return (
        <div id={commentId} className={classes.root} data-commentId={commentId} data-replyToCommentId={reply !== undefined ? reply.commentId : ""}>
            <Link to={`/Profile/${userId}`}>
                <Avatar alt="Remy Sharp" src={avatarSrc} className={classes.linkAvatar} />
            </Link>
            <div className={classes.commentBody}>
                <Link to={`/Profile/${userId}`} className={classes.link} style={{}}>{firstName} {lastName}</Link>
                <div style={{fontSize: 13, margin: '3px 0'}}>
                    {reply !== undefined ?
                        <React.Fragment>
                            <Link to={`/Profile/${reply.userId}`} className={classes.link} style={{fontSize: 12.5, fontWeight: 400, alignSelf: 'center'}}>{reply.firstName} {reply.lastName},</Link>
                            <br/>
                        </React.Fragment>
                        : ""}
                    {message}
                </div>
                <div className={classes.actionBody}>
                    <div className={classes.date}>{addedDate}</div>
                    <div className={classes.link} style={{fontSize: 12.5, fontWeight: 400, marginLeft: 5, alignSelf: 'center'}}>Reply</div>
                    <div className={classes.btnLike}>
                        {isLiked ? <FavoriteIcon className={classes.iconLike}/> : <FavoriteBorderIcon className={classes.iconLike}/>}
                        <div className={classes.textLike}>{likeCount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
