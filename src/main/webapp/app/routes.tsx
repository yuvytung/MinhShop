import React from 'react';
// import {Breadcrumb, NavLink} from "reactstrap";
import {NavLink, Switch, useLocation} from 'react-router-dom';
import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import Entities from 'app/entities';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import {AUTHORITIES} from 'app/config/constants';
import {sendActivity} from 'app/config/websocket-middleware';
import {PostUpdate} from 'app/custom-entity/post/post-update';
import Introduce from 'app/modules/introduce/introduce';

//todo test breadcrumb
import {Breadcrumbs, BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import Contact from 'app/modules/contact/contact';
import PageProduct from 'app/page-product';
import CheckoutCart from 'app/modules/checkout-cart/checkout-cart';
import CompleteOrder from 'app/modules/checkout-cart/complete-order';
import ResultSearch from 'app/modules/result-search/result-search';
import Chat from './modules/web-socket/chat/chat';

const BreadcrumbLayout = props =>
{
  const {children} = props;
  return (
    <div className="d-flex justify-content-center">
      <div className="breadcrumb col-9" style={location.pathname === '/' ? {display: 'none'} : {display: 'block'}}>
        {children}
      </div>
    </div>
  );
};

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>,
});

const base_path = '/';
const Routes = props =>
{
  const location = useLocation();
  React.useEffect(() =>
  {
    sendActivity(location.pathname);
  }, [location]);
  return (
    <div className="view-routes">
      <BreadcrumbsItem to={base_path}>Trang Chủ</BreadcrumbsItem>
      {/*<Breadcrumbs*/}
      {/*  item={CrumbItem}*/}
      {/*  container={Breadcrumb}*/}
      {/*  finalProps={{active: true}}*/}
      {/*  duplicateProps={{to: 'href'}}*/}
      {/*/>*/}
      <Breadcrumbs
        separator={<b>/</b>}
        item={NavLink}
        finalItem={'b'} //chọn thẻ tag cho route cuối cùng
        finalProps={{
          style: {color: 'gray'},
        }}
        container={BreadcrumbLayout}
        // compare={(a,b)=>a.weight-b.weight} removeProps={{weight: true}}
      />
      <Switch>
        <ErrorBoundaryRoute path="/login" component={Login}/>
        <ErrorBoundaryRoute path="/logout" component={Logout}/>
        <ErrorBoundaryRoute path="/account/register" component={Register}/>
        <ErrorBoundaryRoute path="/account/activate/:key?" component={Activate}/>
        <ErrorBoundaryRoute path="/account/reset/request" component={PasswordResetInit}/>
        <ErrorBoundaryRoute path="/account/reset/finish/:key?" component={PasswordResetFinish}/>
        <ErrorBoundaryRoute path="/form-insert" exact component={PostUpdate}/>
        <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]}/>
        <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}/>
        <PrivateRoute path="/entity" component={Entities} hasAnyAuthorities={[AUTHORITIES.USER]}/>
        <PrivateRoute path="/chat" component={Chat} hasAnyAuthorities={[AUTHORITIES.USER]}/>
        <ErrorBoundaryRoute path="/" exact component={Home}/>
        {/*<Page path="/" exact component={Home} title="Home"/>*/}

        <ErrorBoundaryRoute path="/introduce" component={Introduce}/>
        <ErrorBoundaryRoute path="/contact" component={Contact}/>

        <ErrorBoundaryRoute path="/page" component={PageProduct}/>

        {/*<ErrorBoundaryRoute path={`/lap-top/:id`} exact component={LaptopDetail} />*/}
        {/*<ErrorBoundaryRoute path={`/mac-book/:id`} exact component={MacbookDetail} />*/}
        {/*<ErrorBoundaryRoute path={`/console/:id`} exact component={MayConsoleDetail} />*/}
        {/*<ErrorBoundaryRoute path={`/tablet/:id`} exact component={TabletDetail} />*/}
        {/*<ErrorBoundaryRoute path={`/game-equipment/:id`} exact component={GameEquipmentDetail} />*/}

        <ErrorBoundaryRoute path="/checkout" component={CheckoutCart}/>
        <ErrorBoundaryRoute path="/result-search" exact component={ResultSearch}/>
        <ErrorBoundaryRoute path="/hoantatgiaohang" component={CompleteOrder}/>

        <ErrorBoundaryRoute component={PageNotFound}/>
      </Switch>
    </div>
  );
};

export default Routes;
