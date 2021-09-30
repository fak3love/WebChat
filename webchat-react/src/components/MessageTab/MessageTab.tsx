import React, {useState} from 'react';

export type MessageTabType = {
    title: string,
    selected: boolean
}

export const MessageTab = ({title, selected}: MessageTabType) => {
    const [background, setBackground] = useState<string>( selected ? '#F2F3F5' : 'transparent');
    const handleMouseMove = () => {
        if (!selected)
            setBackground('#F5F6F8')
    }
    const handleMouseLeave = () => {
        if (!selected)
            setBackground('transparent')
    }

    return (
        <div style={{display: 'flex', cursor: 'pointer', height: 32, padding: '0 5px 0 20px', background: background, borderLeft: `2px solid ${selected ? '#5181b8' : 'transparent'}`}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <span style={{color: selected ? 'black' : '#2a5885', fontWeight: selected ? 500 : 400, fontSize: 13, alignSelf: 'center'}}>{title}</span>
        </div>
    )
};
