import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, UncontrolledTooltip} from 'reactstrap';
import {AvFeedback, AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {setFileData, Translate, translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getPostDetails} from 'app/entities/post-details/post-details.reducer';
import {getEntities as getTypePosts} from 'app/entities/type-post/type-post.reducer';
import {getEntities as getTypePostFilters} from 'app/entities/type-post-filter/type-post-filter.reducer';
import {createEntity, getEntity, reset, setBlob, updateEntity} from './simple-post.reducer';
import {convertDateTimeToServer} from 'app/shared/util/date-utils';
import {mapIdList} from 'app/shared/util/entity-utils';

export interface ISimplePostUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }>
{
}

export const SimplePostUpdate = (props: ISimplePostUpdateProps) =>
{
  const [idstypePostFilter, setIdstypePostFilter] = useState([]);
  const [postDetailsId, setPostDetailsId] = useState('0');
  const [typePostId, setTypePostId] = useState('0');
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const {simplePostEntity, postDetails, typePosts, typePostFilters, loading, updating} = props;

  const {searchField} = simplePostEntity;

  const handleClose = () =>
  {
    props.history.push('/entity/simple-post');
  };

  useEffect(() =>
  {
    if (!isNew)
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

  const saveEntity = (event, errors, values) =>
  {
    values.createdDate = convertDateTimeToServer(values.createdDate);
    values.modifiedDate = convertDateTimeToServer(values.modifiedDate);

    if (errors.length === 0)
    {
      const entity = {
        ...simplePostEntity,
        ...values,
        typePostFilters: mapIdList(values.typePostFilters),
        postDetails: postDetails.find(it => it.id.toString() === values.postDetailsId.toString()),
        typePost: typePosts.find(it => it.id.toString() === values.typePostId.toString()),
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

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="minhShopApp.simplePost.home.createOrEditLabel" data-cy="SimplePostCreateUpdateHeading">
            <Translate contentKey="minhShopApp.simplePost.home.createOrEditLabel">Create or edit a SimplePost</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : simplePostEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="simple-post-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="simple-post-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="uuidLabel" for="simple-post-uuid">
                  <Translate contentKey="minhShopApp.simplePost.uuid">Uuid</Translate>
                </Label>
                <AvField
                  id="simple-post-uuid"
                  data-cy="uuid"
                  type="text"
                  name="uuid"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="uuidLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.uuid"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="titleLabel" for="simple-post-title">
                  <Translate contentKey="minhShopApp.simplePost.title">Title</Translate>
                </Label>
                <AvField
                  id="simple-post-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="titleLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.title"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="simple-post-price">
                  <Translate contentKey="minhShopApp.simplePost.price">Price</Translate>
                </Label>
                <AvField id="simple-post-price" data-cy="price" type="string" className="form-control" name="price"/>
                <UncontrolledTooltip target="priceLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.price"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="salePriceLabel" for="simple-post-salePrice">
                  <Translate contentKey="minhShopApp.simplePost.salePrice">Sale Price</Translate>
                </Label>
                <AvField id="simple-post-salePrice" data-cy="salePrice" type="string" className="form-control" name="salePrice"/>
                <UncontrolledTooltip target="salePriceLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.salePrice"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="percentSaleLabel" for="simple-post-percentSale">
                  <Translate contentKey="minhShopApp.simplePost.percentSale">Percent Sale</Translate>
                </Label>
                <AvField
                  id="simple-post-percentSale"
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
                  <Translate contentKey="minhShopApp.simplePost.help.percentSale"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="imageUrlLabel" for="simple-post-imageUrl">
                  <Translate contentKey="minhShopApp.simplePost.imageUrl">Image Url</Translate>
                </Label>
                <AvField
                  id="simple-post-imageUrl"
                  data-cy="imageUrl"
                  type="text"
                  name="imageUrl"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="imageUrlLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.imageUrl"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="scoresLabel" for="simple-post-scores">
                  <Translate contentKey="minhShopApp.simplePost.scores">Scores</Translate>
                </Label>
                <AvField
                  id="simple-post-scores"
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
                  <Translate contentKey="minhShopApp.simplePost.help.scores"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="simpleContentLabel" for="simple-post-simpleContent">
                  <Translate contentKey="minhShopApp.simplePost.simpleContent">Simple Content</Translate>
                </Label>
                <AvField id="simple-post-simpleContent" data-cy="simpleContent" type="text" name="simpleContent"/>
                <UncontrolledTooltip target="simpleContentLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.simpleContent"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="otherInfoLabel" for="simple-post-otherInfo">
                  <Translate contentKey="minhShopApp.simplePost.otherInfo">Other Info</Translate>
                </Label>
                <AvField id="simple-post-otherInfo" data-cy="otherInfo" type="text" name="otherInfo"/>
                <UncontrolledTooltip target="otherInfoLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.otherInfo"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="simple-post-comment">
                  <Translate contentKey="minhShopApp.simplePost.comment">Comment</Translate>
                </Label>
                <AvField
                  id="simple-post-comment"
                  data-cy="comment"
                  type="text"
                  name="comment"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="commentLabel">
                  <Translate contentKey="minhShopApp.simplePost.help.comment"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label for="simple-post-postDetails">
                  <Translate contentKey="minhShopApp.simplePost.postDetails">Post Details</Translate>
                </Label>
                <AvInput
                  id="simple-post-postDetails"
                  data-cy="postDetails"
                  type="select"
                  className="form-control"
                  name="postDetailsId"
                  required
                >
                  <option value="" key="0"/>
                  {postDetails
                    ? postDetails.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.postDetailsId}
                      </option>
                    ))
                    : null}
                </AvInput>
                <AvFeedback>
                  <Translate contentKey="entity.validation.required">This field is required.</Translate>
                </AvFeedback>
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
              <Button tag={Link} id="cancel-save" to="/simple-post" replace color="info">
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
  postDetails: storeState.postDetails.entities,
  typePosts: storeState.typePost.entities,
  typePostFilters: storeState.typePostFilter.entities,
  simplePostEntity: storeState.simplePost.entity,
  loading: storeState.simplePost.loading,
  updating: storeState.simplePost.updating,
  updateSuccess: storeState.simplePost.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(SimplePostUpdate);
