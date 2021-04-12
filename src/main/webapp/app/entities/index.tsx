import React from 'react';
import {Switch} from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PostDetails from './post-details';
import SimplePost from './simple-post';
import TypePost from './type-post';
import TypePostFilter from './type-post-filter';
import File from './file';
import Payment from './payment';
import Bill from './bill';
import UserOtherInfo from './user-other-info';
import HanhChinhVN from './hanh-chinh-vn';
import Post from './post';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({match}) =>
{
  window.console.log(`${match.url}post`);
  return (
    <div>
      <Switch>
        {/* prettier-ignore */}
        <ErrorBoundaryRoute path={`${match.url}/post-details`} component={PostDetails}/>
        <ErrorBoundaryRoute path={`${match.url}/simple-post`} component={SimplePost}/>
        <ErrorBoundaryRoute path={`${match.url}/type-post`} component={TypePost}/>
        <ErrorBoundaryRoute path={`${match.url}/type-post-filter`} component={TypePostFilter}/>
        <ErrorBoundaryRoute path={`${match.url}/file`} component={File}/>
        <ErrorBoundaryRoute path={`${match.url}/payment`} component={Payment}/>
        <ErrorBoundaryRoute path={`${match.url}/bill`} component={Bill}/>
        <ErrorBoundaryRoute path={`${match.url}/user-other-info`} component={UserOtherInfo}/>
        <ErrorBoundaryRoute path={`${match.url}/hanh-chinh-vn`} component={HanhChinhVN}/>
        <ErrorBoundaryRoute path={`${match.url}/post`} component={Post}/>
        <ErrorBoundaryRoute path={`${match.url}file`} component={File}/>
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </Switch>
    </div>
  );
};

export default Routes;
