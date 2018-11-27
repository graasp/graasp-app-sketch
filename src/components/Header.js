import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ColorIcon from '@material-ui/icons/BorderColorRounded';
import SaveIcon from '@material-ui/icons/SaveRounded';
import { CirclePicker } from 'react-color';

const styles = {
  root: {
    flex: 1,
    // accommodate shadow from header
    marginBottom: '5px',
  },
  left: {
    flex: 1,
    textAlign: 'left',
  },
  right: {
    flex: 1,
    textAlign: 'right',
  },
  popover: {
    position: 'absolute',
    right: 10,
    zIndex: 5,
  },
  cover: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
};

class Header extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    changeColor: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
  };

  state = {
    displayColorPicker: false,
  };

  handleColorChange = (color) => {
    const { changeColor } = this.props;
    changeColor(color.hex);
    this.setState({
      displayColorPicker: false,
    });
  };

  toggleColorPicker = () => {
    const { displayColorPicker } = this.state;
    this.setState({
      displayColorPicker: !displayColorPicker,
    });
  };

  closeColorPicker = () => {
    this.setState({ displayColorPicker: false });
  };

  handleSave = () => {
    const { save } = this.props;
    save();
  };

  renderColorPicker = () => {
    const {
      displayColorPicker,
    } = this.state;

    const {
      classes,
    } = this.props;

    if (displayColorPicker) {
      return [
        <CirclePicker
          onChangeComplete={this.handleColorChange}
          className={classes.popover}
        />,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
        <div
          role="button"
          className={classes.cover}
          onClick={this.closeColorPicker}
        />,
      ];
    }
    return '';
  };

  render() {
    const {
      classes,
      clear,
      color,
    } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <div className={classes.left}>
              <Typography variant="title" color="inherit">
                Sketch
              </Typography>
            </div>
            <div className={classes.right}>
              <IconButton onClick={this.toggleColorPicker} style={{ color }}>
                <ColorIcon />
              </IconButton>
              {
                this.renderColorPicker()
              }
              <IconButton onClick={this.handleSave}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={clear}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
