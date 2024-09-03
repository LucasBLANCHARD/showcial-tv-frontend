import React, { useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, FormControl, InputAdornment, IconButton, Button, Dialog, ThemeProvider, useMediaQuery, DialogTitle, DialogContent } from '@mui/material';
import StyledComponents from '../../assets/inputs';
import { changePassword, deleteAccount } from '../../api';
import { toast } from 'react-toastify';

const Settings = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const theme = localStorage.getItem('theme') || 'dark';
  const fullScreen = useMediaQuery(StyledComponents.devices.breakpoints.down('lg'));

  // States pour les différents paramètres
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // État pour les messages d'erreur
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // Handlers
  const handlePasswordChange = async () => {
    setCurrentPasswordError(false);
    setConfirmPasswordError(false);
    try {
      // Logique pour changer le mot de passe
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError(true);
        setErrorMessage(t('settings.not-same-passwords'));
        return;
      }
      const response = await changePassword(token, password, newPassword);
      if (response.status === 200) {
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success(t('settings.password-changed'));
      }
    } catch (error) {
      if (error.response.status === 401) {
        setCurrentPasswordError(true);
        setErrorMessage(error.response.data.message);
      } else if (error.response.status === 400) {
        setConfirmPasswordError(true);
        setErrorMessage(error.response.data.message);
      }
    }
  };

  // Fonction pour changer le thème
  const toggleTheme = () => {
    const currentTheme = theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setSelectedTheme(newTheme);

    localStorage.setItem('theme', newTheme); // Stocke le nouveau thème
    document.documentElement.setAttribute('data-theme', newTheme); // Applique le nouveau thème
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(token);
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  const openDeleteAccountModal = () => setIsDeleteAccountModalOpen(true);

  const closeDeleteAccountModal = () => setIsDeleteAccountModalOpen(false);

  const onCancel = () => closeDeleteAccountModal();
  return (
    <div className="settings-container">
      <Typography variant="h4" className="settings-title">
        {t('navBar.settings')}
      </Typography>
      <Grid container spacing={1} className="settings-grid">
        {/* Section Changement de mot de passe */}
        <Grid item xs={12} md={6} className="settings-grids">
          <Typography variant="h6" className="primary-color-darker">
            {t('settings.password-change')}
          </Typography>
          <StyledComponents.CssTextField
            label={t('settings.current-password')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
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
            placeholder={t('settings.current-password')}
            error={currentPasswordError}
            helperText={currentPasswordError ? errorMessage : ''}
            required
          />
          <StyledComponents.CssTextField
            label={t('settings.new-password')}
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowNewPassword} onMouseDown={handleMouseDownNewPassword} edge="end">
                    {showNewPassword ? <StyledComponents.CssVisibilityOff /> : <StyledComponents.CssVisibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            className="input-auth"
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('settings.new-password')}
            error={confirmPasswordError}
            required
          />
          <StyledComponents.CssTextField
            label={t('settings.confirm-password')}
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                    {showConfirmPassword ? <StyledComponents.CssVisibilityOff /> : <StyledComponents.CssVisibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            className="input-auth"
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('settings.confirm-password')}
            error={confirmPasswordError}
            helperText={confirmPasswordError ? errorMessage : ''}
            required
          />

          <div className="flex-column half-width">
            <StyledComponents.CssButtonContained variant="contained" color="primary" onClick={handlePasswordChange} sx={{ marginTop: 2 }} disabled={password && newPassword && confirmPassword ? false : true}>
              {t('settings.save')}
            </StyledComponents.CssButtonContained>

            <Button variant="contained" color="error" onClick={openDeleteAccountModal} sx={{ marginTop: 2 }}>
              {t('settings.delete-account')}
            </Button>
          </div>
          <ThemeProvider theme={StyledComponents.theme}>
            <Dialog fullWidth maxWidth="md" fullScreen={fullScreen} open={isDeleteAccountModalOpen} onClose={closeDeleteAccountModal}>
              <div className="dialog-content">
                <div className="flex-column">
                  <DialogTitle> {t('settings.delete-account')} </DialogTitle>
                  <DialogContent>{t('settings.confirm-delete-text')}</DialogContent>

                  <div className="modal-buttons gap">
                    <StyledComponents.CssButtonContained className="half-width" type="reset" onClick={onCancel}>
                      {t('commun.close')}
                    </StyledComponents.CssButtonContained>
                    <Button variant="contained" color="error" className="half-width" type="submit" onClick={handleDeleteAccount} sx={{ marginTop: 2 }}>
                      {t('settings.confirm-delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog>
          </ThemeProvider>
        </Grid>

        {/* Section Choix du Thème */}
        <Grid item xs={12} md={6}>
          <Typography className="primary-color-darker" variant="h6">
            {t('settings.theme-choice')}
          </Typography>
          <FormControl fullWidth margin="normal">
            <StyledComponents.MaterialUISwitch checked={selectedTheme === 'dark' ? true : false} onChange={toggleTheme}></StyledComponents.MaterialUISwitch>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
