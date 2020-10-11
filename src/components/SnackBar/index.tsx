import React, { useEffect } from 'react';
import { setSnackBar } from '../../utils';
import './SnackBar.scss';

interface snackProps{
  snackMsg:string;
}

function SnackBar({ snackMsg }:snackProps) {
  useEffect(() => {
    if (snackMsg) setSnackBar();
  }, [snackMsg]);
  
  return <div id='snackbar'>{snackMsg}</div>;
}

export default SnackBar;
