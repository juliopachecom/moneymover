import React from 'react';

function Loading() {
  return (
    <div className="loading">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Cargando...</p>
    </div>
  );
}

export { Loading };
