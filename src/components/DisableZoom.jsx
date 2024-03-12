import React, { useState, useEffect} from 'react';

function DisableZoom() {
    useEffect(() => {
      const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
        }
      }
  
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-'|| e.key==='=')) {
          e.preventDefault()
        }
      }
  
      window.addEventListener('wheel', handleWheel, {passive: false});
      window.addEventListener('keydown', handleKeyDown,  {passive: false});
  
      return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
      }
    }, [])
  
    return null
  }

export default DisableZoom