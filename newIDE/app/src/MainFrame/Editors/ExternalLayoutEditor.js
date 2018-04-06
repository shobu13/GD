// @flow
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import InstancesFullEditor from '../../SceneEditor/InstancesFullEditor';
import { serializeToJSObject } from '../../Utils/Serializer';
import PlaceholderMessage from '../../UI/PlaceholderMessage';
import BaseEditor from './BaseEditor';
import LayoutChooserDialog from './LayoutChooserDialog';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
  },
};

export default class ExternalLayoutEditor extends BaseEditor {
  editor: ?typeof InstancesFullEditor;
  state = {
    layoutChooserOpen: false,
  };

  updateToolbar() {
    if (this.editor) this.editor.updateToolbar();
  }

  getSerializedElements() {
    const externalLayout = this.getExternalLayout();
    const layout = this.getLayout();
    if (!externalLayout || !layout) return {};

    return {
      ...BaseEditor.getLayoutSerializedElements(layout),
      instances: serializeToJSObject(externalLayout.getInitialInstances()),
      uiSettings: this.editor ? this.editor.getUiSettings() : {},
    };
  }

  getExternalLayout(): ?gdExternalLayout {
    const { project, externalLayoutName } = this.props;
    if (!project.hasExternalLayoutNamed(externalLayoutName)) {
      return null;
    }
    return project.getExternalLayout(externalLayoutName);
  }

  getLayout(): ?gdLayout {
    const { project } = this.props;

    const externalLayout = this.getExternalLayout();
    if (!externalLayout) return null;

    const layoutName = externalLayout.getAssociatedLayout();
    if (!project.hasLayoutNamed(layoutName)) {
      return null;
    }
    return project.getLayout(layoutName);
  }

  setAssociatedLayout = (layoutName: string) => {
    const externalLayout = this.getExternalLayout();
    if (!externalLayout) return;

    externalLayout.setAssociatedLayout(layoutName);
    this.setState(
      {
        layoutChooserOpen: false,
      },
      () => this.updateToolbar()
    );
  };

  openLayoutChooser = () => {
    this.setState({
      layoutChooserOpen: true,
    });
  };

  render() {
    const { project, externalLayoutName, isActive } = this.props;
    const externalLayout = this.getExternalLayout();
    const layout = this.getLayout();

    if (!externalLayout) {
      //TODO: Error component
      return <div>No external layout called {externalLayoutName} found!</div>;
    }

    return (
      <div style={styles.container}>
        {layout && (
          <InstancesFullEditor
            {...this.props}
            ref={editor => (this.editor = editor)}
            project={project}
            layout={layout}
            initialInstances={externalLayout.getInitialInstances()}
            initialUiSettings={serializeToJSObject(
              externalLayout.getAssociatedSettings()
            )}
            onPreview={options =>
              this.props.onPreview(project, layout, externalLayout, options)}
            onOpenDebugger={this.props.onOpenDebugger}
            onOpenMoreSettings={this.openLayoutChooser}
            isActive={isActive}
          />
        )}
        {!layout && (
          <PlaceholderMessage>
            To edit the external layout, choose the scene in which it will be
            included:
            <RaisedButton
              label="Choose the scene"
              primary
              onClick={this.openLayoutChooser}
            />
          </PlaceholderMessage>
        )}
        <LayoutChooserDialog
          title="Choose the associated scene"
          open={this.state.layoutChooserOpen}
          project={project}
          onChoose={this.setAssociatedLayout}
          onClose={() => this.setState({ layoutChooserOpen: false })}
        />
      </div>
    );
  }
}
