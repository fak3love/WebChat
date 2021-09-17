import React, {useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import {IconButton, Tooltip} from "@material-ui/core";
import {Likebar} from "../Likebar";

export type ReplyCommentType = {
    userId: string,
    firstName: string,
    commentId: string
}
export type CommentType = {
    userId: string,
    firstName: string,
    lastName: string,
    addedDate: string,
    message?: string,
    commentId: string,
    avatarSrc?: any,
    likeCount?: number,
    isLiked?: boolean,
    attachedImages?: Array<any>,
    reply?: ReplyCommentType,
    replyClick: any
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
            maxWidth: 110,
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
            alignSelf: 'center',
            minWidth: 'max-content'
        },
    }),
);

export const Comment = ({userId, commentId, firstName, lastName, addedDate, avatarSrc, likeCount, isLiked, reply, message, attachedImages, replyClick}: CommentType) => {
    const classes = useStyles();

    return (
        <div id={commentId} className={classes.root} data-commentId={commentId} data-replyToCommentId={reply !== undefined ? reply.commentId : ""}>
            <Link to={`/Profile/${userId}`}>
                <Avatar alt="Remy Sharp" src={avatarSrc} className={classes.linkAvatar} />
            </Link>
            <div className={classes.commentBody}>
                <div style={{display: 'flex'}}>
                    <Link to={`/Profile/${userId}`} className={classes.link}>{firstName} {lastName}</Link>
                    <div style={{display: reply !== undefined ? 'flex' : 'none', flex: 1, justifyContent: 'flex-end'}}>
                        <Tooltip title={`reply to ${reply?.firstName}`} arrow>
                            <Link to={`/Profile/${reply?.userId}`} className={classes.link} style={{fontSize: 12.5, fontWeight: 400, alignSelf: 'center', maxWidth: 100}}>{reply?.firstName}</Link>
                        </Tooltip>
                        <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 2.5, width: 11, height: 11, alignSelf: 'center', color: '#828A99'}}/>
                    </div>
                </div>
                <div style={{fontSize: 13, margin: '3px 0'}}>
                    {message}
                </div>
                <div style={{display: attachedImages !== undefined ? 'flex' : 'none', flexWrap: 'wrap', marginTop: 2.5}}>
                    {attachedImages?.map(src => <img style={{maxHeight: 120, margin: '5px 10px 5px 0'}} src={src} alt={src}/>)}
                </div>
                <div className={classes.actionBody}>
                    <div className={classes.date}>{addedDate}</div>
                    <div className={classes.link} style={{fontSize: 12.5, fontWeight: 400, marginLeft: 5, alignSelf: 'center', minWidth: 'max-content'}} onClick={() => replyClick(commentId, firstName)}>Reply</div>
                    <div style={{width: '100%'}}/>
                    <Likebar likeCount={likeCount} isLiked={isLiked}/>
                </div>
            </div>
        </div>
    );
};
