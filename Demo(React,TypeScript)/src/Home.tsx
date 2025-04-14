import { ChangeEvent, useState } from "react"
import { CheckBoxInput, NumberRange, FloatInput, ListSelect, TextInput, NumberInput } from "./Components/Forms"
import { Navbar } from "./Components/Navs"
import { FaArrowsRotate } from "react-icons/fa6"
import { get_movie_list, MovieDataType } from "./Functions/MoviesList"
import { MovieCard } from "./Components/MovieCard"

export type MovieListQuery={
    prompt:string
    genres:Array<string>
    types:Array<string>
    date:{
        start:number
        end:number
    }
    score:number
    size:number
}
const allGenres=["Drama","Comedy","Musical"]
const allTypes=["movie","tv-show"]

export const Home=()=>{
    const [loading,setLoading] = useState<boolean>(false)

    const [listQuery,setListQuery] = useState<MovieListQuery>({prompt:"",genres:[],types:[],date:{start:1930,end:2016},score:7.5,size:5})
    const [genresList,setgenresList] = useState<Array<string>>(allGenres)
    const [selectedGenresList,setSelectedGenresList] = useState<Array<string>>([])

    const [movieList,setMovieList] = useState<MovieDataType[]>([])

    const AddGenresListItem=(event:ChangeEvent<HTMLSelectElement>)=>{
        setgenresList(genresList.filter(item=>item!==event.target.value))
        setSelectedGenresList([...new Set([...selectedGenresList, event.target.value])])
        setListQuery((prev)=>({...prev,genres:[...new Set([...selectedGenresList, event.target.value])]}))
    }
    const DeleteGenresListItem=(item:string)=>{
        setgenresList([...new Set([...genresList, item])])
        setSelectedGenresList(selectedGenresList.filter(el=>el!==item))
        setListQuery((prev)=>({...prev,genres:selectedGenresList.filter(el=>el!==item)}))
    } 
    const SetTypeList=(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.checked) setListQuery((prev)=>({...prev,types:[...new Set([...prev.types,e.target.name])]}))
        else setListQuery((prev)=>({...prev,types:prev.types.filter(el=>el!==e.target.name)}))
    }
    const SetDate=(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.name=="start") setListQuery((prev)=>({...prev,date:{start:parseInt(e.target.value),end:prev.date.end}}))
        else if(e.target.name=="end") setListQuery((prev)=>({...prev,date:{start:prev.date.start,end:parseInt(e.target.value)}}))
    }
    const FetchMovieList=async ()=>{
        const query={...listQuery}
        if(query.types.length<=0) query.types=allTypes
        if(query.genres.length<=0) query.genres=allGenres

        setMovieList(await get_movie_list(query,setLoading) as Array<MovieDataType>)
    }

    return <div className="core flex flex-col">
        {/* Top Nav Bar */}
        <Navbar />
        {/* Main Page */}
        <div className="flex overflow-hidden">
            {/* Left Panel, query settings */}
            <div className="pt-5 px-4 w-1/2 overflow-y-auto">
                <TextInput rows={5} label="Describe what would you like to watch" placeholder="Friendship, a lot of action and hand to hand combat"
                    onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setListQuery((prev)=>({...prev,prompt:e.target.value}))}/>
                <CheckBoxInput className="mt-4" id="Type" label="Type:" values={allTypes}
                    onChange={SetTypeList}/>
                <ListSelect className="mt-4" handleListDel={DeleteGenresListItem} handleListAdd={AddGenresListItem} list={selectedGenresList} values={genresList} label="Genres:"/>
                <NumberRange className="mt-4" label="Relese date:"
                    onChange={SetDate}/>
                <FloatInput className="mt-4" label="IMDB Score:"
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setListQuery((prev)=>({...prev,score:parseFloat(e.target.value)}))}/>
            </div>
            {/* Right Panel, query results */}
            <div className="pt-5 w-1/2 px-4">
                {/* Combine listQuery into full prompt */}
                <div className="font-normal border-b-2 pb-3 mb-2">
                    {/* Generate Button */}
                    <button className="flex bg-BaseLight rounded-lg p-1 pl-3 mb-3 shadow-sm shadow-gray-400 
                        hover:text-purple-200 active:shadow-purple-400">
                        <div onClick={FetchMovieList}>{"Generate"}</div>
                        <NumberInput name="generate" className="px-2" min={1} max={15} defaultValue={5}
                            onChange={(e:ChangeEvent<HTMLInputElement>)=>setListQuery((prev)=>({...prev,size:parseInt(e.target.value)}))}/>
                        <FaArrowsRotate className="self-center mx-1" onClick={FetchMovieList}/>
                    </button>

                    {/* Type */}
                    <p className="text_highlight">
                        {listQuery.types.length>0?
                            listQuery.types.map((item,idx)=>(idx<listQuery.types.length-1?item+"s/":item+"s"))
                            :
                            "movies/tv-shows"
                        }
                    </p>
                    
                    {/* Prompt */}
                    {listQuery.prompt.length>0?", with ":""}
                    <p className="text_highlight">
                        {listQuery.prompt.length>0?
                            listQuery.prompt
                            :
                            ""
                        }
                    </p>

                    {/* Genres */}
                    {", that fit "}
                    <p className="text_highlight">
                        {listQuery.genres.length>0?
                            listQuery.genres.join('/')
                            :
                            "any "
                        }
                    </p>

                    {/* Relese Date */}
                    {" genres, were released between "}
                    <p className="text_highlight">
                        {listQuery.date.start.toString()+" and "+listQuery.date.end.toString()}
                    </p>

                    {/* IMDB Score */}
                    {" and have an IMDb score higher than "}
                    <p className="text_highlight">
                        {listQuery.score.toString()}
                    </p>
                </div>
                {/* Movies List */}
                <div className="flex justify-center h-3/4 overflow-y-auto">
                    {loading?
                        <img src="./icon.png" className="animate-bounce h-8 mt-4" />
                        :
                        <ul className="w-full">
                            {movieList.map((item,idx)=>(
                                <li key={idx}>
                                    <MovieCard data={item}/>
                                </li>))}
                        </ul>
                    }
                </div>
            </div>
        </div>
    </div>
}