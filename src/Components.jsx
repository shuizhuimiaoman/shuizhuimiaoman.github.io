import './Components.css';
import { useState, useEffect, useRef } from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { FaRegFile } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({collapsible, collapseDefault, data}) { // data is a list of dictionaries e.g. [{name:chall.py,language:python,code:print("Hello world")}]
  const [viewing, setViewing] = useState(0);
  const [collapsed, setCollapsed] = useState(collapseDefault);
  const [codeWindowHeight, setCodeWindowHeight] = useState();
  const ref = useRef(null)
  useEffect(() => {
    setCodeWindowHeight(ref.current.scrollHeight);
  })


  return (
    <>
      <div className={`codeblock ${
        collapsed ? 'collapsed' : ''
      }`}>
        <div className='tab-bar'>
          {collapsible && (
            <button className='collapse-button' onClick={() => setCollapsed(!collapsed)}>
              <div className="collapse-arrow">
                <IoIosArrowForward size="1rem" />
              </div>
            </button>
          )}
          {data.map((item, index) => (
            <div
              key={item['name']}
              className={`tab ${index === viewing ? "viewing" : ""}`}
            >
              <button onClick={() => setViewing(index)}>
                {item['name']}
              </button>
            </div>
          ))}
        </div>
        <div className='code-container'>
          <SyntaxHighlighter
            ref={ref}
            language={data[viewing]['language']}
            style={oneDark}
            showLineNumbers
            startingLineNumber={data[viewing]['startingLineNumber']}
            customStyle={{
              margin: '0',
              background: '#101435',
              borderRadius: '0 0 10px 10px',
              fontSize: '0.9rem',
              padding: '1vh 1vw',
              maxHeight: collapsed ? '0px' : `${codeWindowHeight}px`,
              overflowY: 'hidden',
              visibility: collapsed ? 'hidden' : 'visible',
              transition: collapsed ? `max-height 0.3s, visibility 0s linear ${(((codeWindowHeight / window.innerHeight) * 100)-5)/((codeWindowHeight / window.innerHeight) * 100)*0.25}s` : 'max-height 0.3s, visibility 0s',
              paddingBottom: '1.7vh',
            }}
            codeTagProps={{
              style: {
                background: "none",
              },
            }}
          >
            {data[viewing]['code']}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
}

export function Terminal({text}) {
  return (
    <>
      <div className='terminal'>
        <pre>
          <code>
            {text}
          </code>
        </pre>
      </div>
    </>
  )
}

export function Download({filename,filepath}) {
  return (
    <>
      <div className='file-download'>
        <a className='download-btn' href={filepath} download={filename}>
          <div className='download-left-side'>
            <FaRegFile className="file-icon" size='2rem'/>
            <div className='filename'>{filename}</div>
          </div>
          <FiDownload className='download-icon' size='2rem'/>
        </a>
      </div>
    </>
  )
}