import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemsById, getListAndItemsById } from '../../api';
import Spinner from '../../components/common/Loader';
import LazyImage from '../../components/common/LazyImage';
import HoverCard from '../../components/common/HoverCard';
import StyledComponents from '../../assets/inputs';
import { t } from 'i18next';

const ListDetails = () => {
  const token = localStorage.getItem('token');
  const { userId } = useParams('userId');
  const { listId } = useParams();
  const [listName, setListName] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeCardIndex, setActiveCardIndex] = useState(null); // Index de la carte active

  const fetchListDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getListAndItemsById(listId, 24, (page - 1) * 24);
      const newItems = response.data.items || [];

      // Vérifier s'il y a plus d'items à charger
      if (newItems.length < 24) {
        setHasMore(false); // Il n'y a plus de données à charger
      }
      //set ListName
      setListName(response.data.name);

      const itemIds = newItems.map((item) => item.id);

      const itemsDetails = await getItemsById(token, itemIds, userId);

      // Ajouter les nouveaux items aux items existants
      setItems((prevItems) => [...prevItems, ...itemsDetails]);
    } catch (error) {
      console.error('Failed to fetch list details', error);
    } finally {
      // Arrêter le chargement
      setLoading(false);
    }
  }, [listId, page, token]);

  useEffect(() => {
    fetchListDetails(page);
  }, [page, fetchListDetails]);

  const updateNote = (newRating, index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];

      // Vérifiez si l'élément existe et si comment et comment.rating existent
      if (updatedItems[index] && updatedItems[index].comment) {
        updatedItems[index].comment.rating = newRating;
      } else if (updatedItems[index]) {
        // Si comment n'existe pas, initialisez-le
        updatedItems[index].comment = { rating: newRating };
      }

      return updatedItems;
    });
  };

  const returnToProfil = () => {
    // remove the 3 last element from the history stack
    navigate(`..`);
  };

  const redirectToResearch = () => {
    //redirect to research page
    navigate('/research/movies');
  };

  const loadMoreItems = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleCardClick = (index) => {
    if (activeCardIndex === index) {
      // Si on clique sur la même carte, on la ferme
      setActiveCardIndex(null);
    } else {
      // Sinon, on active la carte cliquée
      setActiveCardIndex(index);
    }
  };

  return (
    <>
      <div className="list-header">
        <div className="list-back">
          <StyledComponents.CssButtonContained onClick={returnToProfil}>{t('commun.back-to-profile')}</StyledComponents.CssButtonContained>
        </div>
        <div className="list-name-container">{listName ? <div className="list-name">{listName}</div> : <Spinner />}</div>
      </div>
      <InfiniteScroll dataLength={items.length} next={loadMoreItems} hasMore={hasMore} initialScrollY={true} style={{ overflow: 'visible' }}>
        {items.length > 0 ? (
          <div className="list-details">
            <div className="list-items">
              {items.map((item, index) => (
                <div key={item.id} className="card" onClick={() => handleCardClick(index)}>
                  {/* Rating affiché en haut à droite pour chaque item */}
                  <div className="rating-display">{item.comment && item.comment.rating ? `${item.comment.rating} ${t('list.on-twenty')}` : `? ${t('list.on-twenty')}`}</div>
                  <div className="image-container">{item.poster_path ? <LazyImage src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title ?? item.name} /> : null}</div>
                  <div className="card-bottom">
                    <div className="card-title">{item.title ?? item.name}</div>
                  </div>
                  <HoverCard item={item} index={index} mediaType={item.isMovie} isForListDetails={true} updateNote={updateNote} isClicked={activeCardIndex === index} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-items">
            <div>{t('list.no-element')}</div>
            <StyledComponents.CssButtonContained onClick={redirectToResearch} className="list-back">
              {t('navBar.research')}
            </StyledComponents.CssButtonContained>
          </div>
        )}
      </InfiniteScroll>
    </>
  );
};

export default ListDetails;
