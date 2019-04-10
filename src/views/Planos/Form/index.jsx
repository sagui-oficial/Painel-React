import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Button,
  Typography,
  Grid,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemSecondaryAction,
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
} from '@material-ui/icons';

import Select from 'react-select';

import Master from '../../../components/Master';
import {
  addPlano, loadPlanoDetail,
  updatePlano,
} from '../../../actions/planos';
import { formatCurrency } from '../../../helpers';
import { loadProcedimentos } from '../../../actions/procedimentos';
import { Control, Option } from '../../../components/AutoComplete';
import Breadcrumb from '../../../components/Breadcrumb';
import Message from '../../../components/Message';

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
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
  },
});

class PlanoForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedName: null,
      editing: false,
      breadcrumb: [
        { label: 'Planos', url: '/planos' },
      ],
      AdicionarProcedimentos: {
        ValorProcedimento: String(),
      },
      sendPlano: {
        Status: 1,
        NomeFantasia: String(),
        RazaoSocial: String(),
        CNPJ: String(),
        ListaProcedimentos: [],
      },
      isValidField: {
        RazaoSocial: false,
        CNPJ: false,
      },
      boxMessage: {
        open: false,
        text: '',
      },
    };

    this.onHandleAdd = this.onHandleAdd.bind(this);
    this.onHandleAddProcedimento = this.onHandleAddProcedimento.bind(this);
    this.onHandleDeleteProcedimento = this.onHandleDeleteProcedimento.bind(this);
    this.onHandleTarget = this.onHandleTarget.bind(this);
    this.onHandleTargetValorProcedimento = this.onHandleTargetValorProcedimento.bind(this);
    this.onHandleSelectProcedimentos = this.onHandleSelectProcedimentos.bind(this);
    this.onHandleBlur = this.onHandleBlur.bind(this);
    this.onHandleValidateFields = this.onHandleValidateFields.bind(this);
    this.onHandlePageLoad = this.onHandlePageLoad.bind(this);
    this.onHandleMessage = this.onHandleMessage.bind(this);
    this.onHandleOnClose = this.onHandleOnClose.bind(this);
  }

  componentDidMount() {
    const { loadProcedimentos: propsLoadProcedimentos } = this.props;
    this.onHandlePageLoad();
    this.onHandleMessage();

    propsLoadProcedimentos();
  }

  componentDidUpdate(prevProps) {
    const { plano, error } = this.props;

    if (prevProps.plano !== plano) {
      this.onHandleSendPlano(plano);
    }

    if (prevProps.error !== error) {
      this.onHandleMessage('Conectado.');
    }
  }

  onHandleMessage(text) {
    const { error } = this.props;

    if (error.indexOf('Error') > -1) {
      this.setState({ boxMessage: { open: true, text: error } });
      return;
    }

    if (typeof text !== 'undefined') {
      this.setState({ boxMessage: { open: true, text } });
    }
  }

  onHandleOnClose() {
    const { boxMessage } = this.state;
    const { text } = boxMessage;

    this.setState({
      boxMessage: { open: false, text },
    });
  }

  onHandleSendPlano(plano) {
    this.setState({
      sendPlano: plano,
    });
  }

  onHandlePageLoad() {
    const {
      match,
      loadPlanoDetail: propLoadPlanoDetail,
    } = this.props;

    if (match.params.id) {
      propLoadPlanoDetail(match.params.id);

      this.setState({
        editing: true,
      });
    }
  }

  onHandleTarget(target) {
    const { sendPlano } = this.state;
    const { name, value } = target;

    this.setState({
      sendPlano: {
        ...sendPlano,
        [name]: value,
      },
    });
  }

  onHandleTargetValorProcedimento(target) {
    const { AdicionarProcedimentos } = this.state;
    const { name, value } = target;

    this.setState({
      AdicionarProcedimentos: {
        ...AdicionarProcedimentos,
        [name]: value,
      },
    });
  }

  onHandleSelectProcedimentos(target) {
    const { AdicionarProcedimentos } = this.state;
    const { name, value } = target;

    this.setState({
      selectedName: target,
      AdicionarProcedimentos: {
        ...AdicionarProcedimentos,
        [name]: value,
        PublicID: target.id,
        Codigo: target.Codigo,
      },
    });
  }

  onHandleBlur({ value, name }) {
    const { isValidField } = this.state;

    this.setState({
      isValidField: {
        ...isValidField,
        [name]: value.trim().length === 0,
      },
    });
  }

  onHandleValidateFields(event) {
    event.preventDefault();

    const { isValidField, sendPlano } = this.state;
    const setValidFields = {};

    Object.keys(isValidField).map((item) => {
      setValidFields[item] = sendPlano[item].trim().length === 0;
      return setValidFields;
    });

    this.setState({
      ...isValidField,
      isValidField: setValidFields,
    });

    const countAll = Object.keys(setValidFields).length;
    const countTrues = Object.values(setValidFields).filter(item => item === false);

    if (countAll === countTrues.length) {
      this.onHandleAdd();
    } else {
      this.onHandleMessage('Preencha todos os campos.');
    }
  }

  onHandleAddProcedimento(event) {
    event.preventDefault();
    const { sendPlano, AdicionarProcedimentos } = this.state;

    this.setState({
      selectedName: String(),
      AdicionarProcedimentos: {
        ValorProcedimento: String(),
      },
      sendPlano: {
        ...sendPlano,
        ListaProcedimentos: [
          AdicionarProcedimentos,
          ...sendPlano.ListaProcedimentos,
        ],
      },
    });
  }

  onHandleDeleteProcedimento(idProcedimento) {
    const { sendPlano } = this.state;

    this.setState({
      sendPlano: {
        ...sendPlano,
        ListaProcedimentos: sendPlano.ListaProcedimentos.filter((item, index) => (
          `${item.PublicID}-${index}` !== idProcedimento
        )),
      },
    });
  }

  async onHandleAdd() {
    const {
      addPlano: propAddPlano,
      updatePlano: propUpdatePlano, history,
    } = this.props;
    const { sendPlano, editing } = this.state;
    const PublicID = uuidv1();

    if (editing) {
      await propUpdatePlano({
        ...sendPlano,
      }, sendPlano.id);
      this.onHandleMessage('Plano modificado.');
    } else {
      await propAddPlano({
        ...sendPlano,
        id: PublicID,
        PublicID,
      });

      this.setState({ editing: true });
      this.onHandleMessage('Plano adicionado.');
      history.push(`/planos/${PublicID}`);
    }
  }

  render() {
    const {
      classes, error, procedimentos, title, match,
    } = this.props;
    const {
      sendPlano, breadcrumb, selectedName,
      editing, boxMessage, isValidField,
      AdicionarProcedimentos,
    } = this.state;

    const { ListaProcedimentos } = sendPlano;

    return (
      <Master title={`${title} plano`}>
        <Message
          text={boxMessage.text}
          open={boxMessage.open}
          onHandleOnClose={this.onHandleOnClose}
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
                label="Nome fantasia"
                name="NomeFantasia"
                value={sendPlano.NomeFantasia}
                onChange={e => this.onHandleTarget(e.target)}
                helperText="Digite o nome do plano."
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <br />

          <Grid container alignItems="center">
            <Typography variant="h6" color="inherit" noWrap>
              Adicionar procedimentos
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              disabled={!!error}
              className={classes.addBtn}
              onClick={this.onHandleAddProcedimento}
            >
              +Adicionar
            </Button>
          </Grid>

          <Grid container spacing={16}>
            <Grid
              item
              xs={12}
              sm={9}
              style={{
                position: 'relative',
                zIndex: '2',
              }}
            >
              <Select
                label="Cadastrar procedimentos"
                options={procedimentos.map(suggestion => ({
                  name: 'NomeProcedimento',
                  id: suggestion.PublicID,
                  Codigo: suggestion.Codigo,
                  value: suggestion.NomeProcedimento,
                  label: suggestion.NomeProcedimento,
                }))}
                components={{ Control, Option }}
                value={selectedName}
                onChange={this.onHandleSelectProcedimentos}
                placeholder="Selecione..."
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Valor"
                name="ValorProcedimento"
                value={AdicionarProcedimentos.ValorProcedimento}
                onChange={e => this.onHandleTargetValorProcedimento(e.target)}
                helperText="Apenas números"
                placeholder="1.000,00"
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <List dense>
            {
              sendPlano && (
                ListaProcedimentos && (
                  ListaProcedimentos.map((item, index) => {
                    const itemId = `${item.PublicID}-${index}`;

                    return (
                      <ListItem
                        key={itemId}
                        className={classes.listProcess}
                      >
                        <div className={classes.boxList}>
                          <p className={classes.smallItemText}>
                            {item.NomeProcedimento}
                            {' - '}
                            {formatCurrency(item.ValorProcedimento)}
                          </p>
                        </div>
                        <ListItemSecondaryAction className={classes.iconDelete}>
                          <IconButton
                            disabled={!!error}
                            onClick={() => this.onHandleDeleteProcedimento(itemId)}
                            aria-label="Deletar"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })
                )
              )
            }
          </List>

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
      </Master>
    );
  }
}

PlanoForm.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  plano: PropTypes.instanceOf(Object),
  procedimentos: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  addPlano: PropTypes.func.isRequired,
  updatePlano: PropTypes.func.isRequired,
  loadPlanoDetail: PropTypes.func.isRequired,
  loadProcedimentos: PropTypes.func.isRequired,
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
  procedimentos: state.procedimentosReducer.procedimentos,
});

export default connect(mapStateToProps, {
  addPlano, loadPlanoDetail, updatePlano, loadProcedimentos,
})(withStyles(styles)(PlanoForm));
