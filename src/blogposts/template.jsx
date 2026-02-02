import '../Blogposts.css'
import githubicon from '../assets/github-icon.png';
import { FaArrowLeft } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";

function template() {
    return (
        <>
            <div className='blogpost'>
                <div className='home'>
                    <a href='/#/'>
                        <FaArrowLeft size='1.1rem' className='left-arrow'/>Back to Home
                    </a>
                </div>
                <div className='title'>Title</div>
                <div className='subtitle'>
                    <div className='date'><MdCalendarToday size='1.4rem'/>1 Feb 2026</div>
                    <div className='blogpost-tags'>
                        <div className='blogpost-tag'>Tag</div>
                    </div>
                </div>
                <div className='content'>
                    <p>content</p>
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

export default template