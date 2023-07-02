import a1 from '../../images/OnOff/a1.png';
import a2 from '../../images/OnOff/a2.png';
import a3 from '../../images/OnOff/a3.png';
import a4 from '../../images/OnOff/a4.png';
import a5 from '../../images/OnOff/a5.png';
import a6 from '../../images/OnOff/a6.png';
import n1 from '../../images/OnOff/n1.png';
import n2 from '../../images/OnOff/n2.png';
import n3 from '../../images/OnOff/n3.png';

const OnOffReview = () => {
    return (
        <div className='OnOffReview'>
            <div className='BlogReview'>
                <a href='https://m.blog.naver.com/72682005/222974604817' target='_blank'>
                    <button>
                        BEST 블로그 찐후기 CLICK<br/>
                        <span>https://m.blog.naver.com/72682005/222974604817</span>
                    </button>
                </a>

                <a href='https://www.instagram.com/stories/highlights/17918325605188925' target='_blank'>
                    <button>
                        더 많은 후기 CLICK<br/>
                        <span>https://www.instagram.com/stories/highlights/17918325605188925</span>
                    </button>
                </a>
            </div>
            <img src={a5} alt='a5'/>
            <img src={a6} alt='a6'/>
            <img src={a3} alt='a3'/>
            <img src={a4} alt='a4'/>
            <img src={a1} alt='a1'/>
            <img src={a2} alt='a2'/>
            <img src={n1} alt='n1'/>
            <img src={n2} alt='n2'/>
            <img src={n3} alt='n3'/>
        </div>
    );
}

export default OnOffReview;
