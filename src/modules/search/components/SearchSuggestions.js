import React from 'react';
import {translate} from 'react-i18next';
import UnitSuggestion from './UnitSuggestions';

const SearchSuggestions = translate()(({units, openAllResults, t}) => (
  <div className="search-suggestions">
    {units.length > 0
      ? <div className="search-suggestions__list">
          <a className="search-suggestions__open-all" onClick={openAllResults}>{t('SEARCH.SHOW_ALL_RESULTS')}</a>
          {units.map((result, index) =>
            <UnitSuggestion key={index} unit={result}/>
          )}
        </div>
      : null
    }
  </div>
));

export default SearchSuggestions;
