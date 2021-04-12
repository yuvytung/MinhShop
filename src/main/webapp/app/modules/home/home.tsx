import './home.scss';

import React, {useEffect, useState} from 'react';
import {Badge, Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, NavLink} from 'reactstrap';
import {NavLink as Link} from 'react-router-dom';
import {Storage} from 'react-jhipster';
import {BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import axios from 'axios';
import {OpenApiPathConst} from "app/page-product/OpenApiPathConst";

const Home = props =>
{
  const Token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  const [simplePostsGroupByTypePost, setSimplePostsGroupByTypePost] = useState([]);

  const authToken = `Bearer ${Token}`;

  useEffect(() =>
  {
    axios({
      url: OpenApiPathConst.TYPE_POST_PATH,
      method: 'get',
      headers: {
        Authorization: authToken,
      },
    }).then(res => setSimplePostsGroupByTypePost(res.data.SimplePostsGroupByTypePost));
  }, []);
  window.console.log(simplePostsGroupByTypePost);


  const productsGroupByTypePost = (sp_tp) =>
  {
    const simplePosts = sp_tp.SimplePosts
    return (
      <div>

        <header className="panel1-header d-flex align-items-center justify-content-between">
          <NavLink to="/page/may-tinh-bang" tag={Link}>
            <h2>{sp_tp.typePost_TypeName}</h2>
          </NavLink>
        </header>
        <hr/>
        <div className="section-content d-flex">
          <div
            className="section-banner d-none d-sm-none d-md-block d-lg-block d-xl-block col-md-3 col-lg-3 col-xl-3">
            <NavLink to="/page/may-tinh-bang" tag={Link}>
              <img className="img-fluid" src="content/images/do_go_noi_that_1.png" alt="banner"/>
            </NavLink>
          </div>
          <div className="section-main col-12col-sm-12 col-md-9 col-lg-9 col-xl-9">
            <div className="row d-flex">{}
              {simplePosts && simplePosts.length > 0
                ? simplePosts.map(simplePost => (
                  <div className="section-product col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 pb-2" key={simplePost.uuid}>
                    <NavLink to={`/page/may-tinh-bang/${simplePost.id}`} tag={Link}>
                      <Card className="p-0">
                        <div className="image-size">
                          <CardImg top width="100%" src={simplePost.imageUrl} alt="Card image cap"/>
                        </div>
                        <CardBody>
                          <CardTitle tag="h4">{simplePost.title}</CardTitle>
                          <CardSubtitle className="mb-2 text-muted">
                            Mã sản phẩm: {simplePost.postDetails.postDetailsId}
                          </CardSubtitle>

                          <CardText className="d-xl-flex justify-content-between">
                            <span className="price-new">{simplePost.salePrice.toLocaleString()}</span>
                            <span className="price-old">{simplePost.price.toLocaleString()}</span>
                            <span>
                              <Badge color="warning">-{simplePost.percentSale.toFixed(0)}%</Badge>
                            </span>
                          </CardText>
                          <Button color="primary"
                            className="btn-block d-none d-sm-none d-md-none d-lg-block d-xl-block">
                            XEM THÊM CHI TIẾT
                          </Button>
                        </CardBody>
                      </Card>
                    </NavLink>
                  </div>
                ))
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className=" home-content d-flex justify-content-center">
      <BreadcrumbsItem glyph="calendar" to="/">
        Trang chủ
      </BreadcrumbsItem>
      <div className="home-container col-12 col-sm-11 -col-md-10 col-lg-10 col-xl-9">
        <section className="panel1-products  mt-5">
          {/*Danh mục sản phẩm*/}
          {simplePostsGroupByTypePost.map(sp_tp => productsGroupByTypePost(sp_tp))}
        </section>
      </div>
    </div>
  );
};

export default Home;
