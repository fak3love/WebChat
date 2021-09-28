import React, {useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowCircleRight} from '@fortawesome/free-solid-svg-icons'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {IconButton, Tooltip} from "@material-ui/core";
import {Likebar} from "../Likebar";
import moment from "moment";
import {getUserId, headers} from "../../ts/authorization";
import {deleteRequest, post} from "../../ts/requests";

export type ReplyCommentType = {
    userId: string,
    firstName: string,
    commentId: string
}
export type CommentType = {
    userId: string,
    commentId: string,
    firstName: string,
    lastName: string,
    avatar?: string,
    createdDate: string,
    likes?: number,
    liked?: boolean,
    message?: string,
    attachedImages?: string[],
    reply?: ReplyCommentType | null,
    editable: boolean,
    replyClick: any,
    showReplyClick: any,
    deleteClick: any
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            padding: 10
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

export const Comment = ({userId, commentId, firstName, lastName, createdDate, avatar, likes, liked, reply, message, attachedImages, editable, replyClick, showReplyClick, deleteClick}: CommentType) => {
    const classes = useStyles();

    const [replyVisible, setReplyVisible] = useState<boolean>(false);

    const handleChangeLike = async (liked: boolean) => {
        if (liked) {
            await post({url: 'UserPhotoComments/LikeComment', headers: headers, body: JSON.stringify({commentId: commentId})});
            return;
        }

        await deleteRequest({url: 'UserPhotoComments/RemoveLike', headers: headers, body: JSON.stringify({commentId: commentId})});
    }

    return (
        <div id={commentId} className={classes.root} onMouseMove={() => setReplyVisible(true)} onMouseLeave={() => setReplyVisible(false)}>
            <Link to={userId.toString() === getUserId() ? '/Profile' : `/Profile/${userId}`} style={{height: 'max-content'}}>
                <Avatar alt="Remy Sharp" src={avatar} className={classes.linkAvatar} />
            </Link>
            <div className={classes.commentBody}>
                <div style={{display: 'flex'}}>
                    <Link to={userId.toString() === getUserId() ? '/Profile' : `/Profile/${userId}`} className={classes.link} style={{alignSelf: 'center', width: 'max-content'}}>{firstName} {lastName}</Link>
                    <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
                        <Tooltip title={`Reply to ${reply?.firstName}'s comment`} arrow>
                            <div className={classes.link} style={{visibility: reply !== undefined && reply !== null ? 'visible' : 'collapse', fontSize: 12.5, fontWeight: 400, alignSelf: 'center', marginRight: 10}} onClick={() => showReplyClick(commentId, reply?.commentId)}>
                                <FontAwesomeIcon icon={faArrowCircleRight} style={{width: 14, height: 14, marginRight: 6, color: 'rgb(178 181 187)'}}/>
                            </div>
                        </Tooltip>
                        <Tooltip title={`Delete comment`} arrow>
                            <div className={classes.link} style={{display: editable || userId.toString() === getUserId() ? 'block' : 'none', fontSize: 12.5, fontWeight: 400, alignSelf: 'center', marginRight: 10}} onClick={() => deleteClick(commentId)}>
                                <FontAwesomeIcon icon={faTimesCircle} style={{width: 14, height: 14, marginRight: 6, color: 'rgb(178 181 187)'}}/>
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div style={{fontSize: 13, margin: '3px 0'}}>
                    {message}
                </div>
                <div style={{display: attachedImages !== undefined ? 'flex' : 'none', flexWrap: 'wrap', marginTop: 2.5}}>
                    {attachedImages?.map(src => <img style={{maxHeight: 120, margin: '5px 10px 5px 0'}} src={src} alt={src}/>)}
                </div>
                <div className={classes.actionBody}>
                    <div className={classes.date}>{moment(createdDate).format('lll')}</div>
                    <div className={classes.link} style={{visibility: replyVisible ? 'visible' : 'hidden', fontSize: 12.5, fontWeight: 400, marginLeft: 5, alignSelf: 'center', minWidth: 'max-content'}} onClick={() => replyClick(commentId, firstName)}>Reply</div>
                    <div style={{width: '100%'}}/>
                    <Likebar likeCount={likes} isLiked={liked} onChange={handleChangeLike}/>
                </div>
            </div>
        </div>
    );
};
