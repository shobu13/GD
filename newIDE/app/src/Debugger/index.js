// @flow
import * as React from 'react';
import DebuggerContent from './DebuggerContent';
import optionalRequire from '../Utils/OptionalRequire';
const electron = optionalRequire('electron');
const ipcRenderer = electron ? electron.ipcRenderer : null;

type Props = {|
  project: gdProject,
  isActive: boolean,
|};
type State = {|
  debuggerServerStarted: boolean,
  debuggerServerError: ?any,
  debuggerConnectionOpen: boolean,
  gameContent: ?any,
|};

export default class Debugger extends React.Component<Props, State> {
  state = {
    debuggerServerStarted: false,
    debuggerServerError: null,
    debuggerConnectionOpen: false,
    gameContent: null,
  };

  componentDidMount() {
    if (this.props.isActive) {
      this._startServer();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isActive && !this.props.isActive) {
      this._startServer();
    }
  }

  _startServer = () => {
    if (!ipcRenderer) return;

    this.setState({
      debuggerServerStarted: false,
    });

    ipcRenderer.removeAllListeners('debugger-send-message-done');

    ipcRenderer.removeAllListeners('debugger-error-received');
    ipcRenderer.on('debugger-error-received', (event, err) => {
      this.setState({
        debuggerServerError: err,
      });
    });

    ipcRenderer.removeAllListeners('debugger-connection-closed');
    ipcRenderer.on('debugger-connection-closed', event => {
      this.setState({
        debuggerConnectionOpen: false,
      });
    });

    ipcRenderer.removeAllListeners('debugger-connection-opened');
    ipcRenderer.on('debugger-connection-opened', event => {
      this.setState({
        debuggerConnectionOpen: true,
      });
    });

    ipcRenderer.removeAllListeners('debugger-start-server-done');
    ipcRenderer.on('debugger-start-server-done', event => {
      this.setState({
        debuggerServerStarted: true,
      });
    });

    ipcRenderer.removeAllListeners('debugger-message-received');
    ipcRenderer.on('debugger-message-received', (event, message) => {
      //TODO: Handle message
      console.log('Processing message received for debugger');
      this.setState({
        gameContent: message,
      });
    });
    ipcRenderer.send('debugger-start-server');
  };

  _play = () => {
    if (!ipcRenderer) return;

    ipcRenderer.send('debugger-send-message', '{"command": "play"}');
  };

  _pause = () => {
    if (!ipcRenderer) return;

    ipcRenderer.send('debugger-send-message', '{"command": "pause"}');
  };

  render() {
    const {
      debuggerServerError,
      debuggerServerStarted,
      debuggerConnectionOpen,
      gameContent,
    } = this.state;

    return (
      <DebuggerContent
        debuggerServerError={debuggerServerError}
        debuggerServerStarted={debuggerServerStarted}
        debuggerConnectionOpen={debuggerConnectionOpen}
        gameContent={gameContent}
        onPlay={this._play}
        onPause={this._pause}
      />
    );
  }
}
