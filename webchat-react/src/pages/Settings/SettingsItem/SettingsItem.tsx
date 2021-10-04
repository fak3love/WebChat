import React, {useState} from 'react';
import {Divider, Tooltip} from "@material-ui/core";

export type SettingsItemType = {
    disabled?: boolean,
    leftText: string | undefined | null,
    middleText: string | undefined | null,
    showBottomBorder?: boolean,
    hiddenContent?: JSX.Element
}

export const SettingsItem = ({leftText, middleText, hiddenContent, showBottomBorder = false, disabled = false}: SettingsItemType) => {
    const [open, setOpen] = useState<boolean>(false);
    const [decoration, setDecoration] = useState<boolean>(false);

    return (
        <Tooltip title={!disabled ? '' : 'This option is not available'} arrow>
            <div style={{display: 'flex', flexDirection: 'column', background: disabled ? '#e3e3e32e' : (open ? '#FAFBFC' : 'transparent'), height: 'max-content', padding: '0 20px', cursor: !disabled && !open ? 'pointer' : 'default'}} onClick={() => !disabled && !open ? setOpen(true) : ''} onMouseMove={() => !open ? setDecoration(true) : ''} onMouseLeave={() => !open ?  setDecoration(false) : ''}>
                <div style={{display: 'flex', width: '100%', padding: '20px 0'}}>
                    <div style={{display: !open ? 'flex' : 'none', width: '100%'}}>
                        <div style={{fontSize: 13, width: 155, color: '#626d7a'}}>{leftText}</div>
                        <div style={{fontSize: 13, width: '100%', maxWidth: 230, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{middleText}</div>
                    </div>
                    <div style={{display: open ? 'block' : 'none', width: '100%'}}>
                        {hiddenContent}
                    </div>
                    <div style={{fontSize: 13, height: 'max-content', color: !disabled ? '#2a5885' : 'gray', cursor: !disabled ? 'pointer' : 'default', textDecoration: !disabled && decoration ? 'underline' : 'none'}} onClick={() => !disabled ? setOpen(false) : ''} onMouseMove={() => setDecoration(true)} onMouseLeave={() => setDecoration(false)}>
                        {!open ? 'Change' : 'Cancel'}
                    </div>
                </div>
                <Divider style={{margin: open || showBottomBorder ? '0 -20px 0 -20px' : 0}}/>
            </div>
        </Tooltip>
    );
};
