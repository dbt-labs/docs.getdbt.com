import React from 'react';

function WistiaVideo({id, paddingTweak = "56.25%"}) {
  return (
    <React.Fragment>
      <div className="wistia_responsive_padding" style={{padding:`${paddingTweak} 0 0 0`,position:"relative",marginBottom:"30px"}}>
        <div className="wistia_responsive_wrapper" style={{height:"100%",left:0,position:"absolute",top:0,width:"100%"}}>
          <iframe 
            src={`https://fast.wistia.net/embed/iframe/${id}?seo=false&videoFoam=true`} 
            allow="autoplay; fullscreen" 
            allowtransparency="true" 
            frameBorder="0" 
            scrolling="no" 
            className="wistia_embed" 
            name="wistia_embed" 
            allowfullscreen 
            mozallowfullscreen 
            webkitallowfullscreen 
            oallowfullscreen 
            msallowfullscreen 
            width="100%" 
            height="100%">
          </iframe>
        </div>
      </div>
      <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
    </React.Fragment>
	);
}


export default WistiaVideo;
