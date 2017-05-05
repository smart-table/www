import React from 'react';
import st from './smart-table.js';

export const Pagination = st.pagination(({stDirective, stState}) => {
  const isPreviousDisabled = !stDirective.isPreviousPageEnabled();
  const isNextDisabled = !stDirective.isNextPageEnabled();
  return <td>
    <div>
      <button disabled={isPreviousDisabled} onClick={stDirective.selectPreviousPage}>
        Previous
      </button>
      <span>Page {stState.page}</span>
      <button disabled={isNextDisabled} onClick={stDirective.selectNextPage}>
        Next
      </button>
    </div>
  </td>
});

/*
 To be used

 <Pagination smartTable={t} />

 */