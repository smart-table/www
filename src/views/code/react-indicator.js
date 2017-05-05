import React from 'react';
import st from '../smart-table-preact';

export const Overlay = st.loadingIndicator(({stState}) => {
  const {working} = stState;
  return <div id="overlay" className={working ? 'st-working' : ''}>Processing ...</div>;
});

/*
 To be used

 <Overlay smartTable={t} />

 */