import InputSearchConst from './InputSearchConst'

export default function FilterHeaderConst({title, options, onSelected, placeholder}) {
    return (
        <div className='filter-header'>
        <p>{title}</p>
        <InputSearchConst
            placeholder={placeholder}
            onSelected={onSelected}
            options={options}
        />
        </div>
    )
}