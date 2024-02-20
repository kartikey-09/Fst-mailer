import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

const SearchResultsList = ({ results , setContent , templateList, setSubject ,setResults}) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.subject} key={id} setContent={setContent} templateList={templateList} setSubject={setSubject} setResults={setResults} />;
      })}
    </div>
  );
};


export default SearchResultsList;