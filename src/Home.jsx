import { useState } from "react";
import './Home.css';
import profilepic from './assets/profile-pic.jpg';
import githubicon from './assets/github-icon.png';
import { MdCalendarToday } from "react-icons/md";
import { MdSearch } from "react-icons/md";

const blogposts = [
  {
    name: "Hello World",
    description: "About me",
    url: "hello-world",
    tags: ["Yapping"],
    date: "1 Feb 2026",
    content: "<p>Hi, I'm Water from Singapore! I've been playing CTFs since March 2024, and I mainly do crypto, although I enjoy the other categories as well, and play around with them in my free time!</p>                    <br></br>                    <p>Saying that I enjoy CTFs is frankly an understatement, I love them a ton. I play for a few teams, namely <a href='https://sekai.team' target='_blank'>Project Sekai</a>, <a href='https://ctf.mt' target='_blank'>Friendly Maltese Citizens</a> and <a href='https://ctftime.org/team/419122' target='_blank'>Crystallisers</a>.</p>                    <br></br>                    <p>I've been programming since I was 10, and hence other than CTFs and cybersecurity, I enjoy just about anything tech-related. Coding this blog was a blast and I'm really happy with how it turned out.</p>                    <br></br>                    <p>Outside of computing, I enjoy math (hence my maining of crypto), cubing and listening to music.</p>                    <br></br>                    <p>Feel free to check out my CTF writeups on my blog!</p>"
  },
];

function Blogpost({name,description,url,tags,date}) {
  return (
    <>
      <div className='blogpost-display'>
        <a href={`/#/${url}`}>
          <div className='header'>{name}</div>
            <div className='secondrow'>
            <div className='blogpost-display-tags'>
              {tags?.map(tag => (
                <div key={tag} className="blogpost-display-tag">
                  {tag}
                </div>
              ))}
            </div>
            <MdCalendarToday size='1.3rem'/> <div className='date'>{date}</div>
            </div>
          <div className='description'>{description}</div>
        </a>
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
        <div className='introduction'>
          <div className='introduction-text'>
            <div className='introduction-title'>Hi, I'm <span className='highlight'>Water!</span></div>
            <div className='introduction-content'>I'm a CTF player from Singapore. I play for the teams <a href='https://sekai.team' target="_blank">Project Sekai</a>, <a href='https://ctf.mt' target="_blank">Friendly Maltese Citizens</a> and <a href='https://ctftime.org/team/419122' target="_blank">Crystallisers</a>. I mainly do cryptography, but I occasionally try my hand at the other categories as well.</div>
            <div className='introduction-content'>Feel free to check out my blog below, where I post CTF writeups and others!</div>
            <div><a href = "https://www.github.com/shuizhuimiaoman"><img className = "introduction-github-icon" src={githubicon} alt="Github Icon"></img></a></div>
          </div>
          <div><img className='profile-picture' src={profilepic}></img></div>
        </div>
        <div className='blog'>
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