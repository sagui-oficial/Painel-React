import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// MATERIAL IMPORTS
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  Typography,
  Divider,
} from '@material-ui/core';

// LOCAL IMPORTS
import Master from '../../components/Master';
import { loadProcedimentos } from '../../actions/procedimentos';
import ProcedimentosList from './List';

const styles = theme => ({
  divider: {
    ...theme.divider,
    marginBottom: 0,
  },
  addBtn: {
    ...theme.roundedBtn,
    marginLeft: '1.5rem',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
      marginTop: '0.5rem',
      width: '100%',
    },
  },
});

class Procedimentos extends Component {
  constructor(props) {
    super(props);
    this.onHandleAddNew = this.onHandleAddNew.bind(this);
  }

  componentDidMount() {
    const { loadProcedimentos: propLoadItems } = this.props;
    propLoadItems();
  }

  onHandleAddNew() {
    const { history } = this.props;
    history.push('/procedimentos/cadastrar');
  }

  render() {
    const {
      classes, error, procedimentos, title,
    } = this.props;

    return (
      <Master title={title}>
        {procedimentos && (
          <Fragment>
            <Grid container alignItems="center">
              <Typography variant="h6" color="inherit" noWrap>
                {title}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                className={classes.addBtn}
                disabled={!!error}
                onClick={this.onHandleAddNew}
              >
                +Novo
              </Button>
            </Grid>
            <Divider className={classes.divider} />
            <ProcedimentosList procedimentos={procedimentos} error={error} />
          </Fragment>
        )}
      </Master>
    );
  }
}

Procedimentos.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  procedimentos: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  loadProcedimentos: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
};

Procedimentos.defaultProps = {
  title: String(),
};

const mapStateToProps = state => ({
  procedimentos: state.procedimentosReducer.procedimentos,
  error: state.procedimentosReducer.fetchError,
});

export default connect(mapStateToProps, {
  loadProcedimentos,
})(withStyles(styles)(Procedimentos));
