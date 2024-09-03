import React, { useState } from 'react';
import { loginUser } from '../../api';
import { useTranslation } from 'react-i18next';
import StyledComponents from '../../assets/inputs/index';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Checkbox, FormControlLabel, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const LoginForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  //error handling
  const [passwordError, setPasswordError] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPasswordError(false);
    setMailError(false);
    setErrorMessage('');
    try {
      const response = await loginUser(email, password, rememberMe);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/research/movies';
    } catch (error) {
      if (error.response.status === 401) {
        setPasswordError(true);
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 404) {
        setMailError(true);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <form className="form-auth" onSubmit={handleSubmit}>
      <StyledComponents.CssTextField label={t('auth.email')} className="input-auth" size="small" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.email')} error={mailError} helperText={mailError ? errorMessage : ''} required />
      <FormControl variant="outlined">
        <StyledComponents.CssTextField
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                  {showPassword ? <StyledComponents.CssVisibilityOff /> : <StyledComponents.CssVisibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          className="input-auth"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          error={passwordError}
          helperText={passwordError ? errorMessage : ''}
          required
        />
        {/* checkbox remember me */}
        <ThemeProvider theme={StyledComponents.theme}>
          <FormControlLabel control={<Checkbox />} onChange={handleCheckboxChange} label={t('auth.remember')} />
        </ThemeProvider>
      </FormControl>
      <StyledComponents.CssButtonContained variant="contained" type="submit">
        {t('auth.login')}
      </StyledComponents.CssButtonContained>
    </form>
  );
};

export default LoginForm;
