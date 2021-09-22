import React from 'react';
import {Property} from "../Property";
import moment from "moment";

export type MainInformationType = {
    birthday: string | null,
    city: string | null,
    gender: string,
    languages: string[],
    isMobile?: boolean
}

export const MainInformation = ({birthday, city, languages, gender, isMobile}: MainInformationType) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: isMobile ? 0 : 8}}>
            <Property name="Birthday" value={birthday === null ? "not specified" : moment(birthday).format('LL')}/>
            <Property name="City" value={city === null ? "not specified" : city}/>
            <Property name="Languages" value={languages.length === 0 ? "not specified" : languages.join(', ')}/>
            <Property name="Gender" value={gender === 'male' ? 'Male' : 'Female'}/>
        </div>
    );
}