import '../Blogposts.css'
import githubicon from '../assets/github-icon.png';
import { FaArrowLeft } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";

function HelloWorld() {
    return (
        <>
            <div className='blogpost'>
                <div className='home'>
                    <a href='/#/'>
                        <FaArrowLeft size='1.1rem' className='left-arrow'/>Back to Home
                    </a>
                </div>
                <div className='title'>Hello World</div>
                <div className='subtitle'>
                    <div className='date'><MdCalendarToday size='1.4rem'/>1 Feb 2026</div>
                    <div className='blogpost-tags'>
                        <div className='blogpost-tag'>Yapping</div>
                    </div>
                </div>
                <div className='content'>
                    <p>Hi, I'm Water from Singapore! I've been playing CTFs since March 2024, and I mainly do crypto, although I enjoy the other categories as well, and play around with them in my free time!</p>
                    <br></br>
                    <p>Saying that I enjoy CTFs is frankly an understatement, I love them a ton. I play for a few teams, namely <a href='https://sekai.team' target="_blank">Project Sekai</a>, <a href='https://ctf.mt' target="_blank">Friendly Maltese Citizens</a> and <a href='https://ctftime.org/team/419122' target="_blank">Crystallisers</a>.</p>
                    <br></br>
                    <p>I've been programming since I was 10, and hence other than CTFs and cybersecurity, I enjoy just about anything tech-related. Coding this blog was a blast and I'm really happy with how it turned out.</p>
                    <br></br>
                    <p>Outside of computing, I enjoy math (hence my maining of crypto), cubing and listening to music.</p>
                    <br></br>
                    <p>Feel free to check out my CTF writeups on my blog!</p>
                </div>
            </div>
            <div className='footer'>
                <div className='footer-content'>
                    <div className='copyright'>© 2026 Water</div>
                    <div className='github-link'>
                        <a href = "https://www.github.com/shuizhuimiaoman">
                        <img className = "footer-github-icon" src={githubicon} alt="Github Icon"></img>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HelloWorld