import { Typeahead } from 'react-bootstrap-typeahead'
import { useRef, useState } from "react"

export default function InputSearchConst({ onSelected, options, placeholder }) {

    const typeaheadRef = useRef(null)
    const [notSelected, setNotSelected] = useState([])

    return (
        <>
            <link
        rel="stylesheet"
        href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"
      />
        <Typeahead
          multiple
          id="basic-typeahead-single"
          selected={notSelected}
          onChange={(selected) => {
            console.log(selected)   
            onSelected(selected)
            typeaheadRef.current.clear()
            typeaheadRef.current.toggleMenu()
          }}
          labelKey="name"
          options={options}
          placeholder={placeholder || "Choose a name..." }
          ref={typeaheadRef}
          />
        </>
    )
}