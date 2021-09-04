import React from 'react';
import "./Layout.css";
import {Header} from "../Header";
import {Container} from "@material-ui/core";
import {Menu} from "../Menu";
import {FooterMobile} from "../FooterMobile";

type Props = {
    children: JSX.Element | JSX.Element[]
}

export const Layout = ({children}: Props): any => {
    return (
        <div className="Layout">
            <div className="Layout__header">
                <Container maxWidth="md">
                    <Header/>
                </Container>
            </div>
            <div className="Layout__content">
                <Container maxWidth="md">
                    <aside className="Layout__menu">
                        <Menu/>
                    </aside>
                    <section className="Layout__section">
                        {children}
                    </section>
                </Container>
            </div>
            <div className="Layout__footer">
                <FooterMobile/>
            </div>
        </div>
    );
};