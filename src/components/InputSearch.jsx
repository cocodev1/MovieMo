import { useRef, useState } from "react"
import { Typeahead } from 'react-bootstrap-typeahead'


export default function InputSearch({  onSelected, baseUrls, placeholder, filterFunc, selected, multiple}) {
  const [options, setOptions] = useState([])
  const typeaheadRef = useRef(null)
  const [notSelected, setNotSelected] = useState([])
  
  const getOptions = async (text, e) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzg2YjgwZTU3ODJiYmQ3MDU2ZThhOThmZGUxMTNlYiIsInN1YiI6IjYzYTcyMDcyMDgzNTQ3MDBlMjBmYjI4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZBQNFtL3MFY2O26dcsxNsCB9lxiB44tFNaAm8KPlJ4'
      }
    }
    const urls = baseUrls.map((baseUrl) => baseUrl + text)

    const optionsInput = await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, options)
        const data = await response.json()
        if (filterFunc) {
          return data.results.filter(filterFunc)
        }
        return data.results
    }))
    
   
    setOptions(optionsInput.flat())

  }

  return (
    <>
        <link
    rel="stylesheet"
    href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"
  />
    <Typeahead 
      multiple={multiple == undefined ? true : multiple}
      id="basic-typeahead-single"
      selected={selected == undefined ? notSelected : selected}
      onChange={(selected) => {
        console.log(selected)   
        onSelected(selected)
        typeaheadRef.current.clear()
        typeaheadRef.current.toggleMenu()
      }}
      labelKey="name"
      options={options}
      onInputChange={(text, e) => getOptions(text, e)}
      placeholder={placeholder || "Choose a name..." }
      ref={typeaheadRef}
      
      />
    </>
  )
}