import {Helmet} from "react-helmet-async";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const Header = ({title, handleGoBack}) => {
  return (
    <>
      <Helmet>
        <title>{`::: ${title} :::`}</title>
      </Helmet>

      <div className='header'>
        <div className='back-btn' onClick={handleGoBack}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        <div className='Path'>
          {title}
        </div>
      </div>
    </>
  );
}

export default Header;