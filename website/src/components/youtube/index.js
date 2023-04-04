import React from 'react';

function YoutubeVideo({id}) {
  return (
        <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"></iframe>
  );
}

export default YoutubeVideo;
