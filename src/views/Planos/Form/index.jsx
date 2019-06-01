import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Grid,
  Divider,
  TextField,
} from '@material-ui/core';

import Master from '../../../components/Master';
import { addPlano, loadPlanoDetail, updatePlano } from '../../../actions/planos';
import Breadcrumb from '../../../components/Breadcrumb';
import Message from '../../../components/Message';
import Loading from '../../../components/Loading';

const styles = theme => ({
  divider: {
    ...theme.divider,
    marginBottom: theme.spacing.unit * 1.2,
  },
  form: {
    marginTop: theme.spacing.unit * 2,
  },
  addBtn: {
    ...theme.roundedBtn,
    marginLeft: '1.5rem',
    '&.footerBtn': {
      marginLeft: 0,
      marginTop: theme.spacing.unit * 5,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
      marginTop: '0.5rem',
      width: '100%',
    },
  },
  smallItemText: {
    fontSize: '14px',
    color: '#616161',
  },
  listProcess: {
    marginBottom: '10px',
    borderRadius: '3px',
    paddingRight: '50px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
  },
});

class PlanoForm extends Component {
  state = {
    isBlocking: false,
    editing: false,
    loading: true,
    breadcrumb: [
      { label: 'Planos', url: '/planos' },
    ],
    AdicionarProcedimentos: {
      ValorProcedimento: String(),
    },
    sendPlano: {
      NomeFantasia: String(),
      RazaoSocial: String(),
      CNPJ: String(),
      DataEnvioLote: new Date(),
      DataRecebimentoLote: new Date(),
    },
    isValidField: {
      NomeFantasia: false,
      RazaoSocial: false,
      CNPJ: false,
    },
    boxMessage: {
      open: false,
      text: '',
    },
  }

  baseState = this.state

  async componentDidMount() {
    await this.onHandlePageLoad();
    this.onHandleMessage();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    if (prevProps.error !== error) {
      this.onHandleMessage('Conectado.');
    }
  }

  onHandlePageLoad = async () => {
    const {
      match,
      loadPlanoDetail: propLoadPlanoDetail,
    } = this.props;

    const { sendPlano } = this.state;

    if (match.params.id) {
      await propLoadPlanoDetail(match.params.id);
      const { plano } = this.props;
      this.setState({
        editing: true,
        sendPlano: Object.keys(plano).length > 0 ? plano : sendPlano,
      });
    }

    this.setState({ loading: false });
  }

  onHandleAdd = async () => {
    const { sendPlano, editing } = this.state;
    const {
      addPlano: propAddPlano,
      updatePlano: propUpdatePlano, history,
    } = this.props;

    this.setState({ loading: true });

    if (editing) {
      const { plano: { PublicID } } = this.props;
      await propUpdatePlano({
        ...sendPlano,
      }, PublicID);
      await this.onHandleMessage('Plano modificado.');
    } else {
      await propAddPlano({
        ...sendPlano,
      });
      await this.setState({ editing: true });
      await this.onHandleMessage('Plano adicionado.');
    }

    history.push('/planos');
  }

  onHandleMessage = (text) => {
    const { error } = this.props;

    if (error.indexOf('Error') > -1) {
      this.setState({ boxMessage: { open: true, text: error } });
      return;
    }

    if (typeof text !== 'undefined') {
      this.setState({ boxMessage: { open: true, text } });
    }
  }

  onHandleOnClose = () => {
    const { boxMessage } = this.state;
    const { text } = boxMessage;

    this.setState({
      boxMessage: { open: false, text },
    });
  }

  onHandleTarget = ({ name, value }) => {
    const { sendPlano } = this.state;

    this.setState({
      isBlocking: true,
      sendPlano: {
        ...sendPlano,
        [name]: value,
      },
    });
  }

  onHandleTargetValorProcedimento = ({ name, value }) => {
    const { AdicionarProcedimentos } = this.state;

    this.setState({
      AdicionarProcedimentos: {
        ...AdicionarProcedimentos,
        [name]: value.trim(),
      },
    });
  }

  onHandleBlur = ({ value, name }) => {
    const { sendPlano, isValidField } = this.state;

    if (typeof isValidField[name] !== 'undefined') {
      this.setState({
        isValidField: {
          ...isValidField,
          [name]: value.trim().length === 0,
        },
      });
    }

    this.setState({
      sendPlano: {
        ...sendPlano,
        [name]: value.trim(),
      },
    });
  }

  onHandleValidateFields = (event) => {
    event.preventDefault();

    const { isValidField, sendPlano } = this.state;
    const setValidFields = {};

    Object.keys(isValidField).map((item) => {
      if (typeof sendPlano[item] === 'string') {
        setValidFields[item] = sendPlano[item].trim().length === 0;
      }
      return setValidFields;
    });

    this.setState({
      ...isValidField,
      isValidField: setValidFields,
      isBlocking: false,
    });

    const countAll = Object.keys(setValidFields).length;
    const countTrues = Object.values(setValidFields).filter(item => item === false);

    if (countAll === countTrues.length) {
      this.onHandleAdd();
    } else {
      this.onHandleMessage('Preencha todos os campos.');
    }
  }

  render() {
    const {
      classes, error, title, match,
    } = this.props;

    const {
      sendPlano,
      breadcrumb,
      loading,
      isBlocking,
      editing,
      boxMessage,
      isValidField,
    } = this.state;

    return (
      <Master title={`${title} plano`}>
        {!loading ? (
          <Fragment>
            <Message
              text={boxMessage.text}
              open={boxMessage.open}
              onHandleOnClose={this.onHandleOnClose}
            />
            <Prompt
              when={isBlocking}
              message="Você tem modificações que não foram salvas, deseja realmente sair?"
            />
            <Grid container alignItems="center">
              <Typography variant="h6" color="inherit" noWrap>
                {editing ? 'Editar' : 'Cadastrar'}
                {' '}
                plano
              </Typography>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                size="medium"
                disabled={!!error}
                className={classes.addBtn}
                onClick={this.onHandleValidateFields}
              >
                Salvar
              </Button>
            </Grid>

            <Divider className={classes.divider} />

            <Breadcrumb breadcrumb={[...breadcrumb, { label: title, url: match.params.id }]} />

            <form className={classes.form} noValidate autoComplete="off">
              <Grid container spacing={16}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="CNPJ"
                    name="CNPJ"
                    error={isValidField.CNPJ}
                    value={sendPlano.CNPJ}
                    onChange={e => this.onHandleTarget(e.target)}
                    onBlur={e => this.onHandleBlur(e.target)}
                    helperText="Digite o CNPJ"
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    required
                    label="Razão social"
                    name="RazaoSocial"
                    error={isValidField.RazaoSocial}
                    value={sendPlano.RazaoSocial}
                    onChange={e => this.onHandleTarget(e.target)}
                    onBlur={e => this.onHandleBlur(e.target)}
                    helperText="Digite a razão social do plano."
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    required
                    label="Nome fantasia"
                    name="NomeFantasia"
                    error={isValidField.NomeFantasia}
                    value={sendPlano.NomeFantasia}
                    onChange={e => this.onHandleTarget(e.target)}
                    onBlur={e => this.onHandleBlur(e.target)}
                    helperText="Digite o nome do plano."
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                size="medium"
                disabled={!!error}
                className={`${classes.addBtn} footerBtn`}
                onClick={this.onHandleValidateFields}
              >
                Salvar
              </Button>
            </form>
          </Fragment>
        ) : (
          <Loading />
        )}
      </Master>
    );
  }
}

PlanoForm.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  plano: PropTypes.instanceOf(Object),
  addPlano: PropTypes.func.isRequired,
  updatePlano: PropTypes.func.isRequired,
  loadPlanoDetail: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
};

PlanoForm.defaultProps = {
  plano: {},
  title: String(),
};

const mapStateToProps = state => ({
  plano: state.planosReducer.plano,
  error: state.planosReducer.fetchError,
});

export default connect(mapStateToProps, {
  addPlano, loadPlanoDetail, updatePlano,
})(withStyles(styles)(PlanoForm));
