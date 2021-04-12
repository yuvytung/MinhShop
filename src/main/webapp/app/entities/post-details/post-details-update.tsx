import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, UncontrolledTooltip} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {setFileData, Storage, translate, Translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getSimplePosts} from 'app/entities/simple-post/simple-post.reducer';
import {createEntity, getEntity, reset, setBlob, updateEntity} from './post-details.reducer';
import {convertDateTimeToServer} from 'app/shared/util/date-utils';

// froala
import FroalaEditor from 'react-froala-wysiwyg';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';

export interface IPostDetailsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }>
{
}

export const PostDetailsUpdate = (props: IPostDetailsUpdateProps) =>
{
  const [simplePostId, setSimplePostId] = useState('0');
  const [isNew] = useState(!props.match.params || !props.match.params.id);


  const s4 = () =>
  {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  const newID = () =>
  {
    return s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4()
  }
  const [baseImages, setBaseImages] = useState([]);
  const [dataImages, setDataImages] = useState([]);
  const [images, setImages] = useState([]);
  const promises = [];
  const [link, setLink] = useState({link: '', id: ''})

  const {postDetailsEntity, simplePosts, loading, updating} = props;

  const {content, searchField} = postDetailsEntity;

  const handleClose = () =>
  {
    props.history.push('/entity/post-details');
  };

  useEffect(() =>
  {
    if (!isNew)
    {
      props.getEntity(props.match.params.id);
    }

    props.getSimplePosts();
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
  const upload = (file) =>
  {
    return new Promise(
      (resolve, reject) =>
      {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/images/upload');
        xhr.setRequestHeader('Authorization', authToken);
        const data = new FormData();
        data.append('imageDataFile', file);
        xhr.send(data);
        xhr.addEventListener('load', () =>
        {
          const response = JSON.parse(xhr.responseText);
          window.console.log(response)
          resolve(response);
        });
        xhr.addEventListener('error', () =>
        {
          const error = JSON.parse(xhr.responseText);
          window.console.log(error)
          reject(error);
        });
      }
    );
  }
  const uploadImage = async (event) =>
  {
    const {files} = event.target;
    const newFiles = Object.keys(files).map(i => ({image: files[i]}));
    const fileData = newFiles.map(file => promises.push(upload(file.image)))
    await Promise.all(promises).then(
      res =>
      {
        res && res.length > 0 ? res.map(item =>
        {
          const newItem = {link: item.link, id: newID()};
          dataImages.push(newItem)
        }) : dataImages,
          setBaseImages(res)
      }
    )
  }
  const onHandleChange = (event) =>
  {
    setLink({link: event.target.value, id: newID()})
  }


  const onSubmitInput = () =>
  {
    if (link.link)
    {
      let alreadyExist = false;
      dataImages.map(item =>
      {
        if (item.link === link.link)
        {
          alreadyExist = true;
          alert('Bạn đã nhập đường link này trước đó')
        }
      })
      window.console.log(alreadyExist)
      if (!alreadyExist)
      {
        dataImages.push(link)
      }
    }
    setLink({link: '', id: ''})
  }
  window.console.log(dataImages)

  const onDeleteImage = (id) =>
  {
    const array = dataImages.slice().filter(x => x.id !== id);

    setDataImages(array)
  }

  const showImage = () =>
  {
    let result = null;
    if (dataImages && dataImages.length > 0)
    {
      result = dataImages.map((image, index) =>
      {
        window.console.log(image.link)
        return (
          <div key={index} className='d-flex'>
            <div><img src={image.link} style={{width: 300, display: 'block'}} alt='link ảnh không đúng'/></div>
            <div className="mt-5">
              <button type="button" className="btn btn-danger" onClick={() => onDeleteImage(image.id)}>Xóa</button>
            </div>
          </div>
        )
      })
    }
    return result
  }


  const saveEntity = (event, errors, values) =>
  {
    values.createdDate = convertDateTimeToServer(values.createdDate);
    values.modifiedDate = convertDateTimeToServer(values.modifiedDate);

    if (errors.length === 0)
    {
      const entity = {
        ...postDetailsEntity,
        ...values,
        ...{content: contentState},
        ...{otherData: JSON.stringify(dataImages)}
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
  const [contentState, setContentState] = useState('');
  const handleModelChange = model => setContentState(model);
  useEffect(() =>
  {
    if (postDetailsEntity.content) setContentState(postDetailsEntity.content);
  }, [postDetailsEntity]);

  const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  const authToken = `Bearer ${token}`;
  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="minhShopApp.postDetails.home.createOrEditLabel" data-cy="PostDetailsCreateUpdateHeading">
            <Translate contentKey="minhShopApp.postDetails.home.createOrEditLabel">Create or edit a PostDetails</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : postDetailsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="post-details-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="post-details-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="uuidLabel" for="post-details-uuid">
                  <Translate contentKey="minhShopApp.postDetails.uuid">Uuid</Translate>
                </Label>
                <AvField
                  id="post-details-uuid"
                  data-cy="uuid"
                  type="text"
                  name="uuid"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="uuidLabel">
                  <Translate contentKey="minhShopApp.postDetails.help.uuid"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="postDetailsIdLabel" for="post-details-postDetailsId">
                  <Translate contentKey="minhShopApp.postDetails.postDetailsId">Post Details Id</Translate>
                </Label>
                <AvField
                  id="post-details-postDetailsId"
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
                  <Translate contentKey="minhShopApp.postDetails.help.postDetailsId"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <input type="text" onChange={onHandleChange} name="link" value={link.link}/>
                <button type='button' onClick={onSubmitInput}>Insert</button>
              </AvGroup>
              <AvGroup>
                <input type="file" onChange={(event) => uploadImage(event)} multiple/>
              </AvGroup>
              {showImage()}
              <AvGroup>
                <Label id="contentLabel" for="post-details-content">
                  <Translate contentKey="minhShopApp.postDetails.content">Content</Translate>
                </Label>
                <FroalaEditor
                  model={contentState}
                  onModelChange={handleModelChange}
                  config={{
                    imageUploadURL: '/api/images/upload',
                    imageUploadParam: 'imageDataFile',
                    requestHeaders: {
                      Authorization: authToken,
                    },
                    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
                    imageUploadMethod: 'POST',
                    imageUpload: true,
                  }}
                />
                {/*<FroalaEditorImg/>*/}
                <UncontrolledTooltip target="contentLabel">
                  <Translate contentKey="minhShopApp.postDetails.help.content"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="post-details-comment">
                  <Translate contentKey="minhShopApp.postDetails.comment">Comment</Translate>
                </Label>
                <AvField
                  id="post-details-comment"
                  data-cy="comment"
                  type="text"
                  name="comment"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="commentLabel">
                  <Translate contentKey="minhShopApp.postDetails.help.comment"/>
                </UncontrolledTooltip>
              </AvGroup>
              {/*<AvGroup>*/}
              {/*  <Label id="otherDataLabel" for="post-details-otherData">*/}
              {/*    <Translate contentKey="minhShopApp.postDetails.otherData">Other Data</Translate>*/}
              {/*  </Label>*/}
              {/*  <AvField*/}
              {/*    id="post-details-otherData"*/}
              {/*    data-cy="otherData"*/}
              {/*    type="text"*/}
              {/*    name="otherData"*/}
              {/*    validate={{*/}
              {/*      maxLength: {value: 10000, errorMessage: translate('entity.validation.maxlength', {max: 10000})},*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</AvGroup>*/}
              <Button tag={Link} id="cancel-save" to="/post-details" replace color="info">
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
  simplePosts: storeState.simplePost.entities,
  postDetailsEntity: storeState.postDetails.entity,
  loading: storeState.postDetails.loading,
  updating: storeState.postDetails.updating,
  updateSuccess: storeState.postDetails.updateSuccess,
});

const mapDispatchToProps = {
  getSimplePosts,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailsUpdate);
