import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';
import MapBox from '../components/map-box/';
import config from '../config.json';
import { data } from '../data.json';

const { accessToken, style } = config;

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
 
 storiesOf('Map Box', module)
  .add('with data', () => (
    <MapBox
	  accessToken={accessToken}
	  data={data}
	  mapStyle={style}
	/>
  ));


