const Image = ({ src, alt, height, width, style, onClick }) => {
    return (
      <img src={src} alt={alt} height={height} width={width} style={style} onClick={onClick} />
    );
  };
  
  export default Image;
    