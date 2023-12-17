/* eslint-disable prettier/prettier */
// CategoryContext.js
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const VideosCategoryContext = createContext();

export const VideosCategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const setCategory = (category) => {
    console.log('Setting category:', category);
    setSelectedCategory(category);
  };

  console.log('VideosCategoryContext created successfully.');

  return (
    <VideosCategoryContext.Provider value={{ selectedCategory, setCategory }}>
      {children}
    </VideosCategoryContext.Provider>
  );
};

VideosCategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VideosCategoryContext;
