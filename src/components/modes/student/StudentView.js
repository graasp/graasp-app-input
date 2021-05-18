import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { postAction } from '../../../actions';
import { FEEDBACK, INPUT } from '../../../config/appInstanceResourceTypes';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';
import { SAVED } from '../../../config/verbs';
import {
  getAppData,
  patchAppData,
  postAppData,
} from '../../../actions/appData';

const styles = theme => ({
  main: {
    textAlign: 'center',
    flex: 1,
    padding: theme.spacing.unit,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  },
  message: {
    padding: theme.spacing.unit,
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
});

class StudentView extends Component {
  state = {
    text: '',
    createdInputResource: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppData: PropTypes.func.isRequired,
    dispatchPatchAppData: PropTypes.func.isRequired,
    dispatchGetAppData: PropTypes.func.isRequired,
    dispatchPostAction: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      container: PropTypes.string,
      message: PropTypes.string,
      button: PropTypes.string,
      textField: PropTypes.string,
    }).isRequired,
    feedback: PropTypes.string,
    userId: PropTypes.string,
    inputResourceId: PropTypes.string,
    ready: PropTypes.bool,
    offline: PropTypes.bool,
    standalone: PropTypes.bool.isRequired,
    activity: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    feedback: '',
    userId: null,
    inputResourceId: null,
    activity: false,
    ready: false,
    offline: false,
    text: null,
  };

  saveToApi = _.debounce(({ data }) => {
    const { dispatchPatchAppData, inputResourceId } = this.props;
    if (inputResourceId) {
      dispatchPatchAppData({
        data: { text: data },
        id: inputResourceId,
      });
    }
  }, 1000);

  constructor(props) {
    super(props);
    props.dispatchGetAppData();
  }

  componentDidMount() {
    const { text } = this.props;

    if (text) {
      this.setState({ text });
    }
  }

  componentDidUpdate(
    {
      inputResourceId: prevInputAppInstanceResourceId,
      userId: prevUserId,
      text: prevPropText,
    },
    { text: prevStateText }
  ) {
    const { inputResourceId, text, userId, offline } = this.props;

    // on update creation of app instance resource only online
    if (!offline) {
      if (
        inputResourceId !== prevInputAppInstanceResourceId ||
        userId !== prevUserId ||
        !inputResourceId
      ) {
        this.createInputAppData();
      }
    }

    // set state here safely by ensuring that it does not cause an infinite loop
    if (prevPropText !== text && prevStateText !== text) {
      // eslint-disable-next-line
      this.setState({ text });
    }
  }

  createInputAppData = () => {
    const {
      inputResourceId,
      dispatchPostAppData,
      ready,
      activity,
    } = this.props;
    const { createdInputResource } = this.state;

    // only create this resource once
    if (!createdInputResource) {
      // if there is no user id we cannot create the resource, so abort,
      // otherwise create the resource to save the text if it does not exist
      if (ready && !inputResourceId && !activity) {
        dispatchPostAppData({ text: '', type: INPUT });
        this.setState({ createdInputResource: true });
      }
    }
  };

  handleChangeText = ({ target }) => {
    const { value } = target;
    const { userId, offline } = this.props;
    this.setState({
      text: value,
    });
    // only save automatically if online and there is actually a userId
    if (!offline && userId) {
      this.saveToApi({ data: value });
    }
  };

  handleClickSaveText = () => {
    const { text } = this.state;
    const {
      dispatchPatchAppData,
      dispatchPostAppData,
      dispatchPostAction,
      inputResourceId,
      userId,
    } = this.props;

    // if there is a resource id already, update, otherwise create
    if (inputResourceId) {
      dispatchPatchAppData({
        data: text,
        id: inputResourceId,
      });
    } else {
      dispatchPostAppData({
        data: text,
        type: INPUT,
        userId,
      });
    }
    dispatchPostAction({
      verb: SAVED,
      data: {
        data: text,
        id: inputResourceId,
      },
    });
  };

  withTooltip = (elem, disabled) => {
    return (
      <Tooltip title="All changes saved.">
        <span>{React.cloneElement(elem, { disabled })}</span>
      </Tooltip>
    );
  };

  renderButton() {
    const { t, offline, classes, text: propsText } = this.props;
    const { text: stateText } = this.state;

    // if text is different, we enable save button
    const textIsDifferent = stateText === propsText;

    // button is only visible offline
    if (!offline) {
      return null;
    }

    const saveButton = (
      <Button
        data-cy="save"
        variant="contained"
        color="primary"
        onClick={this.handleClickSaveText}
      >
        {t('Save')}
      </Button>
    );

    return (
      <div align="right" className={classes.button}>
        {textIsDifferent
          ? this.withTooltip(saveButton, textIsDifferent)
          : saveButton}
      </div>
    );
  }

  render() {
    const { t, classes, ready, standalone } = this.props;
    const { text } = this.state;
    let { feedback } = this.props;
    if (feedback && feedback !== '') {
      feedback = `${t('Feedback')}: ${feedback}`;
    }

    if (!standalone && !ready) {
      return <Loader />;
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              autoFocus={standalone}
              inputProps={{
                maxLength: MAX_INPUT_LENGTH,
              }}
              data-cy="input"
              key="inputTextField"
              id="inputTextField"
              label={t('Type Here')}
              multiline
              rowsMax={MAX_ROWS}
              value={text}
              onChange={this.handleChangeText}
              className={classes.textField}
              margin="normal"
              helperText={feedback}
              variant="outlined"
              fullWidth
            />
          </form>
          {this.renderButton()}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ context, appData }) => {
  const { offline, standalone, userId, token } = context;
  const inputResource = appData.content?.find(({ type }) => {
    return type === INPUT;
  });
  const feedbackResource = appData.content?.find(({ user, type }) => {
    return user === userId && type === FEEDBACK;
  });

  return {
    userId,
    offline,
    standalone,
    inputResourceId: inputResource && (inputResource.id || inputResource._id),
    activity: Boolean(appData.activity.length),
    ready: Boolean(token) && appData.ready,
    text: inputResource?.data?.text,
    feedback: feedbackResource && feedbackResource.data,
  };
};

const mapDispatchToProps = {
  dispatchPostAction: postAction,
  dispatchGetAppData: getAppData,
  dispatchPatchAppData: patchAppData,
  dispatchPostAppData: postAppData,
};

const StyledComponent = withStyles(styles)(StudentView);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
