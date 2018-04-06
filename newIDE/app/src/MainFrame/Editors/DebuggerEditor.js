// @flow
import * as React from 'react';
import Debugger from '../../Debugger';
import BaseEditor from './BaseEditor';

export default class DebuggerEditor extends BaseEditor {
  render() {
    return <Debugger {...this.props} />;
  }
}
