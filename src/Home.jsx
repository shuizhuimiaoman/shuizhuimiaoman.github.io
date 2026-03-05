import { useState } from "react";
import './Home.css';
import profilepic from './assets/profile-pic.jpg';
import githubicon from './assets/github-icon.png';
import { MdCalendarToday } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const blogposts = [
  {
    name: "BlahajCTF 2025 Writeups",
    description: "Writeup for 5 hard-insane challenges",
    url: "blahajctf-2025-writeups",
    file: "BlahajCTF-2025.jsx",
    tags: ["CTF","Crypto","Web","Pwn"],
    date: "5 Mar 2026",
  },
  {
    name: "Hello World",
    description: "About me",
    url: "hello-world",
    file: "HelloWorld.jsx",
    tags: ["Yapping"],
    date: "1 Feb 2026",
  },
];

for (const blogpost of blogposts) {
  const filename = blogpost.file
  import(/* @vite-ignore */ `./blogposts/${filename}?raw`).then(output => {
    blogpost.content = output.default
  })
}

function Blogpost({name,description,url,tags,date}) {
  return (
    <>
      <div className='blogpost-display'>
        <Link to={`/${url}`}>
          <div className='header'>{name}</div>
            <div className='secondrow'>
            <div className='blogpost-display-tags'>
              {tags?.map(tag => (
                <div key={tag} className="blogpost-display-tag">
                  {tag}
                </div>
              ))}
            </div>
              <div className='blogpost-display-date'><MdCalendarToday size='1.3rem'/>{date}</div>
            </div>
          <div className='description'>{description}</div>
        </Link>
      </div>
    </>
  )
}

function Home() {
  const tagFrequency = blogposts
    .flatMap(post => post.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const [allTags, setTags] = useState(
    Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => ({ name: tag, selected: false }))
  );

  const toggleTag = (name) => {
    setTags(prevTags =>
      prevTags.map(tag =>
        tag.name === name ? { ...tag, selected: !tag.selected } : tag
      )
    );
  };

  const [query, setQuery] = useState("");

  const selectedTags = allTags
    .filter(tag => tag.selected)
    .map(tag => tag.name);

  const blogpostsToDisplay = blogposts.filter(post => {
    // tags
    const matchesTags =
      selectedTags.length === 0 ||
      post.tags.some(tag => selectedTags.includes(tag));

    // search
    const matchesQuery = query
      ? Object.values(post).some(val => {
          if (Array.isArray(val)) {
            return val.some(subVal =>
              String(subVal).toLowerCase().includes(query.toLowerCase())
            );
          }
          return String(val).toLowerCase().includes(query.toLowerCase());
        })
      : true;

    return matchesTags && matchesQuery;
  });

  return (
    <>
      <div className='homepage'>
        <nav>
          <div className='home'></div>
          <div className='navbar'>
            <ol className='navbar-sitelist'>
              <li><Link to='/' style={{textDecoration:'underline', textUnderlineOffset: '8px', textDecorationThickness: '2px'}}>Home</Link></li>
              <li><HashLink to="#blog">Posts</HashLink></li>
            </ol>
          </div>
        </nav>
        <div className='introduction'>
          <div className='introduction-text'>
            <div className='introduction-title'>Hi, I'm <span className='highlight'>Water!</span></div>
            <div className='introduction-content'>I'm a CTF player from Singapore. I play for the teams <a href='https://sekai.team' target="_blank">Project Sekai</a>, <a href='https://ctf.mt' target="_blank">Friendly Maltese Citizens</a> and <a href='https://ctftime.org/team/419122' target="_blank">Crystallisers</a>. I mainly do cryptography, but I occasionally try my hand at the other categories as well.</div>
            <div className='introduction-content'>Feel free to check out my blog below, where I post CTF writeups and others!</div>
            <div><a href = "https://www.github.com/shuizhuimiaoman"><img className = "introduction-github-icon" src={githubicon} alt="Github Icon"></img></a></div>
          </div>
          <div><img className='profile-picture' src={profilepic}></img></div>
        </div>
        <div className='blog' id='blog'>
          <div className='sidebar'>
            <div className='searchbar'>
              <MdSearch size='1.5rem'/><input className='searchinput' placeholder='Search' onChange={(e) => setQuery(e.target.value)}></input>
            </div>
            <div className='sidebar-tag-label'>Tags</div>
            <div className='sidebar-tags'>
              {allTags?.map(tag => (
                <button key={tag.name} className={`sidebar-tag ${tag.selected ? "selected" : ""}`} onClick={() => toggleTag(tag.name)}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <div className="blogposts">
            {blogpostsToDisplay.length === 0 ? (
              <div className='no-results'>No results.</div>
            ) : (
              blogpostsToDisplay.map(post => (
                <Blogpost
                  key={post.name}
                  name={post.name}
                  description={post.description}
                  url={post.url}
                  tags={post.tags}
                  date={post.date}
                />
              ))
            )}
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
      </div>
    </>

  )
}
export default Home