/* eslint-disable quotes */
import { createTheme, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Switch } from '@mui/material';

const CssSelect = styled(Select)({
  // Couleur de la bordure
  '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
    border: '2px solid var(--primary-color)'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary-color-darker)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary-color-darker)'
  },
  // Couleur du texte
  '.MuiSelect-select': {
    color: 'var(--primary-color)'
  },
  // Couleur de la flèche
  '.MuiSvgIcon-root': {
    color: 'var(--primary-color)'
  }
});

const CssTextField = styled(TextField)({
  '.MuiInputBase-root': {
    width: '250px' // Largeur personnalisée
  },
  //couleur du label
  '& label': {
    color: '#f8963a'
  },
  //couleur du label après clique
  '& label.Mui-focused': {
    color: 'var(--primary-color)'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--primary-color)'
  },
  //Couleur du contour
  '& .MuiOutlinedInput-root': {
    color: 'var(--primary-color)',
    '& fieldset': {
      borderColor: 'var(--primary-color)'
    },
    //Quand on survole, couleur du contour
    '&:hover fieldset': {
      borderColor: '#f8963a'
    },
    //Quand on clique, couleur du contour
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-color)'
    },
    '&.MuiInputLabel-root': {
      color: 'var(--primary-color)'
    }
  }
});

const CssMoreVertIcon = styled(MoreVertIcon)({
  color: 'var(--primary-color)',
  cursor: 'pointer',
  '&.MuiSvgIcon-root': {
    width: '1.5em',
    height: '1.5em'
  },
  '&:hover': {
    //add circle around icon on hover
    borderRadius: '50%',
    background: 'var(--primary-color)',
    color: 'var(--secondary-color)'
  }
});

const CssDropdown = styled('div')({});

const CssVisibility = styled(Visibility)({
  color: 'var(--primary-color)'
});

const CssVisibilityOff = styled(VisibilityOff)({
  color: 'var(--primary-color)'
});

const CssButtonContained = styled(Button)({
  background: 'var(--primary-color)',
  marginTop: '16px',
  //change color on hover
  '&:hover': {
    background: 'var(--primary-color-darker)'
  },
  '&:disabled': {
    background: 'var(--disabled-color)',
    color: 'var(--primary-color-lighter)'
  },
  color: 'var(--secondary-color)'
});

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'var(--primary-color)', // Couleur par défaut
          '&.Mui-checked': {
            color: 'var(--primary-color)' // Couleur lorsqu'il est coché
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: 'var(--primary-color)' // Couleur du texte du label
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'var(--body-bg-lighter)'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: 'var(--primary-color-darker)'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: 'var(--primary-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: 'var(--primary-color)'
        }
      }
    }
  }
});

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      // eslint-disable-next-line @typescript-eslint/quotes
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    }
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2
  }
}));

const devices = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 360, // Correspond à $little-mobile-width
      md: 600, // Correspond à $mobile-width
      lg: 1024, // Correspond à $tablet-width
      xl: 1920
    }
  }
});

const StyledComponents = { CssTextField, CssSelect, CssVisibility, CssVisibilityOff, CssButtonContained, CssMoreVertIcon, CssDropdown, theme, devices, MaterialUISwitch };

export default StyledComponents;
