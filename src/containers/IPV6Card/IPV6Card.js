import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Toggle from 'cf-component-toggle';
import {
  Card,
  CardSection,
  CardContent,
  CardControl,
  CardDrawers
} from 'cf-component-card';

import { asyncZoneUpdateSetting } from '../../actions/zoneSettings';
import { getLastModifiedDate } from '../../utils/utils';
import FormattedMarkdown
  from '../../components/FormattedMarkdown/FormattedMarkdown';
import {
  getZoneSettingsValueForZoneId,
  getZoneSettingsModifiedDateForZoneId
} from '../../selectors/zoneSettings';

const SETTING_NAME = 'ipv6';

class IPV6Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDrawer: null
    };
    this.handleDrawerClick = this.handleDrawerClick.bind(this);
  }

  handleDrawerClick(id) {
    this.setState({
      activeDrawer: id === this.state.activeDrawer ? null : id
    });
  }

  handleChange(value) {
    let { activeZoneId, dispatch } = this.props;
    value = value === true ? 'on' : 'off';
    dispatch(asyncZoneUpdateSetting(SETTING_NAME, activeZoneId, value));
  }

  render() {
    const { formatMessage } = this.props.intl;
    let { modifiedDate } = this.props;

    return (
      <div>
        <Card>
          <CardSection>
            <CardContent
              title={formatMessage({ id: 'container.ipv6Card.title' })}
              footerMessage={getLastModifiedDate(this.props.intl, modifiedDate)}
            >
              <p><FormattedMessage id="container.ipv6Card.description" /></p>
            </CardContent>
            <CardControl>
              <Toggle
                label=""
                value={this.props.ipv6Value === 'on'}
                onChange={this.handleChange.bind(this)}
              />
            </CardControl>
          </CardSection>
          <CardDrawers
            onClick={this.handleDrawerClick}
            active={this.state.activeDrawer}
            drawers={[
              {
                id: 'help',
                name: formatMessage({ id: 'container.drawer.help' }),
                content: (
                  <FormattedMarkdown text="container.ipv6Card.drawer.help" />
                )
              }
            ]}
          />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeZoneId: state.activeZone.id,
    ipv6Value: getZoneSettingsValueForZoneId(
      state.activeZone.id,
      SETTING_NAME,
      state
    ),
    modifiedDate: getZoneSettingsModifiedDateForZoneId(
      state.activeZone.id,
      SETTING_NAME,
      state
    )
  };
}
export default injectIntl(connect(mapStateToProps)(IPV6Card));
