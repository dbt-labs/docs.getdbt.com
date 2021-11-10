import React from 'react';

function WistiaVideo({id}) {
  return (

  	 <React.Fragment>
		 <div class="wistia_responsive_padding" style={{padding:"56.25% 0 0 0",position:"relative",marginBottom:"30px"}}>
			<div class="wistia_responsive_wrapper" style={{height:"100%",left:0,position:"absolute",top:0,width:"100%"}}>
				<iframe 
					src={`https://fast.wistia.net/embed/iframe/${id}?seo=false&videoFoam=true`} 
					allow="autoplay; fullscreen" 
					allowtransparency="true" 
					frameborder="0" 
					scrolling="no" 
					class="wistia_embed" 
					name="wistia_embed" allowfullscreen msallowfullscreen width="100%" height="100%">
				</iframe>
			</div>
		</div>
		<script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
  	 </React.Fragment>
	);
}


export default WistiaVideo;
