import React from 'react';
import {IconButton, Tooltip} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import "./AttachedImage.css";

export const AttachedImage = ({src, uniqueKey, unpinClick, maxHeight = 115, disabled}: {src: any, uniqueKey: string, unpinClick: any, maxHeight?: number, disabled?: boolean}) => {
    return (
        <div data-imagekey={uniqueKey} className="attachedImg">
            <img src={src} style={{maxHeight: maxHeight}} className="attachedImg__img" alt={src}/>
            <Tooltip title="Unpin photo" placement="top" arrow>
                <IconButton style={{position: 'absolute', width: 22, height: 22, right: 0, top: 0, background: 'rgba(0, 0, 0, 30%)'}} disabled={disabled} disableTouchRipple={true} onClick={unpinClick}>
                    <FontAwesomeIcon icon={faTimes} style={{width: 12, height: 12, color: 'white'}}/>
                </IconButton>
            </Tooltip>
        </div>
    );
};
