import React, { Component, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import { withStyles } from '@material-ui/core/styles';
import { Breadcrumbs } from '@material-ui/lab';
import {
  Button,
  Typography,
  Grid,
  Divider,
  Chip,
  Avatar,
  TextField,
  MenuItem,
} from '@material-ui/core';

import { Home as HomeIcon } from '@material-ui/icons';

import { addGuia } from '../../../actions/guias';
import { fixDateOnSave, convertDatePicker } from '../../../helpers';

const listStatus = [
  { label: 'Criada', value: 1 },
  { label: 'Concluída', value: 2 },
];

const styles = theme => ({
  chip: {
    backgroundColor: theme.palette.grey[100],
    height: 24,
    cursor: 'pointer',
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus, &.active': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
    },
  },
  activeChip: {
    backgroundColor: theme.palette.grey[300],
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing.unit * 1.5,
  },
  box: {
    padding: '20px',
    border: '1px solid #ccc',
  },
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
});

class GuiaCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendGuia: {
        Status: 1,
        Numero: String(),
        Solicitacao: convertDatePicker(new Date()),
        Vencimento: convertDatePicker(new Date()),
        PlanoOperadora: {
          id: Number(),
          PublicID: String(),
          NomeFantasia: String(),
        },
        Paciente: {
          Nome: String(),
          CPF: String(),
          ListaPlanoOperadoraPaciente: Number(),
        },
      },
    };

    this.onHandleAddGuia = this.onHandleAddGuia.bind(this);
    this.onHandleTargetGuia = this.onHandleTargetGuia.bind(this);
    this.onHandleTargetPaciente = this.onHandleTargetPaciente.bind(this);
  }

  onHandleTargetGuia(value, name) {
    const { sendGuia } = this.state;

    this.setState({
      sendGuia: {
        ...sendGuia,
        [name]: value,
      },
    });
  }

  onHandleTargetPaciente(event) {
    const { sendGuia } = this.state;
    const { target } = event;

    this.setState({
      sendGuia: {
        ...sendGuia,
        Paciente: {
          ...sendGuia.Paciente,
          [target.name]: target.value,
        },
      },
    });
  }

  async onHandleAddGuia() {
    // const { addGuia: propAddGuia, history } = this.props;
    const { sendGuia } = this.state;
    const PublicID = uuidv1();

    console.log(JSON.stringify({
      ...sendGuia,
      PublicID,
      Solicitacao: fixDateOnSave(sendGuia.Solicitacao),
      Vencimento: fixDateOnSave(sendGuia.Vencimento),
    }));

    /* await propAddGuia();
    history.push(`/guias/${PublicID}`); */
  }

  render() {
    const { classes } = this.props;
    const { sendGuia } = this.state;

    return (
      <Fragment>
        <Grid container alignItems="center">
          <Typography variant="h6" color="inherit" noWrap>
            Cadastrar nova guia
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            className={classes.addBtn}
            onClick={this.onHandleAddGuia}
          >
            Salvar
          </Button>
        </Grid>

        <Divider className={classes.divider} />

        <Breadcrumbs arial-label="Breadcrumb">
          <Chip className={classes.chip} to="/guias" component={RouterLink} label="Guias" avatar={(<Avatar className={classes.avatar}><HomeIcon /></Avatar>)} />
          <Chip to="/guias/criar" component={RouterLink} className={`${classes.chip} ${classes.activeChip}`} label="Cadastrar" />
        </Breadcrumbs>

        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={16}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Número da guia"
                name="Numero"
                value={sendGuia.Numero}
                onChange={e => (
                  this.onHandleTargetGuia(e.target.value.toUpperCase().trim(), e.target.name)
                )}
                helperText="Digite o número da guia."
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                value={sendGuia.Status}
                onChange={e => this.onHandleTargetGuia(e.target.value, e.target.name)}
                label="Status"
                name="Status"
                margin="normal"
                variant="outlined"
              >
                {listStatus.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de solicitação"
                name="Solicitacao"
                type="date"
                onChange={e => this.onHandleTargetGuia(e.target.value, e.target.name)}
                defaultValue={sendGuia.Solicitacao}
                helperText="Ex.: 23/02/2019"
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de vencimento"
                name="Vencimento"
                type="date"
                onChange={e => this.onHandleTargetGuia(e.target.value, e.target.name)}
                defaultValue={sendGuia.Vencimento}
                helperText="Ex.: 23/02/2019"
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <br />

          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Paciente"
                name="Nome"
                value={sendGuia.Paciente.Nome}
                onChange={this.onHandleTargetPaciente}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF"
                name="CPF"
                value={sendGuia.Paciente.CPF}
                onChange={this.onHandleTargetPaciente}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Telefone"
                name="Telefone"
                margin="normal"
                variant="outlined"
                helperText="(11) 9000-0000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-mail"
                name="Email"
                margin="normal"
                variant="outlined"
                helperText="email@email.com.br"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                disabled
                label="Plano"
                name="NomeFantasia"
                value={sendGuia.PlanoOperadora.NomeFantasia}
                onChange={e => this.onHandleTargetGuia(e.target.value, e.target.name)}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="outlined"
            color="primary"
            size="medium"
            className={`${classes.addBtn} footerBtn`}
            onClick={this.onHandleAddGuia}
          >
            Salvar
          </Button>
        </form>
      </Fragment>
    );
  }
}

GuiaCreate.propTypes = {
  addGuia: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

const mapStateToProps = state => ({
  guia: state.guiasReducer.guias,
  guiasError: state.guiasReducer.fetchError,
});

export default connect(mapStateToProps, {
  addGuia,
})(withStyles(styles)(GuiaCreate));
