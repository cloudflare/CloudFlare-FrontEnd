import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import ActiveZoneSelector
  from '../../containers/ActiveZoneSelector/ActiveZoneSelector';
import { isLoggedIn } from '../../utils/Auth/Auth';
import { getAbsoluteUrl } from '../../selectors/config';
import UnderAttackButton
  from '../../containers/UnderAttackButton/UnderAttackButton';
import { LayoutColumn } from 'cf-component-layout';

class Header extends Component {
  render() {
    let { config, activeZone, zoneSettings } = this.props;

    var logoStyle = {
      width: '170px',
      height: '30px',
      position: 'relative',
      top: '30px', // Hard code .header-main height/2
      transform: 'translateY(-50%)'
    };

    var columnStyle = {
      position: 'relative'
    };

    return (
      <header id="header" className="header app-header">
        <div className="gradient-bar-header" />
        <div id="header-global" className="header-main">
          <LayoutColumn width={1 / 8} style={columnStyle}>
            <img
              style={logoStyle}
              src={getAbsoluteUrl(config, 'assets/logo.svg')}
            />
          </LayoutColumn>
          <LayoutColumn width={1 / 8} style={columnStyle}>
            <ActiveZoneSelector />
          </LayoutColumn>
          <LayoutColumn width={6 / 8} style={columnStyle}>
            {isLoggedIn() && zoneSettings.entities[activeZone.id]
              ? <UnderAttackButton />
              : null}
          </LayoutColumn>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
    activeZone: state.activeZone,
    zoneSettings: state.zoneSettings
  };
}

export default injectIntl(connect(mapStateToProps)(Header));
