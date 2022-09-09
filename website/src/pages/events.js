
import React from 'react';
import Layout from '@theme/Layout';
import EventsFeed from '@site/src/components/events';


function Events() {
  return (
    <Layout>
        <div className="container events-page">
           <section>
            <h1>Events</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut leo eros, accumsan vel posuere non, iaculis ac est. Donec pretium nulla eu ornare venenatis. Nunc in purus sem. Nam quis leo magna. Etiam eu leo fermentum, fermentum justo eget, feugiat felis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris urna lacus, porttitor vitae sodales in, aliquam et tortor. Etiam in imperdiet lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>

            <p>In fringilla urna ac eleifend molestie. Praesent non tincidunt mi. Cras eu sodales sapien, sit amet feugiat diam. Aliquam velit dui, hendrerit sit amet cursus eu, mattis quis quam. Curabitur ornare magna eget nunc faucibus, ut posuere lacus vehicula. Sed augue massa, fringilla non ex vel, hendrerit tincidunt metus. Maecenas et interdum tellus, ac cursus nisi. Curabitur orci lacus, blandit eget congue non, cursus eget orci.</p>

            <EventsFeed />
           </section>
        </div>
    </Layout>
  );
}

export default Events;
