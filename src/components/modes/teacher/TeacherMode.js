import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TeacherView from './TeacherView';
import TeacherDashboard from './TeacherDashboard';
import { DEFAULT_VIEW, DASHBOARD_VIEW } from '../../../config/views';
import { getAppData, getAppInstanceResources } from '../../../actions';
import Loader from '../../common/Loader';

class TeacherMode extends Component {
  static propTypes = {
    view: PropTypes.string,
    activity: PropTypes.bool,
    dispatchGetAppData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    view: 'normal',
    activity: false,
  };

  constructor(props) {
    super(props);

    // get all of the resources
    props.dispatchGetAppData();
  }

  render() {
    const { view, activity } = this.props;
    if (activity) {
      return <Loader />;
    }
    switch (view) {
      case DASHBOARD_VIEW:
        return <TeacherDashboard />;
      case DEFAULT_VIEW:
      default:
        return <TeacherView />;
    }
  }
}
const mapStateToProps = ({ appInstanceResources }) => ({
  activity: appInstanceResources.activity.length,
});

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchGetAppData: getAppData,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherMode);

export default ConnectedComponent;
