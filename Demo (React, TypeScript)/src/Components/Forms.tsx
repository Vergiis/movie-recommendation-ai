import { ChangeEvent } from "react"
import { MdDeleteForever } from "react-icons/md";

type TextInputProps={
    label?:string
    rows:number
    placeholder?:string
    onChange?:(event: ChangeEvent<HTMLTextAreaElement>) => void
}
export const TextInput=({label,rows,placeholder,onChange}:TextInputProps)=>{
    return <>
        <label className="font-bold text-sm">{label}</label>
        <textarea onChange={onChange} placeholder={placeholder} rows={rows} className="w-full p-2 mt-1 resize-none bg-BaseDark rounded-md border-2 border-BaseLight focus:outline-none" />
    </>
}

type CheckBoxInputProps={
    values:Array<string>
    label?:string
    id:string
    className?:string
    onChange?:(event: ChangeEvent<HTMLInputElement>) => void
}
export const CheckBoxInput=({values,label,id,className,onChange}:CheckBoxInputProps)=>{
    return<div className={className+" block text-sm"}>
        <label className="font-bold">{label}</label>
        <ul className="flex mt-1">
            {values.map((item,idx)=>(
                <li key={idx} className="p-1">
                    <input onChange={onChange} id={id+idx} name={item} type="checkbox"/>
                    <label htmlFor={id+idx} className="px-2">{item}</label>
                </li>
            ))}
        </ul>
    </div> 
}

type ListSelectProps={
    values:Array<string>
    list:Array<string>
    className?:string
    label?:string
    handleListAdd:(event: ChangeEvent<HTMLSelectElement>) => void
    handleListDel:(item: string) => void
}
export const ListSelect=({values,className,label,list,handleListAdd,handleListDel}:ListSelectProps)=>{
    return<div className={className+" text-sm block"}>
        <label className="font-bold">{label}</label>
        <select onChange={handleListAdd} value={"default"} className="bg-BaseDark p-2 mt-1 flex w-full rounded-md border border-BaseLight">
            <option value={"default"} hidden>Select Genres</option>
            {values.map((item,idx)=>(
                <option key={idx} value={item}>{item}</option>
            ))}
        </select>
        <ul className="p-2 w-full bg-BaseDark rounded-sm mt-2 border border-BaseLight">
            {list.map((item, idx)=>(
                <li className="p-1 flex justify-between pr-2" key={idx}>
                    <h1>{item}</h1>
                    <MdDeleteForever onClick={()=>{handleListDel(item)}} className="self-center text-xl cursor-pointer hover:text-red-400" />
                </li>
            ))}
        </ul>
    </div>
}

type NumberInputProps={
    max:number
    min:number
    defaultValue:number
    label?:string
    className?:string
    name:string
    onChange?:(event: ChangeEvent<HTMLInputElement>) => void
}
export const NumberInput=({max,min,defaultValue,className,label,name,onChange}:NumberInputProps)=>{
    return <div className={className+" text-sm flex"}>
        <label className="font-bold mr-1">{label}</label>
        <input name={name} className="bg-BaseDark border-BaseLight border-2 rounded-md pl-1 w-16 focus:outline-none" type="number"
        defaultValue={defaultValue} max={max} min={min}
        onChange={onChange}/>
    </div>
}
type NumberRangeProps={
    label?:string
    className?:string
    onChange?:(event: ChangeEvent<HTMLInputElement>) => void
}
export const NumberRange=({label,className,onChange}:NumberRangeProps)=>{
    return <div className={className+" text-sm flex"}>
        <label className="font-bold mr-2">{label}</label>
        <div className="flex justify-between gap-2">
            <NumberInput onChange={onChange} name="start" max={2025} min={1930} defaultValue={1930}/>
            {":"}
            <NumberInput onChange={onChange} name="end" max={2016} min={1930} defaultValue={2025}/>
        </div>
    </div>
}

type FloatInputProps={
    label:string
    className:string
    onChange?:(event: ChangeEvent<HTMLInputElement>) => void
}
export const FloatInput=({label,className,onChange}:FloatInputProps)=>{
    return <div className={className+" text-sm flex"}>
        <label className="font-bold mr-2">{label}</label>
        {">"}
        <input type="number" className="bg-BaseDark border-BaseLight border-2 rounded-md ml-1 pl-1 w-16 focus:outline-none"
             step={0.1} defaultValue={7.5} max={10} min={1}
             onChange={onChange}/>
    </div>
}