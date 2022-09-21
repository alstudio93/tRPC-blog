import React from 'react'
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { FaFileContract } from "react-icons/fa"
import Link from 'next/link'

const Footer = () => {
    return (
        <>
            <footer id="contact" className="flex flex-col items-center justify-center mt-10 pt-10 pb-3 mx-auto gap-y-5">

                {/* <!-- icons --> */}
                <div className="flex items-center gap-x-5">
                    {/* <Link href="https://www.linkedin.com/company/bupcards"><a target="_blank" rel="noreferrer" title="Visit LinkedIn"><BsLinkedin className='text-2xl' /></a></Link> */}
                    <Link href="https://www.instagram.com/alstudio93/"><a target="_blank" rel="noreferrer" title="Visit Instagram"><BsInstagram className='text-2xl' /></a></Link>
                    <Link href="https://twitter.com/AndrewTLadd"><a target="_blank" rel="noreferrer" title="Visit Twitter"><BsTwitter className='text-2xl' /></a></Link>
                    <Link href="https://github.com/alstudio93/alstudio"><a target="_blank" rel="noreferrer" title="Visit Twitter"><BsGithub className='text-2xl' /></a></Link>
                    <Link href="mailto: alstudiowebdev@gmail.com"><a target="_blank" rel="noreferrer" title="Contact ALStudio"><AiOutlineMail className='text-2xl animate-bounce' /></a></Link>
                    {/* <>
                        <label htmlFor="my-modal" className="cursor-pointer modal-button "><FaFileContract className='text-2xl' title='View Contract' /></label>

                        <input type="checkbox" id="my-modal" className="modal-toggle" />

                        <div className="modal dark:text-black">
                            <div className="modal-box">
                                <h3 className="text-lg font-bold text-center"></h3>
                                <div className="flex flex-col items-center pt-10 gap-y-5 ">

                                </div>
                                <div className="modal-action">
                                    <label htmlFor="my-modal" className="btn">Close</label>
                                </div>
                            </div>
                        </div>
                    </> */}


                </div>



                {/* <!-- Copyright --> */}
                <span className="text-xs font-nunito"
                >Copyright &copy; {new Date().getFullYear()} ALStudio
                </span>

            </footer>
        </>

    )
}

export default Footer