import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, UncontrolledTooltip} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {setFileData, Storage, translate, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';

import {getEntities as getPostDetails} from 'app/entities/post-details/post-details.reducer';
import {getEntities as getTypePosts} from 'app/entities/type-post/type-post.reducer';
import {getEntities as getTypePostFilters} from 'app/entities/type-post-filter/type-post-filter.reducer';

import {createEntity, getEntity, reset, setBlob, updateEntity} from './post.reducer';

import FroalaEditor from 'react-froala-wysiwyg';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';

export interface IPostUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }>
{
}

export const PostUpdate = (props: IPostUpdateProps) =>
{
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const {postEntity, loading, updating, postDetails, typePosts, typePostFilters, simplePostEntity} = props;

  const [postFilters, setPostFilters] = useState([]);
  //post nhiều ảnh:
  // const s4=()=>{
  //   return Math.floor((1+Math.random()) *0x10000).toString(16).substring(1);
  // }
  // const newID=()=>{
  //   return s4() + '-' + s4() + '-' + s4()  + '-' + s4() + s4() + '-' + s4() + '-' + s4()  + '-' + s4()
  // }
  // const [baseImages, setBaseImages] = useState([]);
  // const [dataImages, setDataImages] = useState([]);
  // const [images, setImages]=useState([]);
  // const promises = [];
  // const [link, setLink] = useState({link: '',id: ''})
  const Token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  const authToken = `Bearer ${Token}`;

  window.console.log(postDetails);

  const {content} = postEntity;

  const handleClose = () =>
  {
    props.history.push('/entity/post');
  };

  useEffect(() =>
  {
    if (isNew)
    {
      props.reset();
    }
    else
    {
      props.getEntity(props.match.params.id);
    }
    props.getPostDetails();
    props.getTypePosts();
    props.getTypePostFilters();
  }, []);

  const onBlobChange = (isAnImage, name) => event =>
  {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () =>
  {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() =>
  {
    if (props.updateSuccess)
    {
      handleClose();
    }
  }, [props.updateSuccess]);

  const [contentState, setContentState] = useState('');
  const handleModelChange = model => setContentState(model);
  useEffect(() =>
  {
    if (postEntity.content) setContentState(postEntity.content);
  }, [postEntity]);

  const showPostFilters = (event, value) =>
  {
    // const vkey=Object.keys(value).map(i=>value[i])
    const newArray = Object.keys(value).map(i => ({id: value[i]}));
    window.console.log(newArray);

    setPostFilters(newArray);
  };


  // const upload = (file) =>
  // {
  //   return new Promise(
  //     (resolve, reject) =>
  //     {
  //       const xhr = new XMLHttpRequest();
  //       xhr.open('POST', '/api/images/upload');
  //       xhr.setRequestHeader('Authorization', authToken);
  //       const data = new FormData();
  //       data.append('imageDataFile', file);
  //       xhr.send(data);
  //       xhr.addEventListener('load', () =>
  //       {
  //         const response = JSON.parse(xhr.responseText);
  //         window.console.log(response)
  //         resolve(response);
  //       });
  //       xhr.addEventListener('error', () =>
  //       {
  //         const error = JSON.parse(xhr.responseText);
  //         window.console.log(error)
  //         reject(error);
  //       });
  //     }
  //   );
  // }
  // const uploadImage = async (event) =>
  // {
  //   const {files} = event.target;
  //   const newFiles = Object.keys(files).map(i => ({image: files[i]}));
  //   const fileData = newFiles.map(file => promises.push(upload(file.image)))
  //   await Promise.all(promises).then(
  //     res =>
  //     {
  //       res && res.length > 0 ? res.map(item => { const newItem={link: item.link, id: newID()};dataImages.push(newItem)}) : dataImages,
  //         setBaseImages(res)
  //     }
  //   )
  // }
  // const onHandleChange = (event) =>
  // {
  //   setLink({link: event.target.value, id: newID()})
  // }
  //
  // const onSubmitInput = () =>
  // {
  //   if (link.link)
  //   {
  //     let alreadyExist = false;
  //     dataImages.map(item =>
  //     {
  //       if (item.link === link.link)
  //       {
  //         alreadyExist = true;
  //         alert('Bạn đã nhập đường link này trước đó')
  //       }
  //     })
  //     window.console.log(alreadyExist)
  //     if (!alreadyExist)
  //     {
  //       dataImages.push(link)
  //     }
  //   }
  //   setLink({link:'', id:''})
  // }
  // window.console.log(dataImages)
  //
  // const onDeleteImage=(id)=>{
  //   const array=dataImages.slice().filter(x => x.id !== id);
  //
  //   setDataImages(array)
  // }
  //
  // const showImage = () =>
  // {
  //   let result = null;
  //   if (dataImages && dataImages.length > 0)
  //   {
  //     result = dataImages.map((image, index) =>{
  //       window.console.log(image.link)
  //       return(
  //         <div key={index} className='d-flex'>
  //           <div><img src={image.link} style={{width: 300, display:'block'}} alt='link ảnh không đúng'/></div>
  //           <div className="mt-5"><button type="button" className="btn btn-danger" onClick={()=>onDeleteImage(image.id)}>Xóa</button></div>
  //         </div>
  //       )
  //     })
  //   }
  //   return result
  // }


  window.console.log({postFilters});
  const saveEntity = (event, errors, values) =>
  {
    if (errors.length === 0)
    {
      const entity = {
        ...postEntity,
        ...values,
        ...{content: contentState},
        ...{typePostFilters: postFilters},
      };

      if (isNew)
      {
        props.createEntity(entity);
      }
      else
      {
        props.updateEntity(entity);
      }
    }
  };

  window.console.log(typePostFilters);
  // const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  // const authToken = `Bearer ${token}`;

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="minhShopApp.post.home.createOrEditLabel" data-cy="PostCreateUpdateHeading">
            <Translate contentKey="minhShopApp.post.home.createOrEditLabel">Create or edit a Post</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : postEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="post-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="post-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="post-title">
                  <Translate contentKey="minhShopApp.post.title">Title</Translate>
                </Label>
                <AvField
                  id="post-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="titleLabel">
                  <Translate contentKey="minhShopApp.post.help.title"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="post-price">
                  <Translate contentKey="minhShopApp.post.price">Price</Translate>
                </Label>
                <AvField id="post-price" data-cy="price" type="string" className="form-control" name="price"/>
                <UncontrolledTooltip target="priceLabel">
                  <Translate contentKey="minhShopApp.post.help.price"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="salePriceLabel" for="post-salePrice">
                  <Translate contentKey="minhShopApp.post.salePrice">Sale Price</Translate>
                </Label>
                <AvField id="post-salePrice" data-cy="salePrice" type="string" className="form-control" name="salePrice"/>
                <UncontrolledTooltip target="salePriceLabel">
                  <Translate contentKey="minhShopApp.post.help.salePrice"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="percentSaleLabel" for="post-percentSale">
                  <Translate contentKey="minhShopApp.post.percentSale">Percent Sale</Translate>
                </Label>
                <AvField
                  id="post-percentSale"
                  data-cy="percentSale"
                  type="string"
                  className="form-control"
                  name="percentSale"
                  validate={{
                    min: {value: 0, errorMessage: translate('entity.validation.min', {min: 0})},
                    max: {value: 100, errorMessage: translate('entity.validation.max', {max: 100})},
                    number: {value: true, errorMessage: translate('entity.validation.number')},
                  }}
                />
                <UncontrolledTooltip target="percentSaleLabel">
                  <Translate contentKey="minhShopApp.post.help.percentSale"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="imageUrlLabel" for="post-imageUrl">
                  <Translate contentKey="minhShopApp.post.imageUrl">Image Url</Translate>
                </Label>
                <AvField
                  id="post-imageUrl"
                  data-cy="imageUrl"
                  type="text"
                  name="imageUrl"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />


                <UncontrolledTooltip target="imageUrlLabel">
                  <Translate contentKey="minhShopApp.post.help.imageUrl"/>
                </UncontrolledTooltip>
              </AvGroup>
              {/*<AvGroup>*/}
              {/*  <input type="text" onChange={onHandleChange} name="link" value={link.link}/>*/}
              {/*  <button type='button' onClick={onSubmitInput}>Insert</button>*/}
              {/*</AvGroup>*/}
              {/*<AvGroup>*/}
              {/*  <input type="file" onChange={(event) => uploadImage(event)} multiple/>*/}
              {/*</AvGroup>*/}
              {/*{showImage()}*/}
              <AvGroup>
                <Label id="scoresLabel" for="post-scores">
                  <Translate contentKey="minhShopApp.post.scores">Scores</Translate>
                </Label>
                <AvField
                  id="post-scores"
                  data-cy="scores"
                  type="string"
                  className="form-control"
                  name="scores"
                  validate={{
                    min: {value: 0, errorMessage: translate('entity.validation.min', {min: 0})},
                    max: {value: 100, errorMessage: translate('entity.validation.max', {max: 100})},
                    number: {value: true, errorMessage: translate('entity.validation.number')},
                  }}
                />
                <UncontrolledTooltip target="scoresLabel">
                  <Translate contentKey="minhShopApp.post.help.scores"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="simpleContentLabel" for="post-simpleContent">
                  <Translate contentKey="minhShopApp.post.simpleContent">Simple Content</Translate>
                </Label>
                <AvField
                  id="post-simpleContent"
                  data-cy="simpleContent"
                  type="text"
                  name="simpleContent"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="simpleContentLabel">
                  <Translate contentKey="minhShopApp.post.help.simpleContent"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="otherInfoLabel" for="post-otherInfo">
                  <Translate contentKey="minhShopApp.post.otherInfo">Other Info</Translate>
                </Label>
                <AvField
                  id="post-otherInfo"
                  data-cy="otherInfo"
                  type="text"
                  name="otherInfo"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="otherInfoLabel">
                  <Translate contentKey="minhShopApp.post.help.otherInfo"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="postDetailsIdLabel" for="post-postDetailsId">
                  <Translate contentKey="minhShopApp.post.postDetailsId">Post Details Id</Translate>
                </Label>
                <AvField
                  id="post-postDetailsId"
                  data-cy="postDetailsId"
                  type="text"
                  name="postDetailsId"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                    minLength: {value: 3, errorMessage: translate('entity.validation.minlength', {min: 3})},
                    maxLength: {value: 16, errorMessage: translate('entity.validation.maxlength', {max: 16})},
                    pattern: {value: '[A-z]+[0-9]+', errorMessage: translate('entity.validation.pattern', {pattern: '[A-z]+[0-9]+'})},
                  }}
                />
                <UncontrolledTooltip target="postDetailsIdLabel">
                  <Translate contentKey="minhShopApp.post.help.postDetailsId"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label for="simple-post-typePost">
                  <Translate contentKey="minhShopApp.simplePost.typePost">Type Post</Translate>
                </Label>
                <AvInput id="simple-post-typePost" data-cy="typePost" type="select" className="form-control" name="typePost.id">
                  <option value="" key="0"/>
                  {typePosts
                    ? typePosts.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.typeName}
                      </option>
                    ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="simple-post-typePostFilter">
                  <Translate contentKey="minhShopApp.simplePost.typePostFilter">Type Post Filter</Translate>
                </Label>
                <AvInput
                  id="simple-post-typePostFilter"
                  data-cy="typePostFilter"
                  type="select"
                  multiple
                  className="form-control"
                  name="typePostFilters"
                  value={!isNew && simplePostEntity.typePostFilters && simplePostEntity.typePostFilters.map(e => e.id)}
                  onChange={showPostFilters}
                >
                  <option value="" key="0"/>
                  {typePostFilters
                    ? typePostFilters.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.typeFilterName}
                      </option>
                    ))
                    : null}
                </AvInput>
              </AvGroup>
              {/*<AvGroup>*/}
              {/*  <Label id="contentLabel" for="post-content">*/}
              {/*    <Translate contentKey="minhShopApp.post.content">Content</Translate>*/}
              {/*  </Label>*/}
              {/*  <AvInput id="post-content" data-cy="content" type="textarea" name="content" />*/}
              {/*  <UncontrolledTooltip target="contentLabel">*/}
              {/*    <Translate contentKey="minhShopApp.post.help.content" />*/}
              {/*  </UncontrolledTooltip>*/}
              {/*</AvGroup>*/}
              <AvGroup>
                <Label id="contentLabel" for="post-content">
                  <Translate contentKey="minhShopApp.post.content">Content</Translate>
                </Label>
                <FroalaEditor
                  model={contentState}
                  onModelChange={handleModelChange}
                  config={{
                    requestHeaders: {
                      Authorization: authToken,
                    },
                    imageUploadMethod: 'POST',
                    imageUploadURL: '/api/file/images/upload',
                    imageUploadParam: 'imageData',
                    imageUploadParams: {'uploadByFroala': 'true'},
                    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
                    imageUpload: true,

                    videoUploadMethod: 'POST',
                    videoUploadURL: '/api/file/videos/upload',
                    videoUploadParam: 'videoData',
                    videoUploadParams: {'uploadByFroala': 'true'},
                    videoMaxSize: 1024 * 1024 * 1024, // 1Gb
                    videoAllowedTypes: ['webm', 'jpg', 'ogg', 'mp4'],
                    videoUpload: true
                  }}
                />
                <UncontrolledTooltip target="contentLabel">
                  <Translate contentKey="minhShopApp.post.help.content"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="post-comment">
                  <Translate contentKey="minhShopApp.post.comment">Comment</Translate>
                </Label>
                <AvField
                  id="post-comment"
                  data-cy="comment"
                  type="text"
                  name="comment"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="commentLabel">
                  <Translate contentKey="minhShopApp.post.help.comment"/>
                </UncontrolledTooltip>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/post" replace color="info">
                <FontAwesomeIcon icon="arrow-left"/>
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save"/>
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  postEntity: storeState.post.entity,
  loading: storeState.post.loading,
  updating: storeState.post.updating,
  updateSuccess: storeState.post.updateSuccess,
  postDetails: storeState.postDetails.entities,
  typePosts: storeState.typePost.entities,
  typePostFilters: storeState.typePostFilter.entities,
  simplePostEntity: storeState.simplePost.entity,
});

const mapDispatchToProps = {
  getPostDetails,
  getTypePosts,
  getTypePostFilters,

  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PostUpdate);
