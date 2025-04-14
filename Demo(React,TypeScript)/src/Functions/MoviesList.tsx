import { MovieListQuery } from "../Home";
import axios from "axios";

export type MovieDataType={
    imdbid:string
    date:number
    director:string
    genres:Array<string>
    plot:string
    poster:string
    runtime:number
    score:number
    title:string
    type:string
    casts:Array<{
        name:string
        avatar:string
        character:string
    }>
}

export const get_movie_list= async (query:MovieListQuery,loadingState:React.Dispatch<React.SetStateAction<boolean>>)=>{
    loadingState(true)

    try {
        const res = await axios.post(import.meta.env.VITE_MOVIELIST_API_URL,{
            prompt:query.prompt,
            size:query.size,
            genres:query.genres,
            types:query.types,
            score:query.score,
            date_start:query.date.start,
            date_end:query.date.end
        })
        if(!res){
            loadingState(false)
            return []
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.data.data.forEach((item:any)=>item.casts=JSON.parse(item.casts))
        loadingState(false)
        return res.data.data as MovieDataType
    } catch (error) {
        console.log(error)
        loadingState(false)
        return []
    }
}