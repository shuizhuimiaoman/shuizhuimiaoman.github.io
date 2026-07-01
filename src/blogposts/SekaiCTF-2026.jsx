import '../Blogposts.css'
import githubicon from '../assets/github-icon.png';
import { HashLink } from 'react-router-hash-link';
import { FaArrowLeft } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Terminal, Download, CodeBlock } from '../Components.jsx';
import challengeImage from '../assets/sekaictf-2026/challenge.png'

function SekaiCTF2026AuthorWriteups() {
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
                        <FaArrowLeft size='1.05rem' className='left-arrow'/>Back to Home
                    </Link>
                </div>
                <div className='title'>Title</div>
                <div className='subtitle'>
                    <div className='blogpost-page-date'><MdCalendarToday size='1.4rem'/>1 July 2026</div>
                    <div className='blogpost-tags'>
                        <div className='blogpost-tag'>CTF</div>
                        <div className='blogpost-tag'>Crypto</div>
                    </div>
                </div>
                <div className='content'>
		    <h1>Contents</h1>
                    <ol style={{paddingLeft:'1.8rem'}}>
                        <li><HashLink to="#foreword">Foreword</HashLink></li>
                        <li><HashLink to="#challenge">Challenge</HashLink></li>
                        <li><HashLink to="#solution">Solution</HashLink></li>
                    </ol>
                    <br></br>
                    <h1 id='foreword'>Foreword</h1>
                    <p>
			Last week, the <a href="https://sekai.team" target="_blank">Project Sekai</a> CTF team held our annual CTF. It was an honour to be able to set a crypto challenge alongside amazing crypto CTF players @Neobeo and @Sceleri; I set the challenge orbital-strike, and this blogpost is a writeup for it.
		    </p>
		    <br></br>
		    <p>
			This challenge is actually a revenge of a local CTF challenge that I set (Sieberrsec CTF 2026/ORBIT, will update with the link when I finish my author writeups for that CTF). Long story short, Neobeo solved the original challenge with 4 less outputs than I required, and afterwards managed to solve it without knowledge of <InlineMath math='P'/> (but only with 1 less output instead of 4), and thus this challenge was born.
		    </p>
		    <br></br>













                    <h1 id='challenge'>Challenge</h1>
		    <img src={challengeImage} style={{width: 'max(50vh,50vw)'}}></img>
		    <br></br>
		    <br></br>
		    <p>
			Let's take a look at the challenge source code.
		    </p>
		    <br></br>
		    <CodeBlock collapsible={true} collapseDefault={false} data={[{'name':'chall.py','language':'python','startingLineNumber':1,'code':`from Crypto.Util.number import getPrime, getRandomRange
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
 
FLAG = open('flag.txt','rb').read()

def lcg(a,b,p,x):
    while 1: yield (x := (a*x+next(b)) % p)

P, p = getPrime(256), getPrime(0x137)
X, A, B, a, b = [getRandomRange(0,m) for m in (P,P,p,p,p)]

# what's better than one lcg? TWO lcgs!
moons = lcg(a,iter([b]*14),p,B)
planets = lcg(A,moons,P,X)
orbit = [next(planets) for _ in range(14)]
star = AES.new(X.to_bytes(32),AES.MODE_ECB).encrypt(pad(FLAG,16)).hex()

print(f"{orbit = }")
print(f"{star = }")

'''
orbit = [46157012221654917396851254347154820393060391878580715960476654689260395468184, 36926194633341127588542680684095293820802193681748458943524916140809713523560, 16005201943847263206512436577001283414470030273089746675203830598137794555134, 28937919714389596084610407023450127584695575606301484773390370819366639643218, 11459012353705334109041842799942754581703065868230253271729711591416155557180, 31030059279554219046464541926833857543445131889728181065565033726460506326840, 20987315604501021667042879662101693092441980938033961081037347214532349371248, 76741461130245451493723909055453557280102065396647043801270629949855565452326, 84258885183671683674472390974667571532577240974449641001706593550302243268268, 59535034089467707172052245359810812420431903279354584714432674122159502991956, 7115679899033391144975170596669540596311296590450661546000723388170577963715, 35572951991838484594163260879328705523576344587262461128887804475450813563036, 85569022704397114858282741078883377190544624744955636482627379979792474136036, 5047270986830280372910174287287823507537624765267582560460157826800286170460]
star = '1664ff83cbca2643b357bcdc8c3d6e1548615a18cec73e734a82e163b32a9b0c367c61bab01140a04ac8eda8b007d1d6'
'''`}]}></CodeBlock>
		    <br></br>
		    <p>
			The source code is pretty short, which is something I do really like. In essence, this is a two-layer linear congruential generator (LCG), where the <InlineMath math='b'/> of one LCG is replaced with another LCG that has different, larger parameters. All parameters are unknown, and we need to find the original state of the "outer" LCG, given 14 of its outputs.</p>
		    <br></br>











		    <h1 id='solution'>Solution</h1>
		    <p>
			Before we start, let's define some variables. Let <InlineMath math='\mathbf{y}'/> be the consecutive differences between the values of <code className='code'>orbit</code>, i.e. <InlineMath math='y_i = orbit_{i+1} - orbit_i'/>. Let <InlineMath math='\mathbf{x}'/> be the same, but for <code className='code'>moons</code>.
		    </p>
		    <br></br>
		    <p>Now let's manipulate the equations:</p>
		    <BlockMath math = '\begin{align*}
		    y_{i+1} &\equiv Ay_i+x_i \pmod{P} \\
		    y_{i+1} &= Ay_i+x_i - k_iP, k_i \in \mathbb{Z} \\
		    x_i &= y_{i+1} - Ay_i + k_iP \\
		    \mathbf{x} &= \mathbf{y}_{1:} - A\mathbf{y}_{:13} + P\mathbf{k}, \mathbf{k} \in \mathbb{Z}^{14}
		    \end{align*}'/>
		    <p>We also notice that <InlineMath math='\mathbf{x}'/> forms a geometric series modulo <InlineMath math='p'/>, i.e. <InlineMath math='x_{i+1} \equiv ax_i \pmod{p}'/>.</p>
		    <br></br>
		    <h2>Stern's Attack</h2>
		    <p>Note that all variables defined here are only for this section. Let <InlineMath math='\mathbf{x}'/> be the consecutive differences of output of an LCG, and let <InlineMath math='\mathbf{y}'/> and <InlineMath math='\mathbf{z}'/> be its MSB and LSB respectively, i.e. <InlineMath math='\mathbf{x} = 2^n\mathbf{y}+\mathbf{z}, n \in \mathbb{Z}'/>. Evidently, <InlineMath math='\mathbf{x}'/> forms a geometric series modulo <InlineMath math='p'/>. In a truncated LCG, we only have <InlineMath math='\mathbf{y}'/> modulo <InlineMath math='p'/>.</p>
		    <br></br>
		    <p>Stern's Attack first assumes that <InlineMath math='\mathbf{x}'/> forms a geometric series modulo <InlineMath math='p'/>.</p>
		    <br></br>
		    <p>Next, Stern's Attack states that if a lattice that is orthogonal to some "slices" of <InlineMath math = 'y'/> (e.g. orthogonal to both <InlineMath math = '\mathbf{y}_{:-1}'/> and <InlineMath math = '\mathbf{y}_{1:}'/>), a sublattice of it is also orthogonal to corresponding "slices" (i.e. same slice indices) <InlineMath math = '\mathbf{x}'/>. What this means is that if we get a basis of vectors that are orthogonal to <InlineMath math = '\mathbf{y}'/>, some of the basis vectors will be orthogonal to <InlineMath math = '\mathbf{x}'/>.</p>
		    <br></br>
		    <p>As for the precise indices of the "slices" (e.g. whether we should use <InlineMath math = '\mathbf{y}_{:-1}'/> and <InlineMath math = '\mathbf{y}_{1:}'/> or <InlineMath math = '\mathbf{y}_{:-2}'/>, <InlineMath math = '\mathbf{y}_{1:-1}'/> and <InlineMath math = '\mathbf{y}_{2:}'/>), I defer the calculations to the many papers online. However, for the purpose of CTFs, we can just trial and error until we find parameters that give the highest number of orthogonal basis vectors.</p>
		    <br></br>
		    <p>As it turns out, we can generalise Stern's Attack to a higher number of vectors. From this point, I will reuse variables from the previous paragraphs. Like before, let <InlineMath math='\mathbf{x}'/> form a geometric series modulo <InlineMath math='p'/>, let <InlineMath math = 'A'/>, <InlineMath math = 'b'/>, etc. be arbitrary integers, and let <InlineMath math='\mathbf{a}'/>,  <InlineMath math='\mathbf{b}'/>, etc. be arbitrary vectors.</p>
		    <br></br>
		    <p>Assume <InlineMath math ='\mathbf{x} = A\mathbf{a}+B\mathbf{b} + ...'/>. If a lattice is orthogonal to "slices" of all but one vectors among <InlineMath math='\mathbf{a,b,...}'/>, similarly to Stern's Attack, a sublattice will be orthogonal to <InlineMath math='\mathbf{x}'/>, so we can apply Stern's Attack here. We can look back at the challenge equations and we realise that this is exactly the case, so we can apply Stern's Attack.</p>
		    <br></br>
		    <h2>Recovering a, p</h2>
		    <p>From here onwards I will stop reusing variables (other than <InlineMath math = 'n'/> to denote the last index of vectors, and we go back to the variables defined in the challenge (i.e. before the section on Stern's Attack). Let's say we have a few vectors that are orthogonal to <InlineMath math = '\mathbf{x}'/>, which we can get from Stern's Attack. Let one of such vectors be <InlineMath math = '\mathbf{v}'/>.</p>
		    <br></br>
		    <p>Let's do some equation manipulation:</p>
		    <BlockMath math = '\begin{align*}
		    \mathbf{v} \cdot \mathbf{x} &= 0 \\
		    \sum_{i=1}^n v_ix_i &= 0 \\
		    \sum_{i=1}^n v_ia^ix_i &\equiv 0 \pmod{p} \\\\
		    \text{Assume }x &\not\equiv 0 \pmod{p} \\
		    \sum_{i=1}^n v_ia^i &\equiv 0 \pmod{p} \\
		    \end{align*}'/>
		    <p>Since we know <InlineMath math='\mathbf{v}'/>, we have a polynomial that has has <InlineMath math='a'/> as a root modulo <InlineMath math = 'p'/>. Hence, we can take 3 such polynomials and get two separate resultants, which will both be multiples of <InlineMath math = 'p'/>. Afterwards we can take their gcd to get a small multiple of <InlineMath math = 'p'/>. After we recover <InlineMath math = 'p'/>, we can get the gcd of all 3 polynomials and solve them to get <InlineMath math = 'a'/>.</p>
		    <br></br>
		    <h2>Recovering moons</h2>
		    <p>Unfortunately, the values of <code className='code'>moons</code>, or more specifically the consecutive differences <InlineMath math = 'x'/>, are too large for us to directly recover by finding orthogonal vectors to our current orthogonal vectors. Hence, we need to use some additional constraints that we know of, in order to recover <InlineMath math = 'x'/>.</p>
		    <br></br>
		    <p>We have two additional constraints we can make use of:</p>
                    <ol style={{paddingLeft:'1.8rem'}}>
			<li>The vectors we have that are orthogonal to <InlineMath math = 'x'/> are orthogonal to "slices" of <InlineMath math = 'x'/>.</li>
			<li><InlineMath math = 'x'/> forms a geometric series modulo <InlineMath math = 'p'/>.</li>
		    </ol>
		    <br></br>
		    <p>We will first make use of first constraint. Let the <InlineMath math = 'j'/>th entry of the <InlineMath math = 'i'/>th orthogonal vector be of the form <InlineMath math = 'v_{ij}'/>. Consider the following matrix:</p>
		    <BlockMath math = '
		    M=
		    \begin{bmatrix}
		    0 & v_{00} & v_{01} & \cdots & v_{0n} \\
		    v_{00} & v_{01} & v_{02} & \cdots & 0 \\
		    0 & v_{10} & v_{11} & \cdots & v_{1n} \\
		    \vdots & \vdots & \vdots & \ddots & \vdots \\
		    v_{m0} & v_{m1} & v_{m2} & \cdots & 0
		    \end{bmatrix}
		    '/>
		    <p>By finding a basis orthogonal to <InlineMath math='M'/>, we get a basis <InlineMath math='B'/> for <InlineMath math = '\mathbf{y}'/>, i.e. there exists some vector <InlineMath math = '\mathbf{u}'/> such that <InlineMath math = '\mathbf{u}B = \mathbf{y}'/>.</p>
		    <br></br>
		    <p>We can thus make use of the second constraint to find <InlineMath math = '\mathbf{u}'/>. Cosndier the following vector <InlineMath math = '\mathbf{w}'/> and matrix <InlineMath math = '\mathbf{M}'/>:</p>
		    <BlockMath math = '
		    \mathbf{w} =
		    \begin{bmatrix}
		    1 & a & a^2 & \cdots & a^{n}
		    \end{bmatrix} \\
		    M =
		    \begin{bmatrix}
		    B \\
		    \mathbf{w}
		    \end{bmatrix}
		    '/>
		    <p>We notice that <InlineMath math = '\begin{bmatrix} \mathbf{u} & x_0 \end{bmatrix}'/> is orthogonal to this matrix modulo <InlineMath math = 'p'/>. Hence, we can find said vector by finding a basis orthogonal (this basis in question only has one vector) one last time. Since the elements of the vector are far below <InlineMath math = 'p'/> (bit length about half that of <InlineMath math = 'p'/>), If a vector is near <InlineMath math = 'p'/>, we can deduce that it is a negative number.</p>
		    <br></br>
		    <p>One more thing to note is that because we find orthogonal vectors with LLL, <code className='code'>B.solve_left(y)[-1] == B.solve_left(x)[-1] == +- 1</code>. Additionally, when we find the last orthogonal basis (i.e. when finding <InlineMath math = '\mathbf{u}'/>), the <b>first</b> entry is always equal to <InlineMath math = '1'/> (never <InlineMath math = '-1'/>). I'm not sure why LLL does this, but we can just accept it as a fact and manage our indices/polarity properly.</p>
		    <br></br>
		    <h2>Recovering A, P and the flag</h2>
		    <p>After we recover <InlineMath math = 'x'/>, the hard part is over. We now have enough information to recover A and P. This is analogous to regular LCG parameter recovery.</p>
		    <BlockMath math = '\begin{align*}
		    y_{i+1} &\equiv Ay_i+x_i \pmod{P} \\
		    \frac{y_1-x_0}{y_0} &\equiv A \pmod{P} \\
		    &\equiv \frac{y_2-x_1}{y_1} \pmod{P} \\
		    y_1(y_1-x_0)-y_0(y_2-x_1) &\equiv 0 \pmod{P}
		    \end{align*}'/>
		    <p>We can increment the respective <InlineMath math = 'i'/> values by one to find one more value that is zero modulo <InlineMath math = 'P'/>, then take their gcd to get a small multiple of <InlineMath math = 'P'/>. Afterwards we can solve the first equation above to get <InlineMath math = 'A'/>. Afterwards we just need to clock back the state, see the below equations:</p>
		    <BlockMath math = '\begin{align*}
		    y_{i+1} &\equiv Ay_i+x_i \pmod{P} \\
		    y_i &= orbit_{i+1}-orbit_i \\
		    &\Downarrow \\ 
		    x_{i-1} &\equiv a^{-1}x_i \pmod{p} \\
		    y_{i-1} &\equiv A^{-1}(y_i-x_{i-1}) \pmod{P} \\
		    X = orbit_{-1} &\equiv orbit_0-y_{-1} \pmod{P}
		    \end{align*}'/>
		    <h2>Solvescript</h2>
		    <br></br>
		    <CodeBlock collapsible={true} collapseDefault={true} data={[{'name':'solve.sage','language':'python','startingLineNumber':1,'code':`from Crypto.Cipher import AES

exec(open('chall.py','r').read().split("'''")[1])

dy = vector(orbit[1:]) - vector(orbit[:-1])

Y = matrix(ZZ,3,11)
for i in range(3):
    Y[i] = vector(dy[i:i+11])

rkm = Y.right_kernel_matrix().LLL()[:-2]
R.<x> = PolynomialRing(ZZ)

poly0 = sum([rkm[0,i]*x**i for i in range(11)])
poly1 = sum([rkm[1,i]*x**i for i in range(11)])
poly2 = sum([rkm[2,i]*x**i for i in range(11)])

res0 = poly0.resultant(poly1)
res1 = poly1.resultant(poly2)
p = gcd(res0,res1).factor()[-1][0]

poly0 = poly0.change_ring(GF(p))
poly1 = poly1.change_ring(GF(p))
a = gcd(poly0,poly1).roots()[0][0]

M = matrix(0,12)
for row in rkm:
    M = M.stack(matrix([0]+list(row)))
    M = M.stack(matrix(list(row)+[0]))

rkm2 = M.right_kernel_matrix().LLL()
k = ZZ(rkm2.solve_left(dy[1:])[2])
rkm2 *= k

M = rkm2[::-1].stack(vector(a**i for i in range(len(dy)-1)))
dx = vector(M.left_kernel_matrix()[0, 2::-1]).lift_centered()*rkm2

gcd_a = dy[0]*(dy[2]-dx[1])-dy[1]*(dy[1]-dx[0])
gcd_b = dy[1]*(dy[3]-dx[2])-dy[2]*(dy[2]-dx[1])
P = gcd(gcd_a,gcd_b).factor()[-1][0]

A = mod((dy[1]-dx[0])/dy[0],P)
X = orbit[0]-(dy[0]-mod(ZZ(mod(dx[0]/a,p))-p,P))/A
flag = AES.new(X.to_bytes(),AES.MODE_ECB).decrypt(bytes.fromhex(star))
if not flag.isascii():
    X = orbit[0]-(dy[0]-mod(mod(dx[0]/a,p),P))/A
    flag = AES.new(X.to_bytes(),AES.MODE_ECB).decrypt(bytes.fromhex(star))

print(flag.decode()) # SEKAI{orbital_strike_like_miku_miku_beam!!!}`}]}/>
		</div>
            </div>
            <div className='footer'>
                <div className='footer-content'>
                    <div className='copyright'>© 2026 Water</div>
                    <div className='github-link'>
                        <a href = "https://www.github.com/shuizhuimiaoman" target='_blank'>
                        <img className = "footer-github-icon" src={githubicon} alt="Github Icon"></img>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SekaiCTF2026AuthorWriteups
