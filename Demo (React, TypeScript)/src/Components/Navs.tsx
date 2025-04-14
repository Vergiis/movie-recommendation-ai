import { FaGithub } from 'react-icons/fa';

export const Navbar=()=>{
    return <div className="bg-BaseDark text-gray-200 p-3 px-5 flex font-AzeretMono justify-between">
        <a href='/'><img src="./logo.png" className="w-16"/></a>
        <div className="font-bold content-center ml-5 text-xl">AI Movies Recommendations - DEMO</div>
        <a href='https://github.com/Vergiis' target='_blank' className="text-3xl self-center"><FaGithub/></a>
    </div>
}