import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import StyledComponents from '../../assets/inputs/index';
import { createList } from '../../api';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { ThemeProvider } from '@mui/material';

const NewListModal = ({ isOpenListModal, onClose, decodedToken, onListCreated, isEditMode, existingListData = {} }) => {
  const [listName, setListName] = React.useState('');
  const [listDescription, setListDescription] = React.useState('');

  useEffect(() => {
    if (isEditMode && existingListData) {
      setListName(existingListData.name || '');
      setListDescription(existingListData.description || '');
    }
  }, [isEditMode, existingListData]);

  const handleCreateList = async (event) => {
    event.preventDefault();
    const newList = await createList(decodedToken.userId, listName, listDescription, isEditMode ? existingListData.id : null);
    if (newList.status === 200) {
      toast.success(isEditMode ? t('list.list-modified') : t('list.list-created'));
      onListCreated(newList);
    } else {
      toast.error(isEditMode ? t('list.error-modifying-list') : t('list.error-creating-list'));
    }
    onClose();
  };

  const handleNameChange = (event) => {
    setListName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setListDescription(event.target.value);
  };

  return (
    <ThemeProvider theme={StyledComponents.theme}>
      <Dialog open={isOpenListModal} onClose={onClose}>
        <div className="dialog-content gap">
          {!isEditMode ? <h5 className="primary-color">{t('list.create-new-list')} :</h5> : <h5>{t('list.modify-list')} :</h5>}
          <form className="flex-column gap" onSubmit={handleCreateList}>
            <StyledComponents.CssTextField type="text" placeholder={t('list.name-of-list')} value={listName} onChange={handleNameChange} required />
            <textarea placeholder={t('list.description')} className="textarea-search-comment" value={listDescription} onChange={handleDescriptionChange}></textarea>
            <StyledComponents.CssButtonContained type="submit">{!isEditMode ? t('commun.create') : t('commun.modify')}</StyledComponents.CssButtonContained>
          </form>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

export default NewListModal;
