import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import StudentView from './modes/student/StudentView';
import { getContext } from '../actions';
import { DEFAULT_LANG, DEFAULT_MODE } from '../config/settings';
import { DEFAULT_VIEW } from '../config/views';
import TeacherMode from './modes/teacher/TeacherMode';
import Header from './layout/Header';
import Loader from './common/Loader';
import { getAppData } from '../actions/appData';
import { getAuthToken } from '../actions/auth';

export class App extends Component {
  static propTypes = {
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
    dispatchGetContext: PropTypes.func.isRequired,
    dispatchGetAppData: PropTypes.func.isRequired,
    lang: PropTypes.string,
    mode: PropTypes.string,
    view: PropTypes.string,
    headerVisible: PropTypes.bool.isRequired,
    ready: PropTypes.bool.isRequired,
    standalone: PropTypes.bool.isRequired,
    dispatchGetAuthToken: PropTypes.func.isRequired,
    authActivity: PropTypes.bool.isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    lang: DEFAULT_LANG,
    mode: DEFAULT_MODE,
    view: DEFAULT_VIEW,
    token: null,
  };

  constructor(props) {
    super(props);
    // first thing to do is get the context
    props.dispatchGetContext();
  }

  componentDidMount() {
    const {
      lang,
      ready,
      dispatchGetAppData,
      dispatchGetAuthToken,
    } = this.props;
    // set the language on first load
    this.handleChangeLang(lang);

    dispatchGetAuthToken();

    if (ready) {
      dispatchGetAppData();
    }
  }

  componentDidUpdate({ lang: prevLang, ready: prevReady, token: prevToken }) {
    const {
      lang,
      dispatchGetAppData,
      ready,
      dispatchGetAuthToken,
      authActivity,
      token,
    } = this.props;

    // handle a change of language
    if (lang !== prevLang) {
      this.handleChangeLang(lang);
    }

    // get item data
    if (!authActivity && !token && token !== prevToken) {
      dispatchGetAuthToken();
    }

    if (ready && ready !== prevReady) {
      dispatchGetAppData();
    }
  }

  handleChangeLang = lang => {
    const { i18n } = this.props;
    i18n.changeLanguage(lang);
  };

  render() {
    const { mode, view, headerVisible, ready, standalone } = this.props;

    if (!standalone && !ready) {
      return <Loader />;
    }

    switch (mode) {
      // show teacher view when in producer (educator) mode
      case 'teacher':
      case 'producer':
      case 'educator':
      case 'admin':
        return (
          <Fragment>
            <Header />
            <TeacherMode view={view} />
          </Fragment>
        );

      // by default go with the consumer (learner) mode
      case 'student':
      case 'consumer':
      case 'learner':
      default:
        return (
          <Fragment>
            {headerVisible || standalone ? <Header /> : null}
            <StudentView />
          </Fragment>
        );
    }
  }
}

const mapStateToProps = ({ context, appInstance, auth, appData }) => ({
  headerVisible: appInstance.content.settings.headerVisible,
  lang: context.lang,
  mode: context.mode,
  view: context.view,
  ready: Boolean(auth.token),
  isAppDataReady: appData.ready,
  standalone: context.standalone,
  token: auth.token,
  authActivity: Boolean(auth.activity.length),
});

const mapDispatchToProps = {
  dispatchGetContext: getContext,
  dispatchGetAppData: getAppData,
  dispatchGetAuthToken: getAuthToken,
};

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default withTranslation()(ConnectedApp);
