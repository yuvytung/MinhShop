import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Label, Row, UncontrolledTooltip} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {setFileData, Translate, translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';

import {createEntity, getEntity, reset, setBlob, updateEntity} from './type-post.reducer';
import {convertDateTimeToServer} from 'app/shared/util/date-utils';

export interface ITypePostUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }>
{
}

export const TypePostUpdate = (props: ITypePostUpdateProps) =>
{
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const {typePostEntity, loading, updating} = props;

  const handleClose = () =>
  {
    props.history.push('/entity/type-post');
  };

  useEffect(() =>
  {
    if (!isNew)
    {
      props.getEntity(props.match.params.id);
    }
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
        ...typePostEntity,
        ...values,
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
          <h2 id="minhShopApp.typePost.home.createOrEditLabel" data-cy="TypePostCreateUpdateHeading">
            <Translate contentKey="minhShopApp.typePost.home.createOrEditLabel">Create or edit a TypePost</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : typePostEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="type-post-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="type-post-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="uuidLabel" for="type-post-uuid">
                  <Translate contentKey="minhShopApp.typePost.uuid">Uuid</Translate>
                </Label>
                <AvField
                  id="type-post-uuid"
                  data-cy="uuid"
                  type="text"
                  name="uuid"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="uuidLabel">
                  <Translate contentKey="minhShopApp.typePost.help.uuid"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="typeNameLabel" for="type-post-typeName">
                  <Translate contentKey="minhShopApp.typePost.typeName">Type Name</Translate>
                </Label>
                <AvField
                  id="type-post-typeName"
                  data-cy="typeName"
                  type="text"
                  name="typeName"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
                <UncontrolledTooltip target="typeNameLabel">
                  <Translate contentKey="minhShopApp.typePost.help.typeName"/>
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="type-post-comment">
                  <Translate contentKey="minhShopApp.typePost.comment">Comment</Translate>
                </Label>
                <AvField
                  id="type-post-comment"
                  data-cy="comment"
                  type="text"
                  name="comment"
                  validate={{
                    maxLength: {value: 2048, errorMessage: translate('entity.validation.maxlength', {max: 2048})},
                  }}
                />
                <UncontrolledTooltip target="commentLabel">
                  <Translate contentKey="minhShopApp.typePost.help.comment"/>
                </UncontrolledTooltip>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/type-post" replace color="info">
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
  typePostEntity: storeState.typePost.entity,
  loading: storeState.typePost.loading,
  updating: storeState.typePost.updating,
  updateSuccess: storeState.typePost.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypePostUpdate);
