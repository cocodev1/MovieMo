import InputSearch from "./InputSearch";

export default function FilterHeader({ title, onSelected, baseUrls, placeholder, filterFunc, selected, multiple }) {
    return (
        <div className='filter-header'>
        <p>{title}</p>
        <InputSearch
            placeholder={placeholder}
            onSelected={onSelected}
            baseUrls={baseUrls}
            filterFunc={filterFunc}
            selected={selected}
            multiple={multiple}
        />
        </div>
    )
}
  
  
 