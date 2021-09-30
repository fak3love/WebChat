import React, {createContext, useEffect, useRef} from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Header} from "../Header";
import {SideMenu} from "../SideMenu";
import {Container} from "@material-ui/core";
import {MessageTabManager} from "../MessageTabManager";

type Props = {
    children: JSX.Element | JSX.Element[]
}

const isAuthPage = document.location.pathname === '/Authorization';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            gridTemplateAreas: '"Header" "Content" "Footer"',
            height: '100%',
            background: '#EDEEF0'
        },
        header: {
            gridArea: 'Header',
            background: 'white',
            display: isAuthPage ? 'none' : 'block'
        },
        menu: {
            display: 'none',
            minWidth: 190,
            maxWidth: 190,
            [theme.breakpoints.up('sm')]: {
                display: isAuthPage ? 'none' : 'block'
            },
        },
        content: {
            display: 'flex',
            gridArea: 'Content',
            marginTop: 15,
            background: '#EDEEF0'
        },
        section: {
            display: 'flex',
            width: '100%',
            paddingLeft: 0,
            [theme.breakpoints.up('sm')]: {
                paddingLeft: 24
            },
        },
        footer: {
            gridArea: 'Footer'
        }
    }),
);

export const LayoutContext = createContext({updateHeader: (firstName: string, lastName: string, avatar: string) => {}});

export const Layout = ({children}: Props): any => {
    const classes = useStyles();
    const updateHeaderRef = useRef<(firstName: string, lastName: string, avatar: string) => void>();
    const updateHeader = (firstName: string, lastName: string, avatar: string) => {
        updateHeaderRef.current!(firstName, lastName, avatar);
    }

    useEffect(() => {
        console.log(true);
    })

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Container maxWidth="lg" style={{maxWidth: 1030}}>
                    <Header handleUpdate={updateHeaderRef}/>
                </Container>
            </div>
            <Container maxWidth="lg" style={{maxWidth: 1030}} className={classes.content}>
                <aside className={classes.menu}>
                    <SideMenu/>
                </aside>
                <section className={classes.section}>
                    <LayoutContext.Provider value={{updateHeader: updateHeader}}>
                        {children}
                        {document.location.pathname.startsWith('/Messages') ? <MessageTabManager/> : ''}
                    </LayoutContext.Provider>
                </section>
            </Container>
        </div>
    );
};