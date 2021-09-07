import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Header} from "../Header";
import {FooterMobile} from "../FooterMobile";
import {SideMenu} from "../SideMenu";
import {Container} from "@material-ui/core";

type Props = {
    children: JSX.Element | JSX.Element[]
}

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
            background: 'rgb(27 146 216)'
        },
        menu: {
            display: 'none',
            minWidth: 190,
            maxWidth: 190,
            [theme.breakpoints.up('sm')]: {
                display: 'block'
            },
        },
        content: {
            display: 'flex',
            gridArea: 'Content',
            marginTop: 15
        },
        section: {
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

export const Layout = ({children}: Props): any => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Container maxWidth="md">
                    <Header/>
                </Container>
            </div>
            <Container maxWidth="md" className={classes.content}>
                <aside className={classes.menu}>
                    <SideMenu/>
                </aside>
                <section className={classes.section}>
                    {children}
                </section>
            </Container>
            <div className={classes.footer}>
                <FooterMobile/>
            </div>
        </div>
    );
};