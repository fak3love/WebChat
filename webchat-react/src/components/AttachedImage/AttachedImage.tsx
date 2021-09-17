import React from 'react';
import {IconButton, Tooltip} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

export const AttachedImage = ({src, uniqueKey, unpinClick, maxHeight = 170}: {src: any, uniqueKey: string, unpinClick: any, maxHeight?: number}) => {
    return (
        <div data-imagekey={uniqueKey} style={{position: 'relative', margin: 10}} className="attachedImg">
            <img src={src} style={{width: 'auto', maxHeight: maxHeight}} alt={src}/>
            <Tooltip title="Unpin photo" placement="top" arrow>
                <IconButton style={{position: 'absolute', width: 22, height: 22, right: 0, top: 0, background: 'rgba(0, 0, 0, 30%)'}} disableTouchRipple={true} onClick={unpinClick}>
                    <FontAwesomeIcon icon={faTimes} style={{width: 12, height: 12, color: 'white'}}/>
                </IconButton>
            </Tooltip>
        </div>
    );
};
