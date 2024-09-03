import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, ThemeProvider, useMediaQuery } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { addItemToList, getLists, removeItemFromList } from '../../api';
import AddListModal from '../add_list_modal';
import './HoverCard.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { generateSlug } from '../../utils/slug';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import StyledComponents from '../../assets/inputs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HoverCard = ({ item, index, isInWatchlist, setIsInWatchlistArray, mediaType, isForListDetails, updateNote }) => {
  const { userId } = useParams('userId');
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [itemModal, setItemModal] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const fullScreen = useMediaQuery(StyledComponents.devices.breakpoints.down('lg'));
  const commentLimit = 100;
  const navigate = useNavigate();

  const toggleModal = (item) => {
    setIsModalOpen(!isModalOpen);
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
    }
    setItemModal(item);
  };

  const toggleCommentModal = (comment) => {
    setSelectedComment(comment);
    setIsCommentModalOpen(!isModalOpen);
  };

  const handleCommentClose = () => {
    setIsCommentModalOpen(false);
  };

  const handleRemoveFromList = async (item, index) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const listsResponse = await getLists(decodedToken.userId);
      if (listsResponse) {
        const watchlistId = listsResponse.data[0].find((list) => list.isDefault === true).id;
        const response = await removeItemFromList(token, watchlistId, item.id);
        if (response.status === 200) {
          setIsInWatchlistArray((prevResults) => prevResults.map((result, i) => (i === index ? false : result)));
          toast.success(t('list.remove-from-watchlist'));
        } else {
          toast.error(t('list.error-removing-from-watchlist'));
        }
      }
    }
  };

  const handleAddList = async (item, index) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const listsResponse = await getLists(decodedToken.userId);

      if (listsResponse) {
        const watchlistId = listsResponse.data[0].find((list) => list.isDefault === true).id;
        const response = await addItemToList(token, watchlistId, item.id, mediaType);
        if (response.status === 200) {
          setIsInWatchlistArray((prevResults) => prevResults.map((result, i) => (i === index ? true : result)));
          toast.success(t('list.added-to-watchlist'));
        } else {
          toast.error(t('list.error-adding-to-watchlist'));
        }
      }
    }
  };

  const handleItemDetails = async (item) => {
    if (item.tmdbId) {
      const slug = generateSlug(item.name);
      const mediaType = item.isMovie ? 'movie' : 'tv';
      navigate(`/details/${mediaType}/${slug}/${item.tmdbId}`);
    } else {
      const slug = generateSlug(item.title ?? item.name);
      const mediaType = item.title ? 'movie' : 'tv';
      navigate(`/details/${mediaType}/${slug}/${item.id}`);
    }
  };

  const handleRatingUpdate = (newRating) => {
    updateNote(newRating, index);
  };

  const handleCommentUpdate = (newComment) => {
    // Mettre à jour le commentaire dans le state
    if (item.comment && item.comment.content) {
      item.comment.content = newComment;
    }
  };

  // Fonction pour convertir les retours à la ligne et les tabulations en HTML
  const formatComment = (comment) => {
    if (!comment) return '';

    // Remplacer les tabulations par des espaces non sécables (4 espaces pour chaque tabulation)
    let formatted = comment.replace(/\t/g, '    ');

    // Remplacer les retours à la ligne par des balises <br>
    formatted = formatted.replace(/\n/g, '<br />');

    return formatted;
  };

  return (
    <div>
      {isModalOpen && <AddListModal isOpen={isModalOpen} onClose={toggleModal} item={itemModal} decodedToken={decodedToken} mediaType={mediaType} onRatingUpdate={handleRatingUpdate} onCommentUpdate={handleCommentUpdate} />}
      {!isForListDetails ? (
        <div className="hover-content">
          <div className="card-title">{item.title ?? item.name}</div>
          <Button variant="outlined" className="primary-outlined-button" onClick={() => toggleModal(item)}>
            {t('card.add-to-list')}
          </Button>

          {/* Condition ternaire pour afficher le bon bouton en fonction de disabledValue */}
          {isInWatchlist ? (
            <Button variant="outlined" className="primary-outlined-button" onClick={() => handleRemoveFromList(item, index)}>
              {t('card.remove-from-watchlist')}
            </Button>
          ) : (
            <Button variant="outlined" className="primary-outlined-button" onClick={() => handleAddList(item, index)}>
              {t('card.add-to-watchlist')}
            </Button>
          )}
          <Button variant="contained" className="primary-contained-button" onClick={() => handleItemDetails(item, index)}>
            {t('card.details')}
          </Button>
        </div>
      ) : (
        <div className="hover-content">
          {item.comment && item.comment.content ? item.comment.content : 'Aucun commentaire'}
          {!userId ? (
            <Button variant="outlined" className="primary-outlined-button" onClick={() => toggleModal(item)}>
              {t('commun.modify')}
            </Button>
          ) : item.comment && item.comment.content ? (
            <Button variant="outlined" onClick={() => toggleCommentModal(item.comment.content)} className="primary-outlined-button">
              {t('list.see-comment')}
            </Button>
          ) : null}
          <ThemeProvider theme={StyledComponents.theme}>
            <Dialog fullWidth maxWidth="md" fullScreen={fullScreen} open={isCommentModalOpen} TransitionComponent={Transition} keepMounted onClose={handleCommentClose}>
              <div className="flex-sb">
                <DialogTitle>{t('list.comment')} : </DialogTitle>
                <div className="dialog-comment">{item.comment && item.comment.rating ? item.comment.rating + ' ' + t('list.on-twenty') : t('list.no-rating')}</div>
              </div>
              <DialogContent>
                <DialogContentText dangerouslySetInnerHTML={{ __html: formatComment(selectedComment) }}></DialogContentText>
              </DialogContent>
              <DialogActions>
                <StyledComponents.CssButtonContained variant="contained" onClick={handleCommentClose}>
                  {t('commun.close')}
                </StyledComponents.CssButtonContained>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
          <Button variant="contained" className="primary-contained-button" onClick={() => handleItemDetails(item, index)}>
            {t('card.details')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
