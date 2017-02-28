import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, CardSection, CardContent, CardControl } from 'cf-component-card';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
  ModalActions
} from 'cf-component-modal';
import Toggle from 'cf-component-toggle';
import { Button } from 'cf-component-button';

import { asyncPluginUpdateSetting } from '../../actions/pluginSettings';
import {
  getPluginSettingsValueForZoneId,
  getPluginSettingsModifiedDateForZoneId
} from '../../selectors/pluginSettings';
import { getLastModifiedDate } from '../../utils/utils';

const SETTING_NAME = 'plugin_specific_cache';

class PluginSpecificCacheCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  handleModalOpen() {
    this.setState({ isModalOpen: true });
  }

  handleModalClose() {
    this.setState({ isModalOpen: false });
  }

  handleChange(value) {
    if (value === true && this.state.isModalOpen === false) {
      this.handleModalOpen();
    } else {
      this.handleModalClose();

      let { activeZoneId, dispatch } = this.props;
      value = value === true ? 'on' : 'off';
      dispatch(asyncPluginUpdateSetting(SETTING_NAME, activeZoneId, value));
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    let { modifiedDate } = this.props;

    return (
      <div>
        <Card>
          <CardSection>
            <CardContent
              title={formatMessage({
                id: 'container.pluginSpecificCacheCard.title'
              })}
              footerMessage={getLastModifiedDate(this.props.intl, modifiedDate)}
            >
              <p>
                <FormattedMessage
                  id="container.pluginSpecificCacheCard.description"
                />
              </p>
            </CardContent>
            <CardControl>
              <Toggle
                label=""
                value={this.props.cacheCardValue === 'on'}
                onChange={this.handleChange.bind(this)}
              />
              <Modal
                isOpen={this.state.isModalOpen}
                onRequestClose={this.handleModalClose.bind(this)}
              >
                <ModalHeader>
                  <ModalTitle>
                    <FormattedMessage
                      id="container.pluginSpecificCacheCard.modal.title"
                    />
                  </ModalTitle>
                  <ModalClose onClick={this.handleModalClose.bind(this)} />
                </ModalHeader>
                <ModalBody>
                  <p>
                    <FormattedMessage
                      id="container.pluginSpecificCacheCard.modal.description"
                    />
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalActions>
                    <Button
                      type="primary"
                      onClick={this.handleChange.bind(this, true)}
                    >
                      <FormattedMessage
                        id="container.pluginSpecificCacheCard.modal.button"
                      />
                    </Button>
                    <Button onClick={this.handleModalClose.bind(this)}>
                      <FormattedMessage
                        id="container.pluginSpecificCacheCard.modal.buttonCancel"
                      />
                    </Button>
                  </ModalActions>
                </ModalFooter>
              </Modal>
            </CardControl>
          </CardSection>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeZoneId: state.activeZone.id,
    cacheCardValue: getPluginSettingsValueForZoneId(
      state.activeZone.id,
      SETTING_NAME,
      state
    ),
    modifiedDate: getPluginSettingsModifiedDateForZoneId(
      state.activeZone.id,
      SETTING_NAME,
      state
    ),
    integrationName: state.config.config.integrationName
  };
}
export default injectIntl(connect(mapStateToProps)(PluginSpecificCacheCard));
