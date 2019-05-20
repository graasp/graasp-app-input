import React from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { connect } from 'react-redux';
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import 'react-toastify/dist/ReactToastify.css';
import Header from './layout/Header';
import i18nConfig from '../config/i18n';
import App from './App';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    default: grey,
    background: {
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange,
      color: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const Root = ({ headerVisible, classes }) => (
  <div className={classes.root}>
    <MuiThemeProvider theme={theme}>
      <I18nextProvider i18n={i18nConfig}>
        {headerVisible ? <Header /> : null}
        <App />
        <ToastContainer />
      </I18nextProvider>
    </MuiThemeProvider>
  </div>
);

Root.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  headerVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ appInstance }) => ({
  // by default this is true, but you can change that in the reducer
  headerVisible: appInstance.settings.headerVisible,
});

const StyledComponent = withStyles(styles)(Root);

export default connect(mapStateToProps)(StyledComponent);
