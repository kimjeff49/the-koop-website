import App from 'next/app';
import React from 'react';
import { Router as R } from 'next/dist/client/router';
import Router from 'next/router';
import NProgress from 'nprogress';
import { motion, AnimatePresence } from 'framer-motion';

import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/static/css/styles.css';
import 'normalize.css/normalize.css';
import 'nprogress/nprogress.css';

import Nav from '../components/nav';
import Header from '../components/header';

// This is where we configure the loading bar at the top of the screen when we're moving to the next page.
NProgress.configure({ showSpinner: false });

// Router will have these events that fire based on each page load, we can run NProgress based on them.
R.events.on('routeChangeStart', () => {
  NProgress.start();
});

R.events.on('routeChangeComplete', () => {
  NProgress.done();
});

R.events.on('routeChangeError', () => {
  NProgress.done();
});
class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  getMainClass(path) {
    let mainClass = '';
    if (path.includes('admin')) {
      const params = path.split('/');
      path = `/${params[params.length - 1]}`;
    }

    switch (path) {
      case '/':
        mainClass = 'main__page';
        break;
      case '/menu':
        mainClass = 'menu__page';
        break;
      case '/location':
        mainClass = 'location__page';
        break;
      case '/story':
        mainClass = 'story__page';
        break;
      case '/catering':
        mainClass = 'catering__page';
        break;
      case '/order':
        mainClass = 'ordering__page';
        break;
      case '/checkout':
        mainClass = 'checkout__page';
      case '/login':
        mainClass = 'login__page';
        break;
      default:
        mainClass = 'main__page';
        break;
    }

    return mainClass;
  }

  render() {
    const { Component, pageProps, router } = this.props;

    const mainClass = this.getMainClass(router.pathname);

    return (
      <>
        <AnimatePresence exitBeforeEnter>
          <Header />
          <Nav />

          <div className="page-cover">
            <div className={`${mainClass}`}>
              <motion.div
                key={router.route}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-height"
              >
                <Component {...pageProps} key={router.route} />
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      </>
    );
  }
}

export function reportWebVitals(metric) {
  if (metric.label === 'custom') {
    console.log(metric);
  }
}

export default MyApp;
