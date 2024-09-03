import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import React, { useState } from 'react';
import { signupUser } from '../../api';
import StyledComponents from '../../assets/inputs/index';
import './Signup.scss';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentLangage = i18n.language;
      const response = await signupUser(email, username, password, currentLangage);

      // redirect to login page
      if (response.status === 201) {
        toast.success(`${t('auth.signup-success')} `);
        navigate('/auth/login');
      } else {
        toast.error(`${t('auth.signup-failed')} `);
      }
    } catch (error) {
      console.error('Signup error', error);
    }
  };

  return (
    <form className="form-auth" onSubmit={handleSubmit}>
      <StyledComponents.CssTextField label={t('auth.email')} className="input-auth" size="small" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.email')} required />
      <StyledComponents.CssTextField label={t('auth.username')} className="input-auth" size="small" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('auth.username')} required />
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
          required
        />
      </FormControl>
      <StyledComponents.CssButtonContained type="submit">{t('auth.signup')}</StyledComponents.CssButtonContained>
    </form>
  );
};

export default SignupForm;
