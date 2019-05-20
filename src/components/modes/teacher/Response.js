import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../common/ConfirmDialog';
import {
  deleteAppInstanceResource,
  patchAppInstanceResource,
  postAppInstanceResource,
} from '../../../actions';
import { FEEDBACK } from '../../../config/appInstanceResourceTypes';
import FormDialog from '../../common/FormDialog';

class Response extends Component {
  state = {
    confirmDialogOpen: false,
    feedbackDialogOpen: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchDeleteAppInstanceResource: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    dispatchPatchAppInstanceResource: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired,
    data: PropTypes.string,
    student: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    feedbackResource: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      data: PropTypes.string,
    }),
  };

  static defaultProps = {
    data: '',
    feedbackResource: {},
  };

  handleToggleConfirmDialog = open => () => {
    this.setState({
      confirmDialogOpen: open,
    });
  };

  handleToggleFeedbackDialog = open => () => {
    this.setState({
      feedbackDialogOpen: open,
    });
  };

  handleConfirmDelete = () => {
    const { _id, dispatchDeleteAppInstanceResource } = this.props;
    dispatchDeleteAppInstanceResource(_id);
    this.handleToggleConfirmDialog(false)();
  };

  handleSubmitFeedback = feedback => {
    const {
      student,
      feedbackResource,
      dispatchPostAppInstanceResource,
      dispatchPatchAppInstanceResource,
    } = this.props;
    // if no feedback resource yet, create it, otherwise, update it
    if (_.isEmpty(feedbackResource)) {
      dispatchPostAppInstanceResource({
        data: feedback,
        userId: student.id,
        type: FEEDBACK,
      });
    } else {
      dispatchPatchAppInstanceResource({
        id: feedbackResource._id,
        data: feedback,
      });
    }
    this.handleToggleFeedbackDialog(false)();
  };

  renderFeedbackCell() {
    const {
      feedbackResource: { data = '' },
      t,
    } = this.props;
    const { feedbackDialogOpen } = this.state;

    return (
      <Fragment>
        {data}
        <IconButton
          color="primary"
          onClick={this.handleToggleFeedbackDialog(true)}
        >
          <EditIcon />
        </IconButton>
        <FormDialog
          handleClose={this.handleToggleFeedbackDialog(false)}
          title={t('Feedback')}
          text={t('Submit feedback that will be visible to the student.')}
          open={feedbackDialogOpen}
          initialInput={data}
          handleSubmit={this.handleSubmitFeedback}
        />
      </Fragment>
    );
  }

  render() {
    const { t, _id, data, student } = this.props;

    const { confirmDialogOpen } = this.state;

    return (
      <TableRow key={_id}>
        <TableCell>{student.name}</TableCell>
        <TableCell>{data}</TableCell>
        <TableCell>{this.renderFeedbackCell()}</TableCell>
        <TableCell>
          <IconButton
            color="primary"
            onClick={this.handleToggleConfirmDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
          <ConfirmDialog
            open={confirmDialogOpen}
            title={t('Delete Student Response')}
            text={t(
              'By clicking "Delete", you will be deleting the student\'s response. This action cannot be undone.'
            )}
            handleClose={this.handleToggleConfirmDialog(false)}
            handleConfirm={this.handleConfirmDelete}
            confirmText={t('Delete')}
            cancelText={t('Cancel')}
          />
        </TableCell>
      </TableRow>
    );
  }
}

const mapStateToProps = ({ appInstanceResources }, ownProps) => {
  const {
    student: { id },
  } = ownProps;
  const feedbackResource = appInstanceResources.content.find(
    ({ user, type }) => {
      return user === id && type === FEEDBACK;
    }
  );
  return {
    feedbackResource,
  };
};

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Response);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;
