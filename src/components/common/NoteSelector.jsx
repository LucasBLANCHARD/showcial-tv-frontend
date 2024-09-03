import React from 'react';
import { MenuItem } from '@mui/material';
import StyledComponents from '../../assets/inputs/index';
import { t } from 'i18next';

const NoteSelector = ({ note, setNote }) => {
  const handleChange = (event) => {
    const selectedValue = event.target.value === '' ? undefined : event.target.value;
    setNote(selectedValue);
  };

  return (
    <StyledComponents.CssSelect value={note !== undefined ? note : ''} onChange={handleChange} displayEmpty>
      <MenuItem value="" disabled>
        {t('list.rate')}
      </MenuItem>
      {[...Array(21).keys()].map((value) => (
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      ))}
    </StyledComponents.CssSelect>
  );
};

export default NoteSelector;
