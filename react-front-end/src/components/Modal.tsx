import React from 'react';
import './styles/modal.scss';

export default function Modal() {
  return (
    <div className="modal">
      <div className="dialog">
        <button className="exit">&#215;</button>
        <div className="modal-content">text content</div>

        <div className="actions">
          <button>Cancel</button>
          <button className="primary">Confirm</button>
        </div>
      </div>
    </div>
  );
}
