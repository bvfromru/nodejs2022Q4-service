import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const DEFAULT_PORT = 4000;
export const DEFAULT_LOGGER_LEVEL = 2;
export const DEFAULT_MAX_FILE_SIZE_KB = 10;
export const LOG_DIR = 'LOGS';
export const LOG_ERR_DIR = 'LOGS_ERR';

export const ERROR_MESSAGES = {
  invalidID: 'Invalid ID',
  wrongPassword: 'Wrong password',
  userNotFound: 'User not found',
  artistNotFound: 'Artist not found',
  trackNotFound: 'Track not found',
  albumNotFound: 'Album not found',
  trackIsNotFavorite: "Track wasn't add to Favorites",
  albumIsNotFavorite: "Album wasn't add to Favorites",
  artistIsNotFavorite: "Artist wasn't add to Favorites",
  idDoesntExist: "This ID doesn't exist",
  idNotFound: 'ID not found',
  userAlreadyExists: 'User already exists',
  authDataIncorrect: 'Login or password is incorrect',
  accessDenied: 'Access denied',
  serverError: 'Internal server error',
};

export const SUCCESS_MESSAGES = {
  addTrack: 'Track added',
  removeTrack: 'Track removed',
  addAlbum: 'Album added',
  removeAlbum: 'Album removed',
  addArtist: 'Artist added',
  removeArtist: 'Artist removed',
};
