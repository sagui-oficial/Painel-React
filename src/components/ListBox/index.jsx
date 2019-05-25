import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
} from '@material-ui/icons';

import Loading from '../Loading';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  listItem: {
    marginBottom: '15px',
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingRight: '50px',
    alignItems: 'start',
    borderRadius: '6px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
  },
  iconDelete: {
    top: '7px',
    right: '7px',
    transform: 'none',
  },
  smallItemText: {
    fontSize: '14px',
    color: '#616161',
    paddingBottom: '7px',
  },
  boxList: {
    paddingLeft: theme.spacing.unit * 1.8,
    '& p': {
      margin: 0,
    },
  },
});

class ListBox extends Component {
  ListBox = React.createRef()

  state = {
    loading: false,
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (prevProps.error !== error) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loading: false });
    }
  }

  onHandleDelete = (item) => {
    this.setState({ loading: true });
    const { onHandleDelete } = this.props;
    onHandleDelete(item);
  }

  render() {
    const {
      listItemsObject, classes, error, setBox,
    } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <List dense className={classes.root}>
        {listItemsObject.length ? (
          listItemsObject.map(item => (
            <ListItem
              key={item.PublicID}
              className={classes.listItem}
              ref={(el) => { this.ListBox = el; }}
              to={{
                pathname: `/${setBox.to}/${item.PublicID}`,
                state: { ...item },
              }}
              component={Link}
              button
            >
              <ListItemAvatar>
                <Avatar aria-label={item[setBox.title]} className={classes.avatar}>
                  {item[setBox.title].substring(0, 1).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <div className={classes.boxList}>
                <p className={classes.smallItemText}>
                  <strong>{`${setBox.label}: `}</strong>
                  {item[setBox.pretitle]}
                </p>
                <p>
                  <strong>{item[setBox.title]}</strong>
                </p>
              </div>
              <ListItemSecondaryAction className={classes.iconDelete}>
                <IconButton
                  disabled={!!error}
                  onClick={() => this.onHandleDelete(item)}
                  aria-label="Deletar"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <ListItem className={classes.listItem}>Nenhum item encontrado.</ListItem>
        )
        }
      </List>

    );
  }
}

ListBox.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  listItemsObject: PropTypes.instanceOf(Object).isRequired,
  setBox: PropTypes.instanceOf(Object).isRequired,
  onHandleDelete: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

export default withStyles(styles)(withRouter(ListBox));
