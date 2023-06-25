import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    SvgDark: require('@site/static/img/hero_package_dark.svg').default,
    SvgLight: require('@site/static/img/hero_package_light.svg').default,
    description: (
      <>
        Save time and focus on writing your game's state and logic. Simply
        create a <b>producer</b> and you're ready to go.
      </>
    ),
  },
  {
    title: 'Adaptable to Your Needs',
    SvgDark: require('@site/static/img/hero_plug_dark.svg').default,
    SvgLight: require('@site/static/img/hero_plug_light.svg').default,
    description: (
      <>
        Reflex was designed to be adaptable to a wide range of use cases, from
        client-side apps to server-side game logic.
      </>
    ),
  },
  {
    title: 'Convenient Features',
    SvgDark: require('@site/static/img/hero_folder_dark.svg').default,
    SvgLight: require('@site/static/img/hero_folder_light.svg').default,
    description: (
      <>
        Features like server-to-client state sync, creating Observers, and
        memoizing selectors come out-of-the-box with Reflex.
      </>
    ),
  }
];

function Feature({SvgDark, SvgLight, title, description}) {
  const { isDarkTheme } = useColorMode();

  const Svg = isDarkTheme ? SvgDark : SvgLight;

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
