import React from 'react';
import {Link} from "react-router-dom";
import {FriendStatus, FriendStatuses} from "../Profile";
import "./UnderAvatar.css";

export type UnderAvatarType = {
    mainUserId: string,
    userId: string,
    visitor: boolean,
    friendStatus: FriendStatus | undefined,
    handleAddFriend: any,
    handleRemoveFriend: any
}

export const UnderAvatar = ({mainUserId, userId, visitor, friendStatus, handleAddFriend, handleRemoveFriend}: UnderAvatarType) => {
    if (!visitor)
        return <Link to="/Settings" className="btnEdit">Edit</Link>

    if (friendStatus === undefined && mainUserId !== userId)
        return <div className="btnEdit" style={{cursor: 'pointer'}} onClick={handleAddFriend}>Add friend</div>

    if ((friendStatus?.status === FriendStatuses.followerTarget && friendStatus?.initiatorId === mainUserId) || (friendStatus?.status === FriendStatuses.targetFollower && friendStatus?.initiatorId === userId))
        return <div className="btnEdit" style={{cursor: 'pointer'}} onClick={handleRemoveFriend}>Unsubscribe</div>

    if ((friendStatus?.status === FriendStatuses.followerTarget && friendStatus?.targetId === mainUserId) || (friendStatus?.status === FriendStatuses.targetFollower && friendStatus?.targetId === userId))
        return <div className="btnEdit" style={{cursor: 'pointer'}} onClick={handleAddFriend}>Accept request</div>

    if (friendStatus?.status === FriendStatuses.friends)
        return <div className="btnEdit" style={{cursor: 'pointer'}} onClick={handleRemoveFriend}>Unfriend</div>

    return <Link to="/Profile" className="btnEdit">back to my profile</Link>
};