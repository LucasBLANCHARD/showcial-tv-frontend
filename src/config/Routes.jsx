import React from 'react';

import {
  Routes, // instead of "Switch"
  Route
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginForm from '../screens/auth/Login';
import SignupForm from '../screens/auth/Signup';
import Profile from '../screens/profile';
import Research from '../screens/research';
import Movie from '../screens/research/Movie';
import Serie from '../screens/research/Serie';
import Auth from '../screens/auth';
import Activities from '../screens/activities';
import ListDetails from '../screens/list';
import ItemDetails from '../screens/details';
import NotFound from '../screens/error';
import Follows from '../screens/follows';
import About from '../components/footer/about';
import Contact from '../components/footer/contact';
import Privacy from '../components/footer/privacy';
import Settings from '../screens/settings';

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Route pour la page d'accueil */}
      <Route path="/" element={<Activities />} />

      {/* Routes pour l'authentification */}
      <Route path="/auth" element={<Auth />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
      </Route>

      {/* Routes pour le profil */}
      <Route path="/profile" element={<PrivateRoute />}>
        {/* Routes pour le profil de l'utilisateur connecté */}
        <Route path="" element={<Profile />}>
          {/* Affiche les followers */}
          <Route path="followers" element={<Follows />} />
          {/* Affiche les followings */}
          <Route path="followings" element={<Follows />} />

          {/* Affiche les détails de la liste */}
          <Route path="list/:slug/:listId" element={<ListDetails />} />
        </Route>

        {/* Routes pour le profil d'un autre utilisateur */}
        <Route path=":slug/:userId" element={<Profile />}>
          {/* Affiche les followers */}
          <Route path="followers" element={<Follows />} />
          {/* Affiche les followings */}
          <Route path="followings" element={<Follows />} />

          {/* Affiche les détails de la liste */}
          <Route path="list/:slug/:listId" element={<ListDetails />} />
        </Route>
      </Route>

      {/* Routes pour la recherche */}
      <Route path="/research" element={<PrivateRoute />}>
        <Route path="" element={<Research />}>
          <Route path="movies" lazy={() => Movie} />
          <Route path="series" lazy={() => Serie} />
        </Route>
      </Route>

      {/* Routes pour le détail d'un film/ une série */}
      <Route path="/details/:mediaType/:slug" element={<PrivateRoute />}>
        <Route path=":tmdbId" element={<ItemDetails />} />
      </Route>

      {/* Route pour les activités */}
      <Route path="/activities" element={<PrivateRoute />}>
        <Route path="" element={<Activities />} />
      </Route>

      {/* Route pour les paramètres */}
      <Route path="/settings" element={<PrivateRoute />}>
        <Route path="" element={<Settings />} />
      </Route>

      {/* Routes pour le footer */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Route pour les erreurs */}
      <Route path="*" element={<NotFound error={404} />} />
    </Routes>
  );
};

export default RoutesConfig;
