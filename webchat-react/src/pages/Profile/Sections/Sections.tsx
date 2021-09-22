import React from 'react';
import {Section} from "../Section";

export type SectionsType = {
    userId: string,
    visitor: boolean,
    friends: number,
    followers: number,
    subscriptions: number,
    photos: number,
    isMobile?: boolean
}

export const Sections = ({userId, visitor, friends, followers, subscriptions, photos, isMobile}: SectionsType) => {
    return (
        <div style={{display: 'flex', padding: isMobile ? 0 : '0 20px', justifyContent: 'center', margin: isMobile ? '-10px 0 -15px 0' : -15}}>
            <Section name="friends" count={friends} url='/Friends' userId={userId} isVisitor={visitor}/>
            <Section name="followers" count={followers} url='/Followers' userId={userId}  isVisitor={visitor}/>
            <Section name="subs" count={subscriptions} url='/Subscriptions' userId={userId}  isVisitor={visitor}/>
            <Section name="photos" count={photos} url='/Photos' userId={userId}  isVisitor={visitor}/>
        </div>
    );
}