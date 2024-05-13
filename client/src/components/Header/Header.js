import {Helmet} from "react-helmet";

const Header = ({title, handleGoBack}) => {
  return (
    <>
      <Helmet>
        <title>{`::: ${title} :::`}</title>
      </Helmet>

      <div className='header'>
        <div className='back-btn' onClick={handleGoBack}>
          ◀
        </div>
        <div className='Path'>
          {title}
        </div>
      </div>
    </>
  );
}

export default Header;