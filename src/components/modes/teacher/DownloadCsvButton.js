import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { CSVLink as CsvLink } from 'react-csv';
import { IconButton } from '@material-ui/core';
import { Parser } from 'json2csv';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { withTranslation } from 'react-i18next';
import { INPUT, FEEDBACK } from '../../../config/appInstanceResourceTypes';

const DownloadCsvButton = ({ appInstanceResources, users, t }) => {
  if (!appInstanceResources.length || !users.length) {
    return null;
  }

  const formattedData = Object.entries(
    _.groupBy(appInstanceResources, 'user')
  ).map(([user, elements]) => {
    const userData = users.find(({ id }) => id === user);
    const name = userData ? userData.name : t('Anonymous');
    const { data: input } = elements.find(({ type }) => type === INPUT);
    const entry = { name, input };

    // export feedback if any
    const feedback = elements.find(({ type }) => type === FEEDBACK);
    if (feedback) {
      entry.feedback = feedback.data;
    }
    return entry;
  });

  const json2csvParser = new Parser();
  const csvData = json2csvParser.parse(formattedData);

  return (
    <CsvLink data={csvData} filename="data.csv">
      <IconButton>
        <DownloadIcon nativeColor="#fff" />
      </IconButton>
    </CsvLink>
  );
};

DownloadCsvButton.propTypes = {
  appInstanceResources: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
    })
  ),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  t: PropTypes.func.isRequired,
};

DownloadCsvButton.defaultProps = {
  users: [],
  appInstanceResources: [],
};

const mapStateToProps = ({ appInstanceResources, users }) => ({
  appInstanceResources: appInstanceResources.content,
  users: users.content,
});

const ConnectedComponent = connect(
  mapStateToProps,
  null
)(DownloadCsvButton);

export default withTranslation()(ConnectedComponent);
