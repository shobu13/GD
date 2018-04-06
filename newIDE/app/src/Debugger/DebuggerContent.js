// @flow
import * as React from 'react';
import PlaceholderLoader from '../UI/PlaceholderLoader';
import { Column } from '../UI/Grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {|
  debuggerServerError: ?any,
  debuggerServerStarted: boolean,
  debuggerConnectionOpen: boolean,
  gameContent: ?any,
  onPlay: () => void,
  onPause: () => void,
|};

const styles = {
  container: { flex: 1 },
};

export default class DebuggerContent extends React.Component<Props, {}> {
  render() {
    const {
      debuggerServerError,
      debuggerServerStarted,
      debuggerConnectionOpen,
      gameContent,
      onPlay,
      onPause,
    } = this.props;

    return (
      <Paper style={styles.container}>
        <Column>
          {!debuggerServerStarted &&
            !debuggerServerError && (
              <div>
                <PlaceholderLoader />
                <p>Debugger is starting...</p>
              </div>
            )}
          {!debuggerServerStarted &&
            debuggerServerError && (
              <div>
                <p>
                  Unable to start the debugger server for the preview! Make sure
                  that you are authorized to run servers on this computer.
                </p>
              </div>
            )}
          {debuggerServerStarted &&
            !debuggerConnectionOpen && (
              <div>
                <PlaceholderLoader />
                <p>
                  Waiting for a game to start and connect to the debugger...
                </p>
              </div>
            )}
          {debuggerServerStarted &&
            debuggerConnectionOpen && (
              <div>
                <RaisedButton label="Play" onClick={onPlay} />
                <RaisedButton label="Pause" onClick={onPause} />
                {!!gameContent}
              </div>
            )}
        </Column>
      </Paper>
    );
  }
}
