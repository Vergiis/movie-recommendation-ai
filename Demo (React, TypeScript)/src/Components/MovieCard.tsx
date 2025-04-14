import { MovieDataType } from "../Functions/MoviesList"

type MovieCardProps={
    data:MovieDataType
}
export const MovieCard=({data}:MovieCardProps)=>{
    return <div className="bg-BaseLight mb-2 flex">
        {/* Left */}
        <div className="float-left w-1/4">
            {/* Poster */}
            <img className="w-full rounded-md" src={data.poster?data.poster:"./default-image.jpg"}/>
        </div>
        {/* Right */}
        <div className="float-right flex flex-col flex-grow p-2 w-3/4">
            {/* Title */}
            <p className="font-bold text-center w-full pb-2">{data.title}</p>
            {/* Relese Date/Director/Rating */}
            <div className="flex justify-between pr-4">
                <p className="text-[0.7rem]">{data.date}{" "}{data.director}</p>
                <p className="text-[0.75rem]">{"IMDB:"}{data.score}{"/10"}</p>
            </div>
            {/* Runtime/Genres */}
            <p className="text-[0.7rem]">{data.runtime}{"min. "}{data.genres.join(', ')}</p>
            {/* Plot */}
            <p className="text-sm p-1 pt-2">{data.plot}</p>
            {/* Cast */}
            <div className="flex justify-between px-5">
            {data.casts.map((cast)=>(
                <div className="text-center mt-5 pb-2">
                    <img className="w-14 h-14 object-cover object-top mx-auto rounded-full mb-2" 
                        src={cast.avatar!=null?cast.avatar:"./default-avatar.jpg"} />
                    <p className="text-sm">{cast.name}</p>
                    <p className="text-[0.7rem] font-bold">{cast.character}</p>
                </div>
                ))}
            </div>
        </div>
        
    </div>
}