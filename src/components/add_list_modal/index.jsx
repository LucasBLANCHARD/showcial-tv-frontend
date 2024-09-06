import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import { getLists, checkIfIsInLists, addItemToList, removeItemFromList, getItemComment, addComment, deleteComment } from '../../api';
import './index.scss';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NoteSelector from '../common/NoteSelector';
import StyledComponents from '../../assets/inputs/index';
import NewListModal from '../common/NewListModal';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { DialogContent, DialogTitle, ThemeProvider, useMediaQuery } from '@mui/material';

const AddListModal = ({ isOpen, onClose, item, decodedToken, mediaType, onRatingUpdate, onCommentUpdate }) => {
  const token = localStorage.getItem('token');
  const [userLists, setUserLists] = useState([]);
  let [listsWithItem, setListsWithItem] = useState([]);
  const [listsChecked, setListsChecked] = useState(0);
  const [note, setNote] = useState(undefined);
  const [comment, setComment] = useState('');
  const textareaRef = useRef(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpenListModal, setIsOpenListModal] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const fullScreen = useMediaQuery(StyledComponents.devices.breakpoints.down('lg'));

  useEffect(() => {
    const fetchLists = async () => {
      const listsResponse = await getLists(decodedToken.userId);

      const listsWithItemResponse = await checkIfIsInLists(decodedToken.userId, item.tmdbId ? item.tmdbId : item.id);

      if (listsResponse) {
        setUserLists(listsResponse.data[0].filter((list) => list.isDefault !== true));
      }

      if (listsWithItemResponse.data && listsWithItemResponse.data[0] !== null && listsWithItemResponse.data[0] !== undefined) {
        setListsWithItem(listsWithItemResponse.data.flatMap((list) => list.listId));
        setListsChecked(listsWithItemResponse.data.length);
        const commentResponse = await getItemComment(decodedToken.userId, listsWithItemResponse.data[0].tmdbId);
        if (commentResponse.data[0]) {
          setCommentId(commentResponse.data[0].id);
          setNote(commentResponse.data[0].rating);
          setComment(commentResponse.data[0].content);
        }
      } else {
        setListsWithItem([]);
      }
    };

    fetchLists();
  }, [item.id, decodedToken.userId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]); // Ajuste la hauteur chaque fois que 'comment' change

  const handleCheckboxChange = (listId) => async (event) => {
    const id = item.tmdbId || item.id;

    if (event.target.checked) {
      const response = await addItemToList(token, listId, id, mediaType);
      if (response.status === 200) {
        setListsWithItem((prev) => [...prev, listId]);
        setListsChecked((prev) => prev + 1);
        toast.success(`${t('list.added-to')} ${userLists.find((list) => list.id === listId).name}`);
      } else {
        toast.error(`${t('list.error-adding-to')} ${userLists.find((list) => list.id === listId).name}`);
      }
    } else {
      const response = await removeItemFromList(token, listId, id);

      if (response.status === 200) {
        toast.success(`${t('list.removed-from')} ${userLists.find((list) => list.id === listId).name}`);
      } else {
        toast.error(`${t('list.error-removing-from')} ${userLists.find((list) => list.id === listId).name}`);
      }

      if (listsChecked === 1 && commentId) {
        const response = await deleteComment(commentId);
        if (response.status === 200) {
          toast.success(t('list.comment-deleted'));
        } else {
          toast.error(t('list.error-deleting-comment'));
        }
      }
      setListsWithItem((prev) => prev.filter((list) => list !== listId));
      setListsChecked((prev) => prev - 1);
    }
  };

  const onSave = async () => {
    setIsSaving(true);

    const id = item.tmdbId || item.id;

    const isTitlePresent = item.isMovie || Boolean(item.title);
    const commentId = await addComment(decodedToken.userId, id, comment, note, isTitlePresent);

    if (commentId.status === 200) {
      toast.success(t('list.comment-saved'));
    } else {
      toast.error(t('list.error-saving-comment'));
    }

    onRatingUpdate ? onRatingUpdate(note) : null;
    onCommentUpdate ? onCommentUpdate(comment) : null;

    setCommentId(commentId.data);
    setIsModified(false);
    setIsSaving(false);
    onClose();
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setIsModified(true);
  };

  const handleNoteChange = (newNote) => {
    setNote(newNote);
    setIsModified(true);
  };

  const createNewList = () => {
    setIsOpenListModal(true);
  };

  const closeNewListModal = () => {
    setIsOpenListModal(false);
  };

  const handleListCreated = (newList) => {
    setUserLists((prevLists) => [...prevLists, newList.data]);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <ThemeProvider theme={StyledComponents.theme}>
      <Dialog fullWidth maxWidth="md" fullScreen={fullScreen} open={isOpen} onClose={onClose}>
        <div className="dialog-content">
          <div className="flex-sb add-list-dialog-header">
            <DialogTitle>
              {t('commun.add')} {item.title ?? item.name} {t('commun.to-a-list')}
            </DialogTitle>
            <StyledComponents.CssButtonContained type="button" onClick={createNewList}>
              {t('list.new-list')}
            </StyledComponents.CssButtonContained>
          </div>
          <NewListModal isOpenListModal={isOpenListModal} onClose={closeNewListModal} decodedToken={decodedToken} onListCreated={handleListCreated} />
          {userLists.map((list) => (
            <FormGroup key={list.id}>
              <FormControlLabel labelPlacement="end" control={<Checkbox checked={listsWithItem.includes(list.id)} />} onChange={handleCheckboxChange(list.id)} label={list.name} />
            </FormGroup>
          ))}
          {listsChecked > 0 && (
            <FormGroup onSubmit={onSave}>
              <DialogContent>
                <div>
                  <h5>{t('list.rate')} :</h5>
                  <NoteSelector note={note} setNote={handleNoteChange} /> {t('list.on-twenty')}
                </div>
                <div>
                  <h5>{t('list.comment')} :</h5>
                  <textarea className="textarea-search-comment" value={comment} onChange={handleCommentChange} ref={textareaRef}></textarea>
                </div>
                <div className="modal-buttons gap">
                  <StyledComponents.CssButtonContained className="half-width" type="submit" onClick={onSave} disabled={!isModified || isSaving}>
                    {t('commun.submit')}
                  </StyledComponents.CssButtonContained>
                </div>
              </DialogContent>
            </FormGroup>
          )}
        </div>
        <div className="add-list-close">
          <StyledComponents.CssButtonContained className="half-width" type="reset" onClick={onCancel}>
            {t('commun.close')}
          </StyledComponents.CssButtonContained>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};
export default AddListModal;
