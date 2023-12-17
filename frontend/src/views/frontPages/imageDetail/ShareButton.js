/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { BsShare } from 'react-icons/bs';

const ShareButton = () => {
  const [isShareListVisible, setShareListVisible] = useState(false);

  const handleShareClick = () => {
    setShareListVisible(!isShareListVisible);
  };

  const shareListClass = isShareListVisible ? 'share-list active' : 'share-list';

  return (
    <div className="share-button-container">
      <button
        className="btn rounded-pill btn-warning rounded-pill mb-2 mb-sm-0 custom-button"
        onClick={handleShareClick}
      >
        <BsShare className="color-red customBtn custom-icon3" />
        Share
      </button>
      <div className={shareListClass}>
        {/* Add your share options here */}
        <span>Facebook</span>
        <span>Twitter</span>
        <span>WhatsApp</span>
        {/* Add more share options as needed */}
      </div>
    </div>
  );
};

export default ShareButton;
