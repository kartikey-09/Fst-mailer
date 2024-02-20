import "./SearchResult.css";

export const SearchResult = ({
  result,
  setContent,
 
  templateList,
  setSubject,
  setResults
}) => {
  const handleTemplateSelection = (selectedTemplate) => {
    
    // Fetch the content of the selected template and update the content state
    const selectedTemplateObj = templateList.find(
      (template) => template.subject === selectedTemplate
    );
    if (selectedTemplateObj) {
      setContent(selectedTemplateObj.content);
      setSubject(selectedTemplateObj.subject);
      setResults([]);
    }
  };

  return (
    <div
      className="search-result"
      onClick={() => handleTemplateSelection(result)}
    >
      {result}
    </div>
  );
};
