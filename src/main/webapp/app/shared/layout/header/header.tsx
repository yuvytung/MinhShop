// import './header.scss';
//
// import React, { useState } from 'react';
// import { Translate, Storage } from 'react-jhipster';
// import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
//
// import LoadingBar from 'react-redux-loading-bar';
//
// import { Home, Brand, FormInsert } from './header-components';
// import { AdminMenu, EntitiesMenu, AccountMenu, LocaleMenu } from '../menus';
//
// export interface IHeaderProps {
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   ribbonEnv: string;
//   isInProduction: boolean;
//   isOpenAPIEnabled: boolean;
//   currentLocale: string;
//   onLocaleChange: (langKey: string) => void;
// }
//
// const Header = (props: IHeaderProps) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//
//   const handleLocaleChange = event => {
//     const langKey = event.target.value;
//     Storage.session.set('locale', langKey);
//     props.onLocaleChange(langKey);
//   };
//
//   const renderDevRibbon = () =>
//     props.isInProduction === false ? (
//       <div className="ribbon dev">
//         <a href="">
//           <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
//         </a>
//       </div>
//     ) : null;
//
//   const toggleMenu = () => setMenuOpen(!menuOpen);
//
//   /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */
//
//   return (
//     <div id="app-header">
//       {renderDevRibbon()}
//       <LoadingBar className="loading-bar" />
//       <Navbar data-cy="navbar" dark expand="sm" fixed="top" className="bg-primary">
//         <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
//         <Brand />
//         <Collapse isOpen={menuOpen} navbar>
//           <Nav id="header-tabs" className="ml-auto" navbar>
//             <Home />
//             <FormInsert />
//             {props.isAuthenticated && <EntitiesMenu />}
//             {props.isAuthenticated && props.isAdmin && (
//               <AdminMenu showOpenAPI={props.isOpenAPIEnabled} showDatabase={!props.isInProduction} />
//             )}
//             <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
//             <AccountMenu isAuthenticated={props.isAuthenticated} />
//           </Nav>
//         </Collapse>
//       </Navbar>
//     </div>
//   );
// };
//
// export default Header;

import './header.scss';

import React, {useState} from 'react';
import {Storage, Translate} from 'react-jhipster';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem} from 'reactstrap';

import LoadingBar from 'react-redux-loading-bar';

import {Brand, Contact, Home, Introduction} from './header-components';
import {AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu} from '../menus';
import {Other} from "app/shared/layout/menus/other";

export interface IHeaderProps
{
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
  onLocaleChange: (langKey: string) => void;
}

const Header = (props: IHeaderProps) =>
{
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLocaleChange = event =>
  {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    props.onLocaleChange(langKey);
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`}/>
        </a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div id="app-header" className=" bg-danger d-flex justify-content-center">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar"/>
      <Navbar fixed="top" expand="md" light className="shop-header  col-12 col-sm-11 -col-md-10 col-lg-10 col-xl-9 ">
        {/*<NavbarBrand>*/}
        <Brand/>
        {/*</NavbarBrand>*/}
        <NavbarToggler aria-label="menu" onClick={toggleMenu}/>
        <Collapse id="header-tabs" isOpen={menuOpen} navbar>
          <Nav className="ml-auto " navbar>
            <NavItem>
              <Home/>
            </NavItem>
            <NavItem>
              <Introduction/>
            </NavItem>
            <NavItem>
              <Contact/>
            </NavItem>
            {props.isAuthenticated && props.isAdmin && <EntitiesMenu/>}
            {props.isAuthenticated && <Other/>}

            {props.isAuthenticated && props.isAdmin && (
              <AdminMenu showOpenAPI={props.isOpenAPIEnabled} showDatabase={!props.isInProduction}/>
            )}
            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange}/>
            <AccountMenu isAuthenticated={props.isAuthenticated}/>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    // </div>
  );
};

export default Header;
