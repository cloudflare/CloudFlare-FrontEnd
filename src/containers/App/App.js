import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, IntlProvider } from 'react-intl';
import { GatewayDest, GatewayProvider } from 'react-gateway';

import { LayoutContainer, LayoutRow, LayoutColumn } from 'cf-component-layout';

import AppNavigation from '../../containers/AppNavigation/AppNavigation';
import { isLoggedIn } from '../../utils/Auth/Auth';
import { asyncConfigInit } from '../../actions/config';
import GlobalNotifications from '../../containers/GlobalNotifications/GlobalNotifications';
import Header from '../../containers/Header/Header';
import GradientBanner from '../../components/GradientBanner/GradientBanner';

import { StyleProvider } from 'cf-style-provider';

//Safari Intl Polyfill
if (!global.Intl) {
  require('intl');
}
class AppContainer extends Component {
  render() {
    return (
      <StyleProvider
        dev={process.env.NODE_ENV === 'development'}
        selectorPrefix="cf-"
      >
        <div className="site-wrapper" style={{ paddingBottom: '20px' }}>
          <LayoutContainer>
            <LayoutRow>
              <Header />
              {isLoggedIn() ? null : <GradientBanner />}
            </LayoutRow>
            <div
              className="content-wrapper"
              style={isLoggedIn() ? null : { marginTop: '-105px' }}
            >
              {isLoggedIn() ? (
                <LayoutRow>
                  <LayoutColumn width={1 / 1}>
                    <AppNavigation />
                  </LayoutColumn>
                </LayoutRow>
              ) : null}

              {isLoggedIn() ? (
                <LayoutRow>
                  <LayoutColumn width={2 / 20}>&nbsp;</LayoutColumn>
                  <LayoutColumn width={16 / 20}>
                    {this.props.children}
                  </LayoutColumn>
                  <LayoutColumn width={2 / 20}>&nbsp;</LayoutColumn>
                </LayoutRow>
              ) : (
                <LayoutRow>{this.props.children}</LayoutRow>
              )}
              <LayoutRow>
                <LayoutColumn width={1 / 1}>
                  <p style={{ textAlign: 'center' }}>
                    <FormattedMessage
                      id="container.App.version"
                      values={{
                        version: this.props.state.config.config.version
                      }}
                    />
                  </p>
                </LayoutColumn>
              </LayoutRow>
            </div>
          </LayoutContainer>
          <GatewayDest name="modal" />
          <GlobalNotifications />
        </div>
      </StyleProvider>
    );
  }
}

function mapStateToProps(state) {
  return { state: state };
}

// <IntlProvider> must be instantiated before injectIntl() is used so we wrap AppContainer in AppWrapper
const App = injectIntl(connect(mapStateToProps)(AppContainer));

class AppWrapper extends React.Component {
  componentWillMount() {
    let { dispatch } = this.props;
    dispatch(asyncConfigInit());
  }

  render() {
    if (this.props.state.app.isInitialized) {
      return (
        <IntlProvider
          locale={this.props.state.intl.locale}
          messages={this.props.state.intl.translations}
        >
          <GatewayProvider>
            <App>{this.props.children}</App>
          </GatewayProvider>
        </IntlProvider>
      );
    }

    return <noscript />;
  }
}

export default connect(mapStateToProps)(AppWrapper);
