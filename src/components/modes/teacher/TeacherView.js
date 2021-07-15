import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import './TeacherView.css';
import {
  patchAppInstanceResource,
  postAppInstanceResource,
  deleteAppInstanceResource,
  getUsers,
  openSettings,
} from '../../../actions';
import Responses from './Responses';
import { INPUT } from '../../../config/appInstanceResourceTypes';
import Settings from './Settings';

export class TeacherView extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string,
      main: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    dispatchOpenSettings: PropTypes.func.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    ).isRequired,
    appData: PropTypes.shape({}).isRequired,
  };

  static styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
    },
    main: {
      textAlign: 'center',
      margin: theme.spacing.unit,
      padding: theme.spacing.unit,
      overflowX: 'hidden',
    },
    fab: {
      margin: theme.spacing.unit,
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
  });

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

  render() {
    // extract properties from the props object
    const {
      t,
      members,
      appData,
      dispatchOpenSettings,
      // this property allows us to do styling and is injected by withStyles
      classes,
    } = this.props;
    return (
      <div>
        <Grid container spacing={0} className={classes.root}>
          <Grid item xs={12} className={classes.main}>
            <Responses
              students={members}
              appData={appData.filter(resource => resource.type === INPUT)}
            />
          </Grid>
        </Grid>
        <Settings />
        <Fab
          data-cy="settingsButton"
          color="primary"
          aria-label={t('Settings')}
          className={classes.fab}
          onClick={dispatchOpenSettings}
        >
          <SettingsIcon />
        </Fab>
      </div>
    );
  }
}

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ users, appData }) => ({
  members: users.content,
  appData: appData.content,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchOpenSettings: openSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
